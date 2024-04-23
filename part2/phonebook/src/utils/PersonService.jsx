import axios from "axios";
const baseUrl = 'http://localhost:3001'; //'https://fsopart3-nq7z.onrender.com';

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
  try {
    const response = await axios.post(`${baseUrl}/api/persons`, personObject);
    return response;
  } catch (error) {
    if (error.response && error.response.status === 400) {
      return error.response;
    } else {
      console.error("Error adding person:", error);
      throw new Error("Failed to add person. Please try again later.");
    }
  }
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