
import Header from '@/components/Header'
import ChromeSystem from '@/packages/chromeSystem/page'
import './App.css'

export default function App() {
  return (
    <div className="h-full">
      <Header></Header>
      <div className='overflow-y-auto h-[calc(100%-64px)]' >
        <ChromeSystem></ChromeSystem>
      </div>
    </div>
  )
}
