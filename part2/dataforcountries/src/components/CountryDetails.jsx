import { useEffect, useState } from 'react'
import axios from 'axios'

const CountryDetails = ({ country }) => {
  const api_key = import.meta.env.VITE_WEATHER_KEY
  const [weather, setWeather] = useState(null)
  const languages = Object.values(country.languages)

  useEffect(() => {
    const [lat, lon] = country.capitalInfo.latlng
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${api_key}`

    axios.get(url).then(response => {
      setWeather(response.data)
    })
  }, [country, api_key])

  return (
    <div>
      <h2>{country.name.common}</h2>
      <p>Capital: {country.capital}</p>
      <p>Area: {country.area} km²</p>

      <h4>Languages:</h4>
      <ul>
        {languages.map(lang => <li key={lang}>{lang}</li>)}
      </ul>

      <img src={country.flags.png} alt={`Flag of ${country.name.common}`} width="150" />

      {weather && (
        <div>
          <h3>Weather in {country.capital}</h3>
          <p>Temperature: {weather.main.temp} °C</p>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt={weather.weather[0].description}
          />
          <p>Wind: {weather.wind.speed} m/s</p>
        </div>
      )}
    </div>
  )
}

export default CountryDetails
