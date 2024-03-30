import axios from "axios";
const apiKey = process.env.REACT_APP_API_KEY;
const baseUrl = `https://api.openweathermap.org/data/2.5`;

const getWeather = async (city) => {
  return axios
    .get(`${baseUrl}/weather?q=${city}&appid=${apiKey}`)
    .then(response => {
      return response;
    })
    .catch(error => {
      console.error("Error fetching weather:", error);
      throw error;
    });
}

export { getWeather };