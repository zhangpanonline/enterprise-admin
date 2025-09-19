import { useState } from 'react'

function FixedButton() {
  const [show, setShow] = useState(false)
  const [theme, setTheme] = useState("light")

  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === "local") {
      if (changes.theme)
        setTheme(changes.theme?.newValue || "light")
    }
  })

  return (
    <>
      <button data-theme={theme} className="fixed right-5 bottom-5 z-99999 bg-primary cursor-pointer shadow-md w-[40px] h-[40px] rounded-full animate-bounce" onClick={() => setShow(!show)} />
      <div data-theme={theme} className="fixed right-15 bottom-5 z-99999 flex">
        {show && App()}
      </div>
    </>
  )
}
function App() {
  return (
    <div className="bg-white p-4 rounded-md shadow-md w-max-content h-min-content">
      <h1>S<sub>hang</sub>B<sub>an</sub></h1>
    </div>
  )
}

export default FixedButton
