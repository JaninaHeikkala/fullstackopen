import axios from "axios";
const baseUrl = 'https://studies.cs.helsinki.fi/restcountries';

const getCountries = async () => {
  return axios
    .get(`${baseUrl}/api/all`)
    .then(response => {
      return response;
    })
    .catch(error => {
      console.error("Error fetching countries:", error);
      throw error;
    });
}

const getCountry = async (name) => {
  console.log(`${baseUrl}/api/name/${name}`);
  return axios
    .get(`${baseUrl}/api/name/${name}`)
    .then(response => {
      return response;
    })
    .catch(error => {
      console.error("Error fetching country:", error);
      throw error;
    });
}

export { getCountries, getCountry };