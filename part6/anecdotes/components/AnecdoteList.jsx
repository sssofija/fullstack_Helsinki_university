import { useSelector, useDispatch } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { showNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(state => {
    const filter = state.filter.toLowerCase()
    return [...state.anecdotes]
      .filter(a => a.content.toLowerCase().includes(filter))
      .sort((a, b) => b.votes - a.votes)
  })

  const vote = (id, content) => {
    dispatch(voteAnecdote(id))
    dispatch(showNotification(`you voted '${content}'`, 5))
  }

  return (
    <div>
      {anecdotes.map(a =>
        <div key={a.id}>
          <div>{a.content}</div>
          <div>
            has {a.votes} <button onClick={() => vote(a.id, a.content)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnecdoteList
