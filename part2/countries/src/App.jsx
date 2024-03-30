import { useState } from "react";
import { getCountries } from "./utils/CountryService";
import { useEffect } from "react";
import { getWeather } from "./utils/WeatherService";

function App() {
  const [search, setSearch] = useState("");
  const [display, setDisplay] = useState("");
  const [countries, setCountries] = useState(null);
  const [weather, setWeather] = useState("");

  useEffect(() => {
    const getAllCountries = async () => {
      const response = await getCountries();
      setCountries(response.data);
    };
    getAllCountries();
  }, []);

  const handleSearchChange = async (event) => {
    setSearch(event.target.value);
    handleShowCountry(event.target.value);
  };

  const handleShowCountry = (name) => {
    setDisplay(countries.filter((country) => country.name.common.toLowerCase().includes(name.toLowerCase())));
  };

  useEffect(() => {
    const getWeatherForCapital = async () => { 
      if (display.length === 1) {
        const response = await getWeather(display[0].capital);
        if (response.status === 200) {
          setWeather(response.data);
        }
      }
    }
    getWeatherForCapital();
  }, [display]);

  if (!countries) {
    return (
      <div>loading...</div>
    )
  };

  return (
    <div>
      <form onSubmit={(event) => event.preventDefault()}>
        <div>find countries <input value={search} onChange={handleSearchChange}/></div>
      </form>
      { search.length === 0 ? (
        <div>

        </div>
      ) : display.length > 10 ? (
        <div>
          too many matches
        </div>
      ) : display.length === 0 ? (
        <div>
          no countries found
        </div>
      ) : display.length > 1 && display.length <= 10 ? (
        <div>
          {display.map((value, key) => (
            <div key={key}>
              {value.name.common} 
              <button 
                onClick={() => handleShowCountry(value.name.common)}>
                  show
              </button>
            </div>
          ))}
        </div>
      ) : display.length === 1 ? (
        <>
          {weather === "" ? (
            (null)
          ) : (
            <div>
            <h1>{display[0].name.common}</h1>
            <p>capital {display[0].capital}</p>
            <p>area {display[0].area}</p>
            <p style={{fontWeight: "bold"}}>languages:</p>
            <ul>
              {Object.values(display[0].languages).map((language, index) => (
                <li key={index}>{language}</li>
              ))}
            </ul>
            <img src={display[0].flags.png} alt="Flag of country" />
            <h1>Weather in {display[0].capital}</h1>
            <p>temperature {(weather.main.temp + -272.15).toFixed(2)} Celsius</p>
            <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt="Picture of weather condition" />
            <p>wind {weather.wind.speed} m/s</p>
          </div>
        )}
        </>
      ) : (
        <div>
          holdon
        </div>
      )}
    </div>
  )
}

export default App
