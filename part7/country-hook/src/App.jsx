import React, { useState, useEffect } from 'react'
import axios from 'axios'

const baseUrl = `https://studies.cs.helsinki.fi/restcountries/api/name`
const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}

const useCountry = (name) => {
  const [country, setCountry] = useState(null)
  console.log('into use country')
  useEffect(() => {
    axios
      .get(`${baseUrl}/${name}`)
      .then(response => {
        setCountry(response.data)
        console.log(response.data)
      })
      .catch(error => {
        setCountry(null)
      })
  }, [name])

  return country
}

const Country = ({ country }) => {
  // if (!country) {
  //   return null
  // }

  if (!country) {
    return (
      <div>
        not found...
      </div>
    )
  }

  return (
    <div>
      <h3>{country.name.common} </h3>
      <div>capital {country.capital} </div>
      <div>population {country.population}</div> 
      <img src={country.flags.png} height='100' alt={`flag of ${country.name.common}`}/>  
    </div>
  )
}

const App = () => {
  const nameInput = useField('text')
  const [name, setName] = useState('')
  const country = useCountry(name)
  console.log('country', country)

  const fetch = (e) => {
    e.preventDefault()
    setName(nameInput.value)
  }

  console.log(name)
  return (
    <div>
      <form onSubmit={fetch}>
        <input {...nameInput} />
        <button>find</button>
      </form>

      <Country country={country} />
    </div>
  )
}

export default App