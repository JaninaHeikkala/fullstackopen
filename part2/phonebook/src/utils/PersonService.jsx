import axios from "axios";
const baseUrl = 'http://localhost:3001/persons';

const getPersons = async () => {
  return axios
    .get(baseUrl)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      console.error("Error fetching persons:", error);
      throw error;
    });
}

const addPerson = async (personObject) => {
  return axios
    .post(baseUrl, personObject)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      console.error("Error adding person:", error);
      throw error;
    });
}

const deletePerson = async (id) => {
  return axios
    .delete(`${baseUrl}/${id}`)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      console.error("Error deleting person:", error);
      throw error;
    });
}

const editPerson = async (id, personObject) => {
  return axios
    .put(`${baseUrl}/${id}`, personObject)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      console.error("Error adding person:", error);
      throw error;
    });
}

export { getPersons, addPerson, deletePerson, editPerson };