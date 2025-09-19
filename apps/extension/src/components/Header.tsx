import ChangeTheme from "@/packages/changeTheme/page";

type MenuList = Array<{ label: string, key: string }>
export default function Header({ menuList, handleMenuClick }: { menuList: MenuList, handleMenuClick: (menu: string) => void }) {
  interface CustomCSSProperties extends React.CSSProperties {
  "-webkit-box-orient"?: string;
}
  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="navbar-start w-20">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {" "}
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h7"
              />{" "}
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            {
              menuList.map(({ label, key }) => <li key={key} onClick={() => handleMenuClick(key)} >
                <a>{label}</a>
              </li>)
            }
          </ul>
        </div>
      </div>
      <div
        style={{
          display: "-webkit-box",
          "-webkit-box-orient": "vertical",
          "-webkit-line-clamp": "1",
        } as CustomCSSProperties}
        className="navbar-center text-xl overflow-ellipsis flex-1 overflow-hidden text-nowrap text-center"
      >
        CRXJS + React + Vite + Daisy UI + tailwindcss { import.meta.env.DEV && "（dev）" }
      </div>
      <div className="navbar-end text-nowrap w-[110px]">
        <ChangeTheme></ChangeTheme>
      </div>
    </div>
  );
}
