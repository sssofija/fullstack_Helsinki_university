import { useDispatch } from 'react-redux'
import { setFilter } from '../reducers/filterReducer'

const Filter = () => {
  const dispatch = useDispatch()

  return (
    <div style={{ marginBottom: 10 }}>
      <input onChange={(e) => dispatch(setFilter(e.target.value))} placeholder="filter anecdotes" />
    </div>
  )
}

export default Filter
