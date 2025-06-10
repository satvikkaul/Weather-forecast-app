const API_KEY = 'YOUR_API_KEY'; // Replace with your OpenWeather API key

function WeatherApp() {
  const [city, setCity] = React.useState('');
  const [weather, setWeather] = React.useState(null);
  const [error, setError] = React.useState(null);

  const fetchWeather = async () => {
    if (!city) return;
    try {
      setError(null);
      setWeather(null);
      const resp = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
      if (!resp.ok) {
        throw new Error('City not found');
      }
      const data = await resp.json();
      setWeather({
        name: data.name,
        temp: data.main.temp,
        description: data.weather[0].description,
        humidity: data.main.humidity,
      });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container py-5">
      <h1 className="mb-4">React Weather App</h1>
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city"
        />
        <button className="btn btn-primary" onClick={fetchWeather}>Search</button>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      {weather && (
        <div className="card">
          <div className="card-body">
            <h2 className="card-title">{weather.name}</h2>
            <p className="card-text">Temperature: {weather.temp}&deg;C</p>
            <p className="card-text">Conditions: {weather.description}</p>
            <p className="card-text">Humidity: {weather.humidity}%</p>
          </div>
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<WeatherApp />);
