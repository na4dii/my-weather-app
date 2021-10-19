let apiKey = "66fbe743ffda6d29ce514fb34af10af8";
let apiMain = `https://api.openweathermap.org/data/2.5/weather?`;

let now = new Date();
let localOffset = now.getTimezoneOffset() * 60;

let daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let dayOfWeek = daysOfWeek[now.getDay()];

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
let month = months[now.getMonth()];

let day = now.getDate();
let todaysDate = document.querySelector(".currentDate");

todaysDate.innerHTML = `${dayOfWeek}, ${month} ${day}`;

function formatDate(timestamp) {
  let date = new Date(timestamp * 1000);

  let amPM = `am`;
  let hours = date.getHours();
  if (hours >= 12) {
    amPM = "pm";
  }
  hours = hours % 12 || 12;

  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  return `${hours}:${minutes} ${amPM}`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 5) {
      forecastHTML =
        forecastHTML +
        `
    <div class="col-2 card forecast-details">
            <div class="card-body">
              <h5 class="card-title day-filler">${formatDay(
                forecastDay.dt
              )}</h5>
              <ul class="forecast-info">
                <li>
                  <img
                  src="https://openweathermap.org/img/wn/${
                    forecastDay.weather[0].icon
                  }@2x.png"
                  alt=""
                  class="weather-img"
                /></li>
                <li><span class="forecast-description">${
                  forecastDay.weather[0].description
                }</span></li>
                <br />
                  <li><strong>High: </strong><span class="forecast-temp-high">${Math.round(
                    forecastDay.temp.max
                  )}°</span></li>
                  <li><strong>Low: </strong><span class="forecast-temp-low">${Math.round(
                    forecastDay.temp.min
                  )}°</span></li>
              </ul>
            </div>
          </div>
        `;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=imperial`;

  axios.get(apiUrl).then(displayForecast);
}

function showWeather(response) {
  let h1 = document.querySelector("h1");
  let currentTemperatureElement = document.querySelector("#temperature");
  let currentHighElement = document.querySelector("#currentHigh");
  let currentLowElement = document.querySelector("#currentLow");
  let currentDescription = document.querySelector("#currentTempDescription");
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind");
  let sunriseElement = document.querySelector("#sunrise");
  let sunsetElement = document.querySelector("#sunset");
  let timeElement = document.querySelector(".currentTime");
  let iconElement = document.querySelector(".weather-icon");
  let cloudElement = document.querySelector("#cloudy");
  let visibleElement = document.querySelector("#visibility");

  fahrenheitTemp = response.data.main.temp;
  fahrenheitTempHigh = response.data.main.temp_max;
  fahrenheitTempLow = response.data.main.temp_min;

  timeElement.innerHTML = formatDate(response.data.dt);
  h1.innerHTML = `Current Weather in ${response.data.name}`;
  currentTemperatureElement.innerHTML = Math.round(fahrenheitTemp);
  currentHighElement.innerHTML = Math.round(fahrenheitTempHigh) + "°";
  currentLowElement.innerHTML = Math.round(fahrenheitTempLow) + "°";
  currentDescription.innerHTML = response.data.weather[0].description;
  humidityElement.innerHTML = `${response.data.main.humidity}%`;
  windElement.innerHTML = Math.round(response.data.wind.speed) + " mph";
  sunriseElement.innerHTML = formatDate(
    response.data.sys.sunrise + localOffset + response.data.timezone
  );
  sunsetElement.innerHTML = formatDate(
    response.data.sys.sunset + localOffset + response.data.timezone
  );
  cloudElement.innerHTML = `${response.data.clouds.all}%`;
  visibleElement.innerHTML = `${Math.round(
    response.data.visibility * 0.000621
  )} mi`;
  iconElement.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);

  getForecast(response.data.coord);
}

function currentLocation(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiUrl = `${apiMain}lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
  axios.get(apiUrl).then(showWeather);
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(currentLocation);
}

function searchCity(city) {
  let h1 = document.querySelector("h1");

  if (city) {
    let apiUrl = `${apiMain}q=${city}&appid=${apiKey}&units=imperial`;
    axios.get(apiUrl).then(showWeather);
  } else {
    h1.innerHTML = `Current Weather`;
    alert("Please insert a city");
  }
}

function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#city-input").value;
  searchCity(city);
}

let searchForm = document.querySelector("#citySearchForm");
searchForm.addEventListener("submit", handleSubmit);

let currentLocationButton = document.querySelector(".location-button");
currentLocationButton.addEventListener("click", getCurrentLocation);

searchCity("Philadelphia");
