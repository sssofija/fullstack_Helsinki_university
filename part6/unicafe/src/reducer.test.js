import deepFreeze from 'deep-freeze'
import counterReducer from './reducer'

describe('unicafe reducer', () => {
  const initialState = {
    good: 0,
    ok: 0,
    bad: 0
  }

  test('возвращает начальное состояние при undefined', () => {
    const action = { type: 'DO_NOTHING' }
    const newState = counterReducer(undefined, action)
    expect(newState).toEqual(initialState)
  })

  test('good увеличивается', () => {
    const action = { type: 'GOOD' }
    const state = initialState

    deepFreeze(state)
    const newState = counterReducer(state, action)
    expect(newState).toEqual({ good: 1, ok: 0, bad: 0 })
  })

  test('ok увеличивается', () => {
    const action = { type: 'OK' }
    const state = initialState

    deepFreeze(state)
    const newState = counterReducer(state, action)
    expect(newState).toEqual({ good: 0, ok: 1, bad: 0 })
  })

  test('bad увеличивается', () => {
    const action = { type: 'BAD' }
    const state = initialState

    deepFreeze(state)
    const newState = counterReducer(state, action)
    expect(newState).toEqual({ good: 0, ok: 0, bad: 1 })
  })

  test('ZERO сбрасывает состояние', () => {
    const action = { type: 'ZERO' }
    const state = { good: 3, ok: 2, bad: 5 }

    deepFreeze(state)
    const newState = counterReducer(state, action)
    expect(newState).toEqual(initialState)
  })
})
