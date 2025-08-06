* 使用 Pinia 实现全局数据共享
* 使用 pinia-plugin-persistedstate 实现数据持久化
* 使用 secure-ls 实现数据加密

## 1. 安装依赖

```bash
pnpm install pinia secure-ls
pnpm install -D pinia-plugin-persistedstate
```

## 2. 创建 Pinia 实例

```javascript
// store/index.js
import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'
import SecureLS from 'secure-ls'

const ls = new SecureLS({ encodingType: 'aes', encryptionSecret: 'encryptionSecret' })

const pinia = createPinia()
pinia.use(createPersistedState, {
  storage: {
    getItem: key => ls.get(key),
    setItem: (key, value) => ls.set(key, value),
    removeItem: key => ls.remove(key)
  } as Storage
})

export default pinia
```