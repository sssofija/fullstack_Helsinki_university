import React from 'react'
import ReactDOM from 'react-dom/client'
import { createStore } from 'redux'
import { Provider, useDispatch, useSelector } from 'react-redux'
import counterReducer from './reducer'

const store = createStore(counterReducer)

const App = () => {
  const dispatch = useDispatch()
  const { good, ok, bad } = useSelector(state => state)

  return (
    <div>
      <button onClick={() => dispatch({ type: 'GOOD' })}>good</button>
      <button onClick={() => dispatch({ type: 'OK' })}>ok</button>
      <button onClick={() => dispatch({ type: 'BAD' })}>bad</button>
      <button onClick={() => dispatch({ type: 'ZERO' })}>reset stats</button>
      <div>good {good}</div>
      <div>ok {ok}</div>
      <div>bad {bad}</div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
)
