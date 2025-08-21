import { useState } from "react";

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
        className="dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-2xl"
      >
        {/* {List()} */}
      </div>
    </div>
  );
}

function List() {
  return (
    <>
      {themeList.map((theme) => (
        <div className="outline-base-content overflow-hidden rounded-lg outline-2 outline-offset-2">
          <label className="bg-base-100 text-base-content w-full cursor-pointer font-sans">
            <div data-theme="theme" className="grid grid-cols-5 grid-rows-3">
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
            <input
              type="radio"
              name="theme-dropdown"
              className="theme-controller hidden"
              aria-label="theme"
              value="theme"
            />
          </label>
        </div>
      ))}
    </>
  );
}
