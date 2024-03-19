import { useState, useEffect } from 'react';
import Persons from './components/Persons';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import { getPersons, addPerson, deletePerson, editPerson } from './utils/PersonService';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newPhoneNumber, setNewPhoneNumber] = useState('');
  const [filter, setFilter] = useState(''); 
  const [personsToShow, setPersonsToShow] = useState([...persons]);

  const fetchData = async () => {
    try {
      const response = await getPersons();
      const delButtonAdded = response.map((person) => ({
        name: person.name,
        phoneNumber: person.phoneNumber,
        id: person.id,
        btn: <button onClick={() => handleDeletePerson(person.id, person.name)}>delete</button>
      }))
      setPersons(delButtonAdded);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!persons.some(person => person.name === newName)) {
      const maxId = Math.max(...persons.map(person => person.id));
      const newId = (maxId + 1).toString();
      const personObject = {
        name: newName,
        phoneNumber: newPhoneNumber,
        id: newId
      }
      const response = await addPerson(personObject);
      setPersons([...persons, { ...response, id: newId, btn: <button onClick={() => handleDeletePerson(newId, newName)}>delete</button> }]);
      setNewName('');
      setNewPhoneNumber('');
      setFilter(filter);
    }
    else {
      if (window.confirm(newName + "is already added to the phonebook, replace the old phone number with a new one?")) {
        const person = persons.find(p => p.name === newName);
        const changedPerson = { ...person, phoneNumber: newPhoneNumber, btn: undefined };
        const response = await editPerson(person.id, changedPerson);
        fetchData();
      }
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

  const updateFilter = async (filter) => {
    const filteredPersons = persons.filter(person =>
      person.name.toLowerCase().includes(filter.toLowerCase())
    );
    const filteredData = filteredPersons.map(person => ({
      name: person.name,
      phoneNumber: person.phoneNumber,
      id: person.id,
      btn: person.btn
    }));
    setPersonsToShow(filteredData);
  };

  const handleDeletePerson = async (id, name) => {
    if (window.confirm("delete " + name + "?")) {
      const response = await deletePerson(id);
      fetchData();
    }
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

