export default function mock(num = 1000) {
    return new Array(num).fill(null).map((_, i) => ({
        id: 'id' + (i + 1),
        name: `name-${i + 1}`,
        age: Math.floor(Math.random() * 100).toString(),
        address: `address-${i + 1}`,
        createTime: new Date().toLocaleString(),
    }))
}