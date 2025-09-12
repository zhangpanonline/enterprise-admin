declare global {
    interface $wujie {
        bus: {
            $on: (string, Function) => void,
            $emit: (string, Function) => void,
            $off: (string, Function) => void,
        }
    }
}

export {}
