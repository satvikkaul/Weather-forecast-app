const API_KEY = 'YOUR_API_KEY'; // Replace with your OpenWeather API key

function parseForecast(data) {
  // group forecast entries by date and pick noon for each day
  const days = {};
  data.list.forEach((item) => {
    const date = item.dt_txt.split(' ')[0];
    if (item.dt_txt.includes('12:00:00') && !days[date]) {
      days[date] = {
        date,
        temp: item.main.temp,
        description: item.weather[0].description,
      };
    }
  });
  return Object.values(days).slice(0, 3); // next 3 days
}

function WeatherApp() {
  const [city, setCity] = React.useState('');
  const [weather, setWeather] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const fetchWeather = async () => {
    if (!city) return;
    if (API_KEY === 'YOUR_API_KEY') {
      setError('Please set your OpenWeather API key in app.jsx');
      return;
    }
    try {
      setError(null);
      setWeather(null);
      setLoading(true);
      const resp = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
      if (!resp.ok) {
        throw new Error('City not found');
      }
      const data = await resp.json();

      const forecastResp = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`);
      let forecast = [];
      if (forecastResp.ok) {
        const forecastData = await forecastResp.json();
        forecast = parseForecast(forecastData);
      }

      setWeather({
        name: data.name,
        temp: data.main.temp,
        description: data.weather[0].description,
        humidity: data.main.humidity,
        wind: data.wind.speed,
        icon: data.weather[0].icon,
        forecast,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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
      {loading && (
        <div className="d-flex justify-content-center my-3">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      {error && <div className="alert alert-danger">{error}</div>}
      {weather && (
        <div className="card">
          <div className="card-body">
            <h2 className="card-title">{weather.name}</h2>
            <div className="d-flex align-items-center mb-3">
              <img src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`} alt={weather.description} className="me-3" />
              <div>
                <p className="mb-0">Temperature: {weather.temp}&deg;C</p>
                <p className="mb-0">Conditions: {weather.description}</p>
                <p className="mb-0">Humidity: {weather.humidity}%</p>
                <p className="mb-0">Wind: {weather.wind} m/s</p>
              </div>
            </div>
            {weather.forecast.length > 0 && (
              <div>
                <h3 className="h5 mt-4">3-day Forecast</h3>
                <ul className="list-group">
                  {weather.forecast.map((f) => (
                    <li key={f.date} className="list-group-item d-flex justify-content-between align-items-center">
                      <span>{f.date}</span>
                      <span>{f.temp}&deg;C - {f.description}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<WeatherApp />);
