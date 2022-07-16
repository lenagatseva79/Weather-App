let form = document.querySelector("form");
form.addEventListener("submit", locationSearch);

function searchLocation(position) {
  let apiKey = "4fa2fa98e001adffeee9f1033c8280d7";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showWeather);
}
function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}
let currentLocation = document.querySelector("#current-location");
currentLocation.addEventListener("click", getCurrentLocation);


// This function formats the date and the hour
function formatDate(timestamp) {
  let now = new Date(timestamp);

  let hours = now.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }

  let minutes = now.getMinutes();
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
  let day = days[now.getDay()];
  return `${day} ${hours}:${minutes}`;
}


// This function formats the day in the forecast columns
function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  return days[day];
}


//This function change the weather image from the medias folder
function displayImage(icon) {
  let iconPath = "";
  if (icon === `01d` || icon === "01n") {
    iconPath = "images/sun.png";
  } else if (icon === `02d` || icon === "02n") {
    iconPath = "images/cloudy.png";
  } else if (
    icon === `03d` ||
    icon === `04d` ||
    icon === `03n` ||
    icon === `04n`
  ) {
    iconPath = "images/clouds.png";
  } else if (icon === `09d` || icon === `09n`) {
    iconPath = "images/stormrain.png";
  } else if (icon === `10d` || icon === `10n`) {
    iconPath = "images/rain.png";
  } else if (icon === `11d` || icon === `11n`) {
    iconPath = "images/storm.png";
  } else if (icon === `13d` || icon === `13n`) {
    iconPath = "images/snow.png";
  }

  return iconPath;
}

//This function display the forecast COLUMNS
function showForecast(response) {
  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `
          <div class="col-2">
              <div class="days">
                  ${formatDay(forecastDay.dt)}
              </div>
           <img 
           src="http://openweathermap.org/img/wn/${
             forecastDay.weather[0].icon
           }@2x.png"
           alt="" 
           width="50"
           /> 
           <div class="tepmerature-forecast"> 
            <span class="max">
                ${Math.round(forecastDay.temp.max)}°
            </span>/
            <span class="min">
               ${Math.round(forecastDay.temp.min)}°
            </span>
           </div>
          </div>
          `;
    }
  });
  forecastHTML =  forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}


// This function get the coordinates
function getForecast(coordinates) {
  let apiKey = "4fa2fa98e001adffeee9f1033c8280d7";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showForecast);
}


//This function get the API reponse and dispatches it on HTML
function showWeather(response) {
  let temperatureElement = document.querySelector("#temperature");
  document.querySelector("#city").innerHTML = response.data.name;
  document.querySelector("#sky").innerHTML =
    response.data.weather[0].description;
  document.querySelector("#feels").innerHTML = Math.round(
    response.data.main.feels_like
  );
  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );

  celsiusTemperature = response.data.main.temp;

  temperatureElement.innerHTML = Math.round(response.data.main.temp);
  let h3 = document.querySelector("#current-date");
  h3.innerHTML = formatDate(response.data.dt * 1000);

  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);

  getForecast(response.data.coord);
}


// This function convert to Farhenheit and underline the °F
function convertToFahrenheit(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let fahrenheitTemp = (celsiusTemperature * 9) / 5 + 32;
  temperatureElement.innerHTML = Math.round(fahrenheitTemp);
}


//This function convert back to Celsius
function convertToCelsius(event) {
  event.preventDefault();
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
}

let celsiusTemperature = null;

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", convertToFahrenheit);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", convertToCelsius);


// This function receive the value (city) and make the api call
function search(city) {
  let apiKey = "4fa2fa98e001adffeee9f1033c8280d7";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  axios.get(apiUrl).then(showWeather);
}


// This function takes the value (city) of the input when Search button is click
function locationSearch(event) {
  event.preventDefault();
  let city = document.querySelector("#city-input").value;
  search(city);
}

search("Odesa");
