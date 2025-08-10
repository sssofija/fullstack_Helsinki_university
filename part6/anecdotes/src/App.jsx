import { useSelector, useDispatch } from 'react-redux'
import { vote, next } from './reducers/anecdoteReducer'
import Filter from './components/Filter'

const App = () => {
  const { list, selected } = useSelector(state => state.anecdotes)
  const filter = useSelector(state => state.filter)
  const dispatch = useDispatch()

  const filteredList = list.filter(a =>
    a.content.toLowerCase().includes(filter.toLowerCase())
  )

  const votes = filteredList.map(a => a.votes)
  const maxVotes = Math.max(...votes)
  const topIndex = votes.indexOf(maxVotes)

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <Filter />

      {filteredList.length > 0 ? (
        <>
          <p>{filteredList[selected % filteredList.length].content}</p>
          <p>has {filteredList[selected % filteredList.length].votes} votes</p>
          <button onClick={() => dispatch(vote())}>vote</button>
          <button onClick={() => dispatch(next())}>next anecdote</button>

          <h1>Anecdote with most votes</h1>
          <p>{filteredList[topIndex].content}</p>
          <p>has {filteredList[topIndex].votes} votes</p>
        </>
      ) : (
        <p>No anecdotes match the filter.</p>
      )}
    </div>
  )
}

export default App
