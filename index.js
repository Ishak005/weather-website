const weatherForm = document.querySelector(".weatherForm");
const cityInput = document.querySelector(".cityInput");
const card = document.querySelector(".card");
const videoElement = document.getElementById("background-video");
const apiKey = "f1f6f30fd3df5413dd773382d2bac193";

weatherForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const city = cityInput.value;

  if (city) {
    try {
      const weatherData = await getWeatherData(city);
      displayWeatherInfo(weatherData);
    } catch (error) {
      console.error(error);
      displayError("City not found or network error.");
    }
  } else {
    displayError("Please enter a city.");
  }
});

async function getWeatherData(city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

  const response = await fetch(apiUrl);

  if (!response.ok) {
    throw new Error("Could not fetch weather data.");
  }

  return await response.json();
}

function displayWeatherInfo(data) {
  const {
    name: city,
    main: { temp, humidity },
    weather: [{ description, id }],
  } = data;

  card.textContent = "";
  card.style.display = "flex";

  const cityDisplay = document.createElement("h1");
  const tempDisplay = document.createElement("p");
  const humidityDisplay = document.createElement("p");
  const descDisplay = document.createElement("p");
  const weatherEmoji = document.createElement("p");

  cityDisplay.textContent = city;
  tempDisplay.textContent = `${(temp - 273.15).toFixed(1)}°C`;
  humidityDisplay.textContent = `Humidity: ${humidity}%`;
  descDisplay.textContent = description;
  weatherEmoji.textContent = getWeatherEmoji(id);

  cityDisplay.classList.add("cityDisplay");
  tempDisplay.classList.add("tempDisplay");
  humidityDisplay.classList.add("humidityDisplay");
  descDisplay.classList.add("descDisplay");
  weatherEmoji.classList.add("weatherEmoji");

  card.appendChild(cityDisplay);
  card.appendChild(tempDisplay);
  card.appendChild(humidityDisplay);
  card.appendChild(descDisplay);
  card.appendChild(weatherEmoji);

  let videoSrc;
  switch (description.toLowerCase()) {
    // Clear weather
    case "clear sky":
      videoSrc = "videos/clear.mp4";
      break;

    // Cloudy weather
    case "scattered clouds":
      videoSrc = "videos/scattered.mp4";
      break;

    case "few clouds":
    case "broken clouds":
    case "overcast clouds":
      videoSrc = "videos/cloudy.mp4";
      break;

    // Rain
    case "light rain":
    case "moderate rain":
    case "heavy intensity rain":
    case "very heavy rain":
    case "extreme rain":
      videoSrc = "videos/rain.mp4";
      break;

    // Shower rain
    case "shower rain":
    case "ragged shower rain":
      videoSrc = "videos/drizzle.mp4";
      break;

    // Snow
    case "light snow":
    case "snow":
    case "heavy snow":
    case "sleet":
    case "shower snow":
      videoSrc = "videos/snow.mp4";
      break;

    // Thunderstorm
    case "thunderstorm with light rain":
    case "thunderstorm with rain":
    case "thunderstorm with heavy rain":
    case "light thunderstorm":
    case "thunderstorm":
    case "heavy thunderstorm":
    case "ragged thunderstorm":
      videoSrc = "videos/thunder.mp4";
      break;

    // Smoke, fog, and similar conditions
    case "smoke":
    case "mist":
    case "fog":
      videoSrc = "videos/fog.mp4";
      break;
    case "haze":
      videoSrc = "videos/haze.mp4";
      break;

    // Drizzle
    case "drizzle":
    case "light intensity drizzle":
    case "drizzle rain":
    case "light intensity drizzle rain":
    case "heavy intensity drizzle":
      videoSrc = "videos/drizzle.mp4";
      break;

    // Default background
    default:
      videoSrc = "videos/default.mp4";
  }

  if (videoSrc) {
    videoElement.src = videoSrc;
    videoElement.load(); // Reload the video
  }
}

function getWeatherEmoji(weatherId) {
  switch (true) {
    case weatherId >= 200 && weatherId < 300:
      return "⛈";
    case weatherId >= 300 && weatherId < 400:
      return "🌧";
    case weatherId >= 500 && weatherId < 600:
      return "🌦";
    case weatherId >= 600 && weatherId < 700:
      return "❄";
    case weatherId >= 700 && weatherId < 800:
      return "🌫";
    case weatherId === 800:
      return "🌞";
    case weatherId >= 801 && weatherId < 810:
      return "☁";
    default:
      return "❓";
  }
}

function displayError(message) {
  const errorDisplay = document.createElement("p");
  errorDisplay.textContent = message;
  errorDisplay.classList.add("errorDisplay");

  card.textContent = "";
  card.style.display = "flex";
  card.appendChild(errorDisplay);
}
