let input = document.getElementById('input');
let btn = document.getElementById('search');
let weather = document.getElementById('weather');
let city = document.getElementById('city');
let temp = document.getElementById('temp');
let cityResults = document.getElementById('cityResults');
let humid = document.getElementById('humid');
let wind = document.getElementById('wind');
let preci = document.getElementById('preci');
let uv = document.getElementById('uv')
let feel = document.getElementById('feel');
let des = document.getElementById('des');
let weatherIcon = document.getElementById('weatherIcon');
let loader = document.getElementById('loader');

input.addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    getCity();
  }
})

btn.addEventListener('click', getCity);

async function getCity() {
  let cityName = input.value;
  let cityUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}`;

  await fetch(cityUrl)
    .then((response) => {
      return response.json()
    })
    .then((data) => {
      cityResults.innerHTML = "";

      data.results.forEach((place) => {
        let option = document.createElement('p');

        option.classList.add(
          "p-3",
          "hover:bg-blue-100",
          "border-b",
          "border-gray-300"
        )

        option.innerText = `${place.name}, ${place.country}`

        option.addEventListener('click', function () {
          city.innerText = `${place.name}, ${place.country}`;
          let longitude = place.longitude;
          let latitude = place.latitude;

          let url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation,uv_index,apparent_temperature,weather_code`;

          loader.classList.remove('hidden');

          fetch(url)
            .then(response => response.json())
            .then(data => {
              temp.innerText = Math.round(data.current.temperature_2m) + '°C';
              humid.innerText = data.current.relative_humidity_2m + '%'
              wind.innerText = Math.round(data.current.wind_speed_10m) + 'km/h'
              preci.innerText = data.current.precipitation + 'mm';
              uv.innerText = data.current.uv_index
              feel.innerText = `Feels like ${Math.round(data.current.apparent_temperature)}°C`;
              des.innerText = getWeatherData(data.current.weather_code);
              console.log(data.current.weather_code);
              changeWeatherIcon(data.current.weather_code);
            })
            .finally(() => {
              loader.classList.add('hidden');
            })
          cityResults.innerHTML = ""
          input.value = ""
        })
        cityResults.appendChild(option);
      })
    })
}



function getWeatherData(code) {
  switch (code) {
    case 0:
      return "Clear sky";
    case 1:
      return "Mainly clear";
    case 2:
      return "Partly cloudy";
    case 3:
      return "Overcast";
    case 45:
    case 48:
      return "Foggy";
    case 51:
    case 53:
    case 55:
      return "Drizzle";
    case 61:
    case 63:
    case 65:
      return "Rainy";
    case 71:
    case 73:
    case 75:
      return "Snowfall";
    case 80:
    case 81:
    case 82:
      return "Rain showers";
    case 95:
      return "Thunderstorm";
    default:
      return "Unknown weather";
  }
}

function changeWeatherIcon(code) {
  if (code === 0) {
    weatherIcon.className = "fa-solid fa-sun text-2xl text-amber-400";
  } else if (code === 1 || code === 2) {
    weatherIcon.className = "fa-solid fa-cloud-sun text-2xl text-amber-400";
  } else if (code === 3) {
    weatherIcon.className = "fa-solid fa-cloud text-2xl text-amber-400";
  } else if (code === 45 || code === 48) {
    weatherIcon.className = "fa-solid fa-smog text-2xl text-amber-400";
  } else if (code >= 51 && code <= 67) {
    weatherIcon.className = "fa-solid fa-cloud-rain text-2xl text-amber-400";
  } else if (code >= 71 && code <= 77) {
    weatherIcon.className = "fa-solid fa-snowflake text-2xl text-amber-400";
  }
  else if (code >= 80 && code <= 82) {
    weatherIcon.className = "fa-solid fa-cloud-showers-heavy text-2xl text-amber-400";
  } else if (code >= 95) {
    weatherIcon.className = "fa-solid fa-cloud-bolt text-2xl text-amber-400";
  }
}






