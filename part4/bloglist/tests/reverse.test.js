/*const { test } = require('node:test')
const assert = require('node:assert')

const reverse = require('../utils/for_testing').reverse

test('reverse of a', () => {
  const result = reverse('a')

  assert.strictEqual(result, 'a')
})

test('reverse of react', () => {
  const result = reverse('react')

  assert.strictEqual(result, 'tcaer')
})

test('reverse of saippuakauppias', () => {
  const result = reverse('saippuakauppias')

  assert.strictEqual(result, 'saippuakauppias')
})*/

const { reverse } = require('../utils/for_testing')

test('reverse of a', () => {
  const result = reverse('a')
  expect(result).toBe('a')
})

test('reverse of react', () => {
  const result = reverse('react')
  expect(result).toBe('tcaer')
})

test('reverse of saippuakauppias', () => {
  const result = reverse('saippuakauppias')
  expect(result).toBe('saippuakauppias')
})
