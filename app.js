function formatDate(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }

  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let day = days[date.getDay()];
  return `${day} ${hours}:${minutes}`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}

function displayForecastCelsius(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast-weather");
  let forecastHTML = `<div class="row">`;
  let days = ["Thu", "Fri", "Sat", "Sun", "Mon"];

  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      let celsiusMax = forecastDay.temp.max;
      let celsiusMin = forecastDay.temp.min;

      forecastHTML =
        forecastHTML +
        `
            <div class="col-2">
              <div class="forecast-date">${formatDay(forecastDay.dt)}
              </div>
              
        <img src="https://openweathermap.org/img/w/${
          forecastDay.weather[0].icon
        }.png" alt=""/>
        <div class="forecast-temperature">
          <span class="forecast-max">${Math.round(
            celsiusMax
          )}</span>°   <span class="forecast-min">${Math.round(
          celsiusMin
        )}</span>°   
        </div>                 
                   </div>`;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}
function getForecast(coordinates) {
  let units = "metric";
  let apiKey = "5e31eddd9b83339ff8cc05bb6263bcc3";
  //let apiKey = "10b71242bt5ccb0ob65af52af58a3f2c";
  let apiUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(displayForecastCelsius);
}

function displayTemperature(response) {
  let tempElement = document.querySelector("#temperature");
  let cityElement = document.querySelector("#city");
  let weatherElement = document.querySelector("#description");
  let realFeelElement = document.querySelector("#feel");
  let windElement = document.querySelector("#wind");
  let humidityElement = document.querySelector("#humidity");
  let dateElement = document.querySelector("#date");
  let iconElement = document.querySelector("#icon");
  celsiusTemperature = response.data.main.temp;
  realCelsiusTemperature = response.data.main.feels_like;
  cityElement.innerHTML = response.data.name;

  tempElement.innerHTML = Math.round(celsiusTemperature);
  weatherElement.innerHTML = response.data.weather[0].description;
  realFeelElement.innerHTML = Math.round(realCelsiusTemperature);
  windElement.innerHTML = Math.round(response.data.wind.speed);
  humidityElement.innerHTML = response.data.main.humidity;
  dateElement.innerHTML = formatDate(response.data.dt * 1000);

  iconElement.setAttribute(
    "src",
    `https://openweathermap.org/img/w/${response.data.weather[0].icon}.png`
  );

  iconElement.setAttribute(
    "alt",
    `https://openweathermap.org/img/w/${response.data.weather[0].description}.png`
  );
  getForecast(response.data.coord);
}

function search(city) {
  let units = "metric";
  let apiKey = "5e31eddd9b83339ff8cc05bb6263bcc3";
  //let apiKey = "10b71242bt5ccb0ob65af52af58a3f2c";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
  //let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(displayTemperature);
  console.log(apiUrl);
}

function handleSubmit(event) {
  event.preventDefault();
  let cityElement = document.querySelector("#city-input");
  search(cityElement.value);
}

function showCelsiusTemperature(event) {
  event.preventDefault();
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  let temperatureElement = document.querySelector("#temperature");
  let realFeelElement = document.querySelector("#feel");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
  realFeelElement.innerHTML = Math.round(realCelsiusTemperature);
}

let celsiusTemperature = null;
let realCelsiusTemperature = null;

let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

let celsiusLink = document.querySelector("#celsius");
celsiusLink.addEventListener("click", showCelsiusTemperature);

search("kadoma");
