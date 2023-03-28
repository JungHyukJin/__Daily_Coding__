const container = document.querySelector(".container");
const search = document.querySelector(".search-box button");
const weatherBox = document.querySelector(".weather-box");
const weatherDetails = document.querySelector(".weather-details");
const error404 = document.querySelector(".not-found");

search.addEventListener("click", () => {
  const API_KEY = "865af352b2c597a2b231b150c1f98abd";
  const city = document.querySelector(".search-box input").value;

  if (city === "") return;

  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
  )
    .then((res) => res.json())
    .then((data) => {
        console.log('data', data)
      if ((data.cod === "404")) {
        container.style.height = "fit-content";
        weatherBox.style.display = "none";
        weatherDetails.style.display = "none";
        error404.style.display = "block";
        error404.classList.add("fade-in");
        return;
      }

      error404.style.display = "none";
      error404.classList.remove = "fade-in";

      const img = document.querySelector(".weather-box img");
      const temperature = document.querySelector(".weather-box .temperature");
      const description = document.querySelector(".weather-box .description");
      const humidity = document.querySelector(".weather-details .humidity .text span");
      const wind = document.querySelector(".weather-details .wind .text span");

      switch (data.weather[0].main) {
        case "Clear":
          img.src = "./imgs/clear.png";
          break;
        case "Rain":
          img.src = "./imgs/rain.png";
          break;
        case "Snow":
          img.src = "./imgs/snow.png";
          break;
        case "Clouds":
          img.src = "./imgs/cloud.png";
          break;
        case "mist":
          img.src = "./imgs/mist.png";
          break;
        default:
          img.src = "";
      };

      temperature.innerHTML = `${parseInt(data.main.temp)}<span>°C</span>`;
      description.innerHTML = `${data.weather[0].description}`;
      humidity.innerHTML = `${data.main.humidity}%`;
      wind.innerHTML = `${parseInt(data.wind.speed)}Km/h`;

      weatherBox.style.display = '';
      weatherDetails.style.display = '';
      weatherBox.classList.add('fade-in');
      weatherDetails.classList.add('fade-in');
      container.style.height = "fit-content";
    });
});
