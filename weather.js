async function getWeather() {
    const cityInput = document.getElementById('city');
    const city = cityInput.value.trim();

    const errorMsg = document.getElementById('error-message');
    const loading = document.getElementById('loading');
    const weatherContainer = document.querySelector('.weather-container');

    if (!city) {
        showError('Please enter a city name');
        return;
    }

    const apiKey = '27f6a8b5d7dd0f24e27e6bfdca192511';

    loading.style.display = 'block';
    weatherContainer.style.display = 'none';
    errorMsg.style.display = 'none';

    try {
        // -------- CURRENT WEATHER --------
        const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

        const currentResponse = await fetch(currentUrl);

        if (!currentResponse.ok) {
            throw new Error('City not found');
        }

        const currentData = await currentResponse.json();

        // Update UI
        document.getElementById('cityname').textContent = currentData.name;

        document.getElementById('temperature').textContent =
            `${Math.round(currentData.main.temp)}°C`;

        document.getElementById('description').textContent =
            currentData.weather[0].description;

        document.getElementById('humidity').textContent =
            `Humidity: ${currentData.main.humidity}%`;

        document.getElementById('wind').textContent =
            `Wind: ${currentData.wind.speed} m/s`;

        document.getElementById('feels-like').textContent =
            `Feels like: ${Math.round(currentData.main.feels_like)}°C`;

        const icon = currentData.weather[0].icon;
        document.querySelector('.current-weather .icon').innerHTML =
            `<img src="https://openweathermap.org/img/wn/${icon}@2x.png">`;

        changeBackground(currentData.weather[0].main.toLowerCase());

        // -------- FORECAST (5 DAYS) --------
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

        const forecastResponse = await fetch(forecastUrl);
        const forecastData = await forecastResponse.json();

        const forecastDays = document.querySelectorAll('.day');

        const uniqueDays = [];

        forecastData.list.forEach(item => {
            const date = new Date(item.dt_txt);
            const day = date.getDate();

            if (!uniqueDays.includes(day) && uniqueDays.length < forecastDays.length) {
                uniqueDays.push(day);
            }
        });

        forecastDays.forEach((dayEl, index) => {
            if (uniqueDays[index] !== undefined) {

                const forecast = forecastData.list.find(item =>
                    new Date(item.dt_txt).getDate() === uniqueDays[index]
                );

                if (forecast) {
                    const date = new Date(forecast.dt_txt);
                    const weekday = date.toLocaleDateString('en-US', { weekday: 'short' });

                    const icon = forecast.weather[0].icon;

                    dayEl.querySelector('.weekday').textContent = weekday;

                    dayEl.querySelector('.icon').innerHTML =
                        `<img src="https://openweathermap.org/img/wn/${icon}@2x.png">`;

                    dayEl.querySelector('.temp').textContent =
                        `${Math.round(forecast.main.temp)}°C`;
                }
            } else {
                dayEl.style.display = 'none';
            }
        });

        loading.style.display = 'none';
        weatherContainer.style.display = 'block';

    } catch (error) {
        loading.style.display = 'none';
        weatherContainer.style.display = 'none';
        showError(error.message);
    }
}

// Enter key support
function handleEnter(event) {
    if (event.key === 'Enter') {
        getWeather();
    }
}

// Show error
function showError(message) {
    const errorMsg = document.getElementById('error-message');
    errorMsg.textContent = message;
    errorMsg.style.display = 'block';
}

// Background change
function changeBackground(condition) {
    const body = document.body;
    body.className = '';

    switch (condition) {
        case 'clear':
            body.classList.add('clear');
            break;
        case 'clouds':
            body.classList.add('clouds');
            break;
        case 'rain':
        case 'drizzle':
            body.classList.add('rain');
            break;
        case 'snow':
            body.classList.add('snow');
            break;
        case 'thunderstorm':
            body.classList.add('rain');
            break;
        default:
            body.classList.add('default');
            break;
    }
}





