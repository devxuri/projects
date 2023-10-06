// Get the country name from the URL query parameter
const urlParams = new URLSearchParams(window.location.search);
const countryName = urlParams.get('country');
const popupBox = document.getElementById('weather-forecast');

function showErrorPopup() {
  const popup = document.createElement('div');
  popup.className = 'error-popup';
  popup.textContent = 'Something went wrong!';
  popupBox.appendChild(popup);
}

function updateWeatherData() {
  // Make a request to the restcountries API to get the latitude and longitude of the country
  fetch(`https://restcountries.com/v3.1/name/${countryName}`)
    .then(response => response.json())
    .then(data => {
      const country = data[0];
      const latitude = country.latlng[0];
      const longitude = country.latlng[1];
      if (latitude && longitude) {
        // Make a request to the Met.no API to get the weather forecast
        const weatherUrl = `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${latitude}&lon=${longitude}`;
        fetch(weatherUrl)
          .then(response => response.json())
          .then(data => {
            // Group the forecasts by date
            const forecastByDate = {};
            data.properties.timeseries.forEach(weather => {
              const date = new Date(weather.time).toLocaleDateString();
              if (!forecastByDate[date]) {
                forecastByDate[date] = weather;
              }
            });

            // Create a card for each day of the next 7 days of the forecast
            const weatherCards = [];
            const today = new Date();
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            for (let i = 0; i < 7; i++) {
              const date = new Date(today.getTime() + i * 24 * 60 * 60 * 1000);
              const dateString = date.toLocaleDateString();
              if (forecastByDate[dateString]) {
                const weather = forecastByDate[dateString];
                const card = document.createElement('div');
                card.className = 'weather-card';
                const day = days[date.getDay()];
                const month = date.toLocaleString('en-US', { month: 'short' });
                const dateNum = date.toLocaleString('en-US', { day: 'numeric' });
                const temp = `${Math.round(weather.data.instant.details.air_temperature)}°C`;
                let symbolCode = weather.data.next_12_hours?.summary?.symbol_code;
                if (!symbolCode) {
                  symbolCode = 'clearsky_day';
                }
                const symbolPath = `../../assets/weathericon/svg/${symbolCode}.svg`;
                const img = document.createElement('img');
                img.src = symbolPath;
                img.alt = `Weather symbol for ${day}`;
                const dateElem = document.createElement('p');
                dateElem.textContent = `${day}, ${month} ${dateNum}`;
                const tempElem = document.createElement('p');
                tempElem.textContent = temp;
                card.appendChild(img);
                card.appendChild(dateElem);
                card.appendChild(tempElem);
                weatherCards.push(card);
              }
            }

            // Clear the existing weather cards and add the updated cards to the page
            const weatherSection = document.querySelector('#weather-forecast');
            weatherSection.innerHTML = '';
            
            weatherCards.forEach(card => weatherSection.appendChild(card));
          })
          .catch(error => {
            console.error(error);
            showErrorPopup();
          });
      } 
      
      else {
        console.error(`Could not find latitude and longitude for ${countryName}`);
      }
      const countryHeading = document.querySelector('h2');
      countryHeading.textContent = data[0].name.common;
    })
    .catch(error => {
      console.error(error);
      showErrorPopup();
    });
}

// Call the updateWeatherData function immediately and every 30 seconds thereafter
updateWeatherData();
setInterval(updateWeatherData, 30000);
