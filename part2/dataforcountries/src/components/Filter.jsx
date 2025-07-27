const Filter = ({ filter, setFilter }) => (
  <div>
    Find country: <input value={filter} onChange={e => setFilter(e.target.value)} />
  </div>
)

export default Filter
