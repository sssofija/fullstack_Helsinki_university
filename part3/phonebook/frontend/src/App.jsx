import { useState, useEffect } from 'react'
import personsService from '../services/persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState({ message: null, type: '' })

  useEffect(() => {
    personsService.getAll().then(initial => {
      setPersons(initial)
    })
  }, [])

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification({ message: null, type: '' })
    }, 5000)
  }

  const addPerson = (event) => {
    event.preventDefault()
    const existing = persons.find(p => p.name === newName)

    if (existing) {
      const ok = window.confirm(
        `${newName} is already added to phonebook. Replace the number?`
      )
      if (ok) {
        const updated = { ...existing, number: newNumber }
        personsService
          .update(existing.id, updated)
          .then(returned => {
            setPersons(persons.map(p => p.id !== existing.id ? p : returned))
            showNotification(`Updated number for ${returned.name}`, 'success')
            setNewName('')
            setNewNumber('')
          })
          .catch(error => {
            showNotification(
              error.response?.data?.error || 'Error updating person',
              'error'
            )
            setPersons(persons.filter(p => p.id !== existing.id))
          })
      }
      return
    }

    const newPerson = { name: newName, number: newNumber }

    personsService.create(newPerson)
      .then(returned => {
        setPersons([...persons, returned])
        showNotification(`Added ${returned.name}`, 'success')
        setNewName('')
        setNewNumber('')
      })
      .catch(error => {
        showNotification(error.response?.data?.error || 'Error adding person', 'error')
      })
  }

  const handleDelete = (id) => {
    const person = persons.find(p => p.id === id)
    if (window.confirm(`Delete ${person.name}?`)) {
      personsService.remove(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id))
          showNotification(`Deleted ${person.name}`, 'delete')
        })
        .catch(() => {
          showNotification(
            `${person.name} was already removed from the server`,
            'error'
          )
          setPersons(persons.filter(p => p.id !== id))
        })
    }
  }

  const filtered = persons.filter(p =>
    p.name.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification.message} type={notification.type} />
      <Filter value={filter} onChange={e => setFilter(e.target.value)} />

      <h3>Add a new</h3>
      <PersonForm
        onSubmit={addPerson}
        nameValue={newName}
        onNameChange={e => setNewName(e.target.value)}
        numberValue={newNumber}
        onNumberChange={e => setNewNumber(e.target.value)}
      />

      <h3>Numbers</h3>
      <Persons persons={filtered} onDelete={handleDelete} />
    </div>
  )
}

export default App
