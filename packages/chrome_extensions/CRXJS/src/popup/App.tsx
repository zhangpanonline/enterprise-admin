import Header from "@/components/Header";
import Home from "@/packages/home/page";
import ChromeSystem from "@/packages/chromeSystem/page";
import Gsap from "@/packages/gsap/page";
import WebRequest from "@/packages/webRequest/page";
import { useState } from "react";
import "./App.css";

export default function App() {
  const [menu, setMenu] = useState("home");
  const menuList = [
    { label: "首页", key: "home" },
    { label: "GSAP", key: "gsap" },
    { label: "系统信息", key: "chromeSystem" },
    { label: "接口监控面板", key: "webRequest" },
  ];
  const handleMenu = (menu: string) => {
    setMenu(menu)
    chrome.runtime.sendMessage({ type: 'notifications', options: {
      type: "basic",
      title: 'title',
      iconUrl: chrome.runtime.getURL('/images/icon1-16.png'),
      message: 'contextMessage'
    } });
  }
  return (
    <div className="h-full">
      <Header menuList={menuList} handleMenuClick={handleMenu}></Header>
      <div className="overflow-y-auto h-[calc(100%-64px)]">
        {getPage(menu)}
      </div>
    </div>
  );
}

function getPage(menu: string) {
  switch (menu) {
    case "gsap":
      return <Gsap></Gsap>;
    case "chromeSystem":
      return <ChromeSystem></ChromeSystem>;
    case "webRequest":
      return <WebRequest></WebRequest>;
    default:
      return <Home></Home>;
  }
}
