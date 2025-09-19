window.crxzp = {
    async login(code) {
        return new Promise((resolve, rej) => {
            window.postMessage({code, type: 'login'}, '*')
            // 监听响应结果
            window.addEventListener('message', (event) => {
                if (event.source !== window) return
                if (event.data.type === 'login-response') {
                    resolve(event.data.status)
                }
            })
        })
    }
}
