import { useState, useEffect } from 'react';
import Persons from './components/Persons';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import { getPersons, addPerson, deletePerson, editPerson } from './utils/PersonService';
import Alert from './components/Alert';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState(''); 
  const [personsToShow, setPersonsToShow] = useState([...persons]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");

  const fetchData = async () => {
    try {
      const response = await getPersons();
      const delButtonAdded = response.map((person) => ({
        name: person.name,
        number: person.number,
        id: person.id,
        btn: <button onClick={() => handleDeletePerson(person.id, person.name)}>delete</button>
      }));
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
      const personObject = {
        name: newName,
        number: newNumber,
      };
      const response = await addPerson(personObject);
      if (response.status === 200) {
        setPersons([...persons, { ...response.data, btn: <button onClick={() => handleDeletePerson(response.data.id, newName)}>delete</button> }]);
        handleAlert("Added " + newName, "success");
      }
      else if (response.status === 400) {
        handleAlert(response.data.error, "error");
      }
      setNewName('');
      setNewNumber('');
      setFilter(filter);
    }
    else {
      if (window.confirm(newName + " is already added to the phonebook, replace the old phone number with a new one?")) {
        const person = persons.find(p => p.name === newName);
        const changedPerson = { ...person, number: newNumber, btn: undefined };
        const response = await editPerson(person.id, changedPerson, newName);
        if (response.status === 200) {
          handleAlert("Changed the phone number of " + newName, "success");
        } else if (response.status === 404) {
          handleAlert("Information about " + newName + " has already been removed from the server", "error");
        } else if (response.status === 400) {
          handleAlert(response.data.error, "error");
        }
        fetchData();
      }
    }
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleAlert = (message, alertType) => {
    setAlertType(alertType);
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
      setAlertMessage("");
    }, 4000);
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
      number: person.number,
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
      <Alert message={alertMessage} type={alertType} showAlert={showAlert}></Alert>
      <Filter filter={filter} onChange={handleFilterChange}></Filter>
      <h2>add new</h2>
      <PersonForm 
        onSubmit={onSubmit} 
        newName={newName} 
        handleNameChange={handleNameChange} 
        newNumber={newNumber} 
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons personsToShow={personsToShow}></Persons>
    </div>
  )
}

export default App

