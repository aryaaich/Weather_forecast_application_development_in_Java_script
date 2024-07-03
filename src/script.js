document.addEventListener("DOMContentLoaded", function() {
    const apiKey = '6cc531beced34b3fb0d70330240307'; 
    const weatherDiv = document.getElementById('weather');
    const forecastDiv = document.getElementById('forecast');
    const inputbox = document.getElementById('inputbox');
    const submitbutton = document.getElementById('submitbutton');
    const currentLocationBtn = document.getElementById('current-location-btn');

    function fetchWeather(city) {
        const weatherUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;
        fetch(weatherUrl)
            .then(response => response.json())
            .then(data => {
                displayWeather(data);
                fetchForecast(city);
            })
            .catch(error => console.error('Error fetching weather data:', error));
    }

    function fetchForecast(city) {
        const forecastUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=5`;
        fetch(forecastUrl)
            .then(response => response.json())
            .then(data => {
                displayForecast(data);
            })
            .catch(error => console.error('Error fetching forecast data:', error));
    }

    function displayWeather(data) {
        const weatherDetails = `
            <h2 class="text-2xl font-bold mb-2">${data.location.name} Weather</h2>
            <p class="text-lg">Temperature 🌡️: ${data.current.temp_c}°C</p>
            <p class="text-lg">Humidity 💧: ${data.current.humidity}%</p>
            <p class="text-lg">Weather 🌤️: ${data.current.condition.text}</p>
        `;
        weatherDiv.innerHTML = weatherDetails;
    }

    function displayForecast(data) {
        let forecastDetails = '<h2 class="text-2xl font-bold mb-2">5 Day Forecast</h2>';
        forecastDetails += '<div class="grid grid-cols-1 md:grid-cols-5 gap-4">'; 
        data.forecast.forecastday.forEach(item => {
            forecastDetails += `
                <div class="bg-white p-4 rounded-lg shadow-lg">
                    <p class="text-lg font-bold">${new Date(item.date).toLocaleDateString()}</p>
                    <p class="text-lg">Temp: ${item.day.avgtemp_c}°C</p>
                    <p class="text-lg">Condition: ${item.day.condition.text}</p>
                    <p class="text-lg">Humidity: ${item.day.avghumidity}%</p>
                    <img src="${item.day.condition.icon}" alt="${item.day.condition.text}" class="w-12 h-12 mx-auto">
                </div>
            `;
        });
        forecastDetails += '</div>'; 
        forecastDiv.innerHTML = forecastDetails;
    }

    submitbutton.addEventListener('click', () => {
        const city = inputbox.value;
        if (city) {
            fetchWeather(city);
        }
    });

    currentLocationBtn.addEventListener('click', () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                const weatherUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}`;
                fetch(weatherUrl)
                    .then(response => response.json())
                    .then(data => {
                        displayWeather(data);
                        fetchForecast(`${lat},${lon}`);
                    })
                    .catch(error => console.error('Error fetching weather data:', error));
            });
        } else {
            alert('Geolocation is not supported by this browser.');
        }
    });
});