import { useState, useEffect } from 'react'
import axios from 'axios'
import process from 'process'

const Filter = ({ filter, handleFilterChange }) => 
  <p>
    find countries <input value={filter} onChange={handleFilterChange}></input>
  </p>

const Country =({ country }) => {
  const [weather, setweather] = useState({})
  const api_key = import.meta.env.VITE_SOME_KEY
  const url = `http://api.openweathermap.org/data/2.5/weather?q=${country.capital}&appid=${api_key}`
  useEffect(() => {
    axios
      .get(url)
      .then(response => {
        setweather(response.data)
      })
  }, [url])
  return (
    <div>
      <h2>{country.name.common}</h2>
      <p>capital {country.capital}</p>
      <p>area {country.area}</p>
      <h3>languages</h3>
      <ul>
        {Object.values(country.languages).map(language => <li key={language}>{language}</li>)}
      </ul>
      <img src={country.flags.png} />
      <h3>Weather in {country.capital}</h3>
      <p>temperature: {(weather.main?.temp - 273.15).toFixed(2)} Celcius</p>
      <img src={`https://openweathermap.org/img/wn/${weather.weather?.find(() => true).icon}@2x.png`} />
      <p>wind:{weather.wind?.speed} m/s</p>
    </div>
  )
}

const Countries = ({ countries, filter, setFilter }) => {
  const filterCountries = countries.filter(country => country.name.common.toLowerCase().includes(filter.toLowerCase()))
  if (filterCountries.length > 10) {
    return (
      <div>
        Too many matches, specify another filter
      </div>
    )
  } else if (filterCountries.length === 1) {
    return (
      <div>
        <Country country={filterCountries[0]}/>
      </div>
    )
  } else {
    return (
      <div>
        {
          filterCountries.map(country => 
            <p key={country.name.common}>
              {country.name.common}
              <button onClick={() => setFilter(country.name.common)}>show</button>
            </p>
          )
        }
      </div>
    )
  }
}
function App() {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])
  
  const handlerFilter = (event) => {
    setFilter(event.target.value)
  }
  console.log(countries);
  return (
    <div>
      <Filter filter={filter} handleFilterChange={handlerFilter} />
      <Countries countries={countries} filter={filter} setFilter={setFilter} />
    </div>
  )
}

export default App
