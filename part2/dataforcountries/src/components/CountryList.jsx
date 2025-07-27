import { useState } from 'react'
import CountryDetails from './CountryDetails'

const CountryList = ({ countries }) => {
  const [selectedCountry, setSelectedCountry] = useState(null)

  if (countries.length > 10) {
    return <p>Too many matches, please refine your filter</p>
  }

  if (selectedCountry) {
    return <CountryDetails country={selectedCountry} />
  }

  if (countries.length === 1) {
    return <CountryDetails country={countries[0]} />
  }

  return (
    <ul>
      {countries.map(country => (
        <li key={country.name.common}>
          {country.name.common}
          <button onClick={() => setSelectedCountry(country)}>open</button>
        </li>
      ))}
    </ul>
  )
}

export default CountryList
