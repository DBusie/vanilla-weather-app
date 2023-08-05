function formatDate(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let dateElement = date.getDate();
  if (dateElement < 10) {
    dateElement = `0${dateElement}`;
  }

  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let month = months[date.getMonth()];
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
  return `${day}, ${dateElement} ${month} ${hours}:${minutes}`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast-weather");
  let forecastHTML = `<div class="row">`;
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      let celsiusMax = forecastDay.temperature.maximum;
      let celsiusMin = forecastDay.temperature.minimum;

      forecastHTML =
        forecastHTML +
        `<div class="col-2">
          <div class="forecast-date">${formatDay(forecastDay.time)}</div>
          <img src="${forecastDay.condition.icon_url}" alt="${
          forecastDay.condition.icon
        }" width="80"/>
          <div class="forecast-temperature">
            <span class="forecast-max"><strong>${Math.round(
              celsiusMax
            )}</strong></span>°
            <span class="forecast-min">${Math.round(celsiusMin)}</span>°
          </div>
        </div>`;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}
function getForecast(coordinates) {
  let apiKey = "10b71242bt5ccb0ob65af52af58a3f2c";
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?lon=${coordinates.longitude}&lat=${coordinates.latitude}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);

  console.log(apiUrl);
}
function displayTemperature(response) {
  let cityElement = document.querySelector("#city");
  let tempElement = document.querySelector("#temperature");
  let weatherElement = document.querySelector("#description");
  let humidityElement = document.querySelector("#humidity");
  let dateElement = document.querySelector("#date");
  let iconElement = document.querySelector("#icon");
  let realFeelElement = document.querySelector("#feel");
  let windElement = document.querySelector("#wind");
  celsiusTemperature = response.data.temperature.current;
  realCelsiusTemperature = response.data.temperature.feels_like;
  cityElement.innerHTML = response.data.city;
  tempElement.innerHTML = Math.round(celsiusTemperature);
  weatherElement.innerHTML = response.data.condition.description;
  humidityElement.innerHTML = response.data.temperature.humidity;
  realFeelElement.innerHTML = Math.round(realCelsiusTemperature);
  windElement.innerHTML = Math.round(response.data.wind.speed);
  dateElement.innerHTML = formatDate(response.data.time * 1000);
  iconElement.setAttribute("src", response.data.condition.icon_url);
  iconElement.setAttribute("alt", response.data.weather);
  getForecast(response.data.coordinates);
}

function search(city) {
  let units = "metric";
  let apiKey = "10b71242bt5ccb0ob65af52af58a3f2c";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=${units};`;

  axios.get(apiUrl).then(function (response) {
    //console.log(response.data);
    //console.log(response.data.daily[0].temperature.maximum);
    displayTemperature(response);
  });
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

//let celsiusLink = document.querySelector("#celsius");
//celsiusLink.addEventListener("click", showCelsiusTemperature);

search("gweru");
