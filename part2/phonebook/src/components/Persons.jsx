const Persons = ({ persons, onDelete }) => (
  <div>
    {persons.map(person => (
      <div key={person.id}>
        {person.name} {person.number}
        <button onClick={() => onDelete(person.id)}>delete</button>
      </div>
    ))}
  </div>
)

export default Persons
