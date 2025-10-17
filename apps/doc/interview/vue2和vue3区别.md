---
sidebar_position: 3
---

## 1. Proxy 与 Object.defineProperty 优劣对比

### Proxy 的优势
* `Proxy` 可以直接监听对象而非属性
* `Proxy` 可以直接监听数组的变化
* `Proxy` 有多达 13 种拦截方法,不限于 `get`、`set` 等，是 `Object.defineProperty` 不具备的
* `Proxy` 返回的是一个新对象，我们可以只操作新的对象达到目的，而 `Object.defineProperty` 只能遍历对象属性直接修改，特别耗费性能
### Object.defineProperty 的优势
* 兼容性好，支持 `IE9`，而 `Proxy` 的存在浏览器兼容性问题,而且无法用 `polyfill` 磨平，因此在`Vue3`才能用 `Proxy` 重写