const Persons = ({ persons, onRemove }) => (
  <div>
    {persons.map(person => (
      <div key={person.id}>
        {person.name} {person.number}
        <button onClick={() => onRemove(person)}>delete</button>
      </div>
    ))}
  </div>
)

export default Persons
