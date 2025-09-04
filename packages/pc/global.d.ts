declare global {
    interface Window {
        crxzp: {
            login: (string) => Promise<string>
        }
    }
}

export {}
