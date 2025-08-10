import { useDispatch } from 'react-redux'
import { setFilter } from '../reducers/filterReducer'

const Filter = () => {
  const dispatch = useDispatch()

  const handleChange = (event) => {
    dispatch(setFilter(event.target.value))
  }

  return (
    <div style={{ marginBottom: 10 }}>
      <input onChange={handleChange} placeholder="filter anecdotes" />
    </div>
  )
}

export default Filter
