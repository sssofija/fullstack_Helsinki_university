import { useEffect, useState } from 'react'

import Filter from './components/Filter'
import Notification from './components/Notification'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personService from '../services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState({ message: null, type: '' })

  useEffect(() => {
    personService.getAll().then(setPersons)
  }, [])

  const clearForm = () => {
    setNewName('')
    setNewNumber('')
  }

  const notifyWith = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification({ message: null, type: '' })
    }, 5000)
  }

  const updatePerson = person => {
    const confirmUpdate = window.confirm(
      `${newName} is already added to phonebook. Replace the number?`
    )
    if (!confirmUpdate) return

    const updatedPerson = { ...person, number: newNumber }

    personService
      .update(person.id, updatedPerson)
      .then(returned => {
        setPersons(persons.map(p => (p.id !== person.id ? p : returned)))
        notifyWith(`Updated number for ${returned.name}`, 'success')
        clearForm()
      })
      .catch(error => {
        if (error.response?.status === 400) {
          notifyWith(error.response.data.error, 'error')
        } else if (error.response?.status === 404) {
          notifyWith(
            `Information of ${person.name} has already been removed from server`,
            'error'
          )
          setPersons(persons.filter(p => p.id !== person.id))
        } else {
          notifyWith('An unexpected error occurred', 'error')
        }
      })
  }

  const onAddNew = event => {
    event.preventDefault()
    const existingPerson = persons.find(p => p.name === newName)

    if (existingPerson) {
      updatePerson(existingPerson)
      return
    }

    const newPerson = { name: newName, number: newNumber }

    personService
      .create(newPerson)
      .then(created => {
        setPersons([...persons, created])
        notifyWith(`Added ${created.name}`, 'success')
        clearForm()
      })
      .catch(error => {
        notifyWith(error.response?.data?.error || 'Error adding person', 'error')
      })
  }

  const onRemove = person => {
    const confirmDelete = window.confirm(`Delete ${person.name}?`)
    if (!confirmDelete) return

    personService
      .remove(person.id)
      .then(() => {
        setPersons(persons.filter(p => p.id !== person.id))
        notifyWith(`Deleted ${person.name}`, 'delete')
      })
      .catch(() => {
        notifyWith(
          `${person.name} was already removed from the server`,
          'error'
        )
        setPersons(persons.filter(p => p.id !== person.id))
      })
  }

  const personsToShow = persons.filter(p =>
    p.name.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={notification.message} type={notification.type} />

      <Filter filter={filter} setFilter={setFilter} />

      <h2>Add a new</h2>
      <PersonForm
        onAddNew={onAddNew}
        newName={newName}
        newNumber={newNumber}
        setNewName={setNewName}
        setNewNumber={setNewNumber}
      />

      <h2>Numbers</h2>
      <Persons persons={personsToShow} onRemove={onRemove} />
    </div>
  )
}

export default App
