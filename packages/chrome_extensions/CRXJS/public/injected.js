window.crxzp = {
    async login(code) {
        return new Promise((resolve, rej) => {
            window.postMessage({code, type: 'login'}, '*')
            // 监听响应结果
            resolve('success')
        })
    }
}
