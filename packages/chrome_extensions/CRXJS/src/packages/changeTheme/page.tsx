const themeList = [
  "light",
  "dark",
  "cupcake",
  "bumblebee",
  "emerald",
  "corporate",
  "synthwave",
  "retro",
  "cyberpunk",
  "valentine",
  "halloween",
  "garden",
  "forest",
  "aqua",
  "lofi",
  "pastel",
  "fantasy",
  "wireframe",
  "black",
  "luxury",
  "dracula",
  "cmyk",
  "sutumn",
  "business",
  "acid",
  "lemonade",
  "night",
  "coffee",
  "winter",
];

export default function Page() {
  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-sm rounded-full m-1">
        主题切换
        <svg
          width="12px"
          height="12px"
          className="inline-block h-2 w-2 fill-current opacity-60"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 2048 2048"
        >
          <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
        </svg>
      </div>
      <div
        tabIndex={0}
        className="dropdown-content top-10 bg-base-100 rounded-box z-1 w-80 p-2 shadow-2xl grid grid-cols-2 gap-2 h-137 overflow-y-auto"
      >
        {List()}
      </div>
    </div>
  );
}

function List() {
  chrome.storage.local.get(["theme"], (res) => {
    document.documentElement.setAttribute("data-theme", res.theme || "light");
  });
  function handleChangeTheme(theme: string) {
    document.documentElement.setAttribute("data-theme", theme);
    chrome.storage.local.set({ theme });
  }
  return (
    <>
      {themeList.map((theme) => (
        <div
          data-theme={theme}
          key={theme}
          className="outline-base-content overflow-hidden rounded-full outline mb-2 cursor-pointer h-11"
          onClick={() => handleChangeTheme(theme)}
        >
          <div className="grid grid-cols-5 grid-rows-3">
            <div className="col-span-5 row-span-3 row-start-1 flex gap-1 py-3 px-4">
              <div className="flex-grow text-sm font-bold">{theme}</div>{" "}
              <div className="flex flex-shrink-0 flex-wrap gap-1">
                <div className="bg-primary w-2 rounded"></div>{" "}
                <div className="bg-secondary w-2 rounded"></div>{" "}
                <div className="bg-accent w-2 rounded"></div>{" "}
                <div className="bg-neutral w-2 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
