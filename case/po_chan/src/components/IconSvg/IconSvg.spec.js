import { mount } from '@vue/test-utils'
import IconSvg from './IconSvg.vue'
import { describe, test, expect } from 'vitest'

describe('IconSvg.vue', () => {
  const name_old = 'menu-case_home'
  const name_new = 'menu-bulletin'
  const size_old = 50
  const size_new = '100'
  const color_old = 'red'
  const color_new = 'green'
  test('根据入参name渲染对应SVG图标', async() => {
    const wrapper = mount(IconSvg, { attrs: { name: name_old }})
    expect(wrapper.get('use').attributes('href')).toBe('#' + name_old)
    await wrapper.setProps({ name: name_new })
    expect(wrapper.get('use').attributes('href')).not.toBe('#' + name_old)
    expect(wrapper.get('use').attributes('href')).toBe('#' + name_new)
  })
  test('根据入参size改变SVG图标大小', async() => {
    const wrapper = mount(IconSvg, { attrs: { size: size_old }})
    expect(wrapper.findComponent({ name: 'ElIcon' }).vm.size).toBe(size_old)
    await wrapper.setProps({ size: size_new })
    expect(wrapper.findComponent({ name: 'ElIcon' }).vm.size).not.toBe(size_old)
    expect(wrapper.findComponent({ name: 'ElIcon' }).vm.size).toBe(size_new)
  })
  test('根据入参color改变SVG图标颜色', async() => {
    const wrapper = mount(IconSvg, { attrs: { color: color_old }})
    expect(wrapper.get('svg').attributes('color')).toBe(color_old)
    await wrapper.setProps({ color: color_new })
    expect(wrapper.get('svg').attributes('color')).not.toBe(color_old)
    expect(wrapper.get('svg').attributes('color')).toBe(color_new)
  })
})
