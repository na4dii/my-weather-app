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
let hours = now.getHours();
let minutes = now.getMinutes();

let todaysDate = document.querySelector(".currentDate");
let timeNow = document.querySelector(".currentTime");

todaysDate.innerHTML = `${dayOfWeek}, ${month} ${day}`;

function formatDate(date) {

  if (hours < 10) {
    hours = `0${hours}`;
  }

  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  return `${hours}:${minutes}`;
}

timeNow.innerHTML = formatDate(now);

let currentTemperatureElement = document.querySelector(".current-temp");

function showWeather(response) {
  let temperature = Math.round(`${response.data.main.temp}`);
  let high = Math.round(`${response.data.main.temp_max}`);
  let low = Math.round(`${response.data.main.temp_min}`);
  let h1 = document.querySelector("h1");
  let currentHighElement = document.querySelector("#currentHigh");
  let currentLowElement = document.querySelector("#currentLow");
  let currentDescription = document.querySelector("#currentTempDescription");
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind");
  let wind = Math.round(response.data.wind.speed);
  let sunriseElement = document.querySelector("#sunrise");
  let sunsetElement = document.querySelector("#sunset");

  h1.innerHTML = `Current Weather in ${response.data.name}`;
  currentTemperatureElement.innerHTML = `${temperature}°F`;
  currentHighElement.innerHTML = `${high}°F`;
  currentLowElement.innerHTML = `${low}°F`;
  currentDescription.innerHTML = response.data.weather[0].description;
  humidityElement.innerHTML = `${response.data.main.humidity}%`;
  windElement.innerHTML = `${wind} mph`;
  sunriseElement.innerHTML = new Date(
    response.data.sys.sunrise * 1000
  ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  sunsetElement.innerHTML = new Date(
    response.data.sys.sunset * 1000
  ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
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
