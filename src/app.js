let apiKey = "66fbe743ffda6d29ce514fb34af10af8";
let apiMain = `https://api.openweathermap.org/data/2.5/weather?`;

let now = new Date();

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
  let date = new Date(timestamp);
  let hours = date.getHours();

  if (hours < 10) {
    hours = `0${hours}`;
  }

  let minutes = date.getMinutes();

  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  return `${hours}:${minutes}`;
}

function displayForecast(response) {
  console.log(response.data);
  let forecastElement = document.querySelector("#forecast");

  let days = ["Friday", "Saturday", "Sunday", "Monday", "Tuesday"];

  let forecastHTML = `<div class="row">`;
  days.forEach(function (day) {
    forecastHTML =
      forecastHTML +
      `
    <div class="col-2 card forecast-details">
            <div class="card-body">
              <h5 class="card-title day-filler">${day}</h5>
              <ul class="forecast-info">
                <li>
                  <img
                  src="https://openweathermap.org/img/wn/04d@2x.png"
                  alt=""
                  class="weather-img"
                />
                  <li>High: <span class="forecast-temp-high">90°</span></li>
                  <li>Low: <span class="forecast-temp-low">90°</span></li>
                </li>
              </ul>
            </div>
          </div>

        `;
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

  fahrenheitTemp = response.data.main.temp;
  fahrenheitTempHigh = response.data.main.temp_max;
  fahrenheitTempLow = response.data.main.temp_min;

  timeElement.innerHTML = formatDate(response.data.dt * 1000);
  h1.innerHTML = `Current Weather in ${response.data.name}`;
  currentTemperatureElement.innerHTML = Math.round(fahrenheitTemp);
  currentHighElement.innerHTML = Math.round(fahrenheitTempHigh) + "°";
  currentLowElement.innerHTML = Math.round(fahrenheitTempLow) + "°";
  currentDescription.innerHTML = response.data.weather[0].description;
  humidityElement.innerHTML = `${response.data.main.humidity}%`;
  windElement.innerHTML = Math.round(response.data.wind.speed) + "mph";
  sunriseElement.innerHTML = formatDate(response.data.sys.sunrise * 1000);
  sunsetElement.innerHTML = formatDate(response.data.sys.sunset * 1000);
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

function displayCelsiusTemp(event) {
  event.preventDefault();
  let currentTemperatureElement = document.querySelector("#temperature");
  fahrenheitLink.classList.remove("active");
  celsiusLink.classList.add("active");
  let currentHighElement = document.querySelector("#currentHigh");
  let currentLowElement = document.querySelector("#currentLow");
  let celsiusTemp = Math.round((fahrenheitTemp - 32) * (5 / 9));
  let celsiusTempHigh = Math.round((fahrenheitTempHigh - 32) * (5 / 9));
  let celsiusTempLow = Math.round((fahrenheitTempLow - 32) * (5 / 9));

  currentTemperatureElement.innerHTML = celsiusTemp;
  currentHighElement.innerHTML = celsiusTempHigh + "°";
  currentLowElement.innerHTML = celsiusTempLow + "°";
}

function displayFahrenheitTemp(event) {
  event.preventDefault();
  let currentTemperatureElement = document.querySelector("#temperature");
  fahrenheitLink.classList.add("active");
  celsiusLink.classList.remove("active");
  let currentHighElement = document.querySelector("#currentHigh");
  let currentLowElement = document.querySelector("#currentLow");
  currentTemperatureElement.innerHTML = Math.round(fahrenheitTemp);
  currentHighElement.innerHTML = Math.round(fahrenheitTempHigh) + "°";
  currentLowElement.innerHTML = Math.round(fahrenheitTempLow) + "°";
}

let fahrenheitTemp = null;
let fahrenheitTempHigh = null;
let fahrenheitTempLow = null;

let searchForm = document.querySelector("#citySearchForm");
searchForm.addEventListener("submit", handleSubmit);

let currentLocationButton = document.querySelector(".location-button");
currentLocationButton.addEventListener("click", getCurrentLocation);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsiusTemp);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemp);

searchCity("Philadelphia");

