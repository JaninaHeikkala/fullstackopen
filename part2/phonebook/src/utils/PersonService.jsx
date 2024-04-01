import axios from "axios";
const baseUrl = ''; //'https://fsopart3-nq7z.onrender.com';

const getPersons = async () => {
  console.log(`${baseUrl}/api/persons`);
  return axios
    .get(`${baseUrl}/api/persons`)
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
    .post(`${baseUrl}/api/persons`, personObject)
    .then(response => {
      return response;
    })
    .catch(error => {
      console.error("Error adding person:", error);
      throw error;
    });
}

const deletePerson = async (id) => {
  return axios
    .delete(`${baseUrl}/api/persons/${id}`)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      console.error("Error deleting person:", error);
      throw error;
    });
}

const editPerson = async (id, personObject, newName) => {
  return axios
    .put(`${baseUrl}/api/persons/${id}`, personObject)
    .then(response => {
      return response;
    })
    .catch(error => {
      return error.response;
    });
}

export { getPersons, addPerson, deletePerson, editPerson };