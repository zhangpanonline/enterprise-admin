import { describe, test, afterAll, afterEach, beforeAll } from 'vitest'
import { setupServer } from 'msw/node'
import { HttpResponse, http } from 'msw'
// import axios from 'axios'
const server = setupServer(
  http.get('https://api.zhushucloud.net/bankrupt/lookDict/findByCode?code=voucherCategory', () => {
    console.log('###')
    return HttpResponse.json({
      firstName: 'John',
      lastName: 'Maverick',
    })
  })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
// rest.get('https://api.zhushucloud.net/bankrupt/lookDict/findByCode?code=voucherCategory', (req, res, ctx) => {

describe('MyComponent', () => {
  test('fetches data asynchronously', async() => {
    const response = await getDictApi({ code: 'voucherCategory' })
    // const response = await axios.get('https://api.zhushucloud.net/bankrupt/lookDict/findByCode?code=voucherCategory')
    console.log(response, '@@@')
  })
})
