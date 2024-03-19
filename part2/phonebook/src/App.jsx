import { useState, useEffect } from 'react';
import Persons from './components/Persons';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import axios from "axios";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newPhoneNumber, setNewPhoneNumber] = useState('');
  const [filter, setFilter] = useState(''); 
  const [personsToShow, setPersonsToShow] = useState([...persons]);

  useEffect(() => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        console.log(response.data)
        setPersons(response.data)
      })
  }, []);

  const onSubmit = (event) => {
    event.preventDefault();
    if (!persons.some(person => person.name === newName)) {
      const maxId = Math.max(...persons.map(person => person.id));
      setPersons([...persons, { name: newName, phoneNumber: newPhoneNumber, id: maxId + 1 }]);
      setNewName('');
      setNewPhoneNumber('');
      setFilter(filter);
    }
    else {
      handleAlert();
    }
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handlePhoneNumberChange = (event) => {
    setNewPhoneNumber(event.target.value);
  };

  const handleAlert = () => {
    window.alert(`${newName} is already added to phonebook`);
  };

  const handleFilterChange = (event) => {
    const newFilter = event.target.value;
    setFilter(newFilter);
    updateFilter(newFilter);
  };

  useEffect(() => {
    updateFilter(filter);
  }, [persons]);

  const updateFilter = (filter) => {
    const filteredPersons = persons.filter(person =>
      person.name.toLowerCase().includes(filter.toLowerCase())
    );
    const filteredData = filteredPersons.map(person => ({
      name: person.name,
      phoneNumber: person.phoneNumber,
      id: person.id
    }));
    setPersonsToShow(filteredData);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} onChange={handleFilterChange}></Filter>
      <h2>add new</h2>
      <PersonForm 
        onSubmit={onSubmit} 
        newName={newName} 
        handleNameChange={handleNameChange} 
        newPhoneNumber={newPhoneNumber} 
        handlePhoneNumberChange={handlePhoneNumberChange}
      />
      <h2>Numbers</h2>
      <Persons personsToShow={personsToShow}></Persons>
    </div>
  )
}

export default App

