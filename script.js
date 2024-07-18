const date = document.getElementById("date");
const city = document.getElementById("city");
const temp = document.getElementById("temp");
const tempImg = document.getElementById("tempImg");
const description = document.getElementById("description");
const tempMax = document.getElementById("tempMax");
const tempMin = document.getElementById("tempMin");

const searchBar = document.getElementById("searchBarInput");

const months = [
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

let dateObj = new Date();
let month = months[dateObj.getUTCMonth()];
let day = dateObj.getUTCDate() - 1;
let year = dateObj.getUTCFullYear();

date.innerHTML = `${month}${day}, ${year}`;

const app = document.getElementById("app");

// everytime when a keyButton is pressed event listener is triggered and function runs
// create a list with all matching cities underneath the searchbar

const getCityCoordinates = async () => {
  let inputValue = searchBar.value;
  console.log(`hhhh${inputValue}`);
  try {
    const cityDataFetch = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${inputValue}&count=10`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );
    const cityData = await cityDataFetch.json();
    console.log(cityData, inputValue);
  } catch (error) {
    console.log(error);
  }
};
searchBar.addEventListener("input", getCityCoordinates);
/*searchBar.addEventListener("input", () => {
  const inputValue = document.getElementById("searchBarInput").value;
  console.log(`ssss${inputValue}`);
}); */

const getWeather = async () => {
  try {
    const weatherDataFetch = await fetch(
      "https://api.open-meteo.com/v1/dwd-icon?latitude=52.52&longitude=13.41&current=temperature_2m,is_day,weather_code&daily=weather_code,apparent_temperature_max,apparent_temperature_min",
      {
        headers: {
          Accept: "application/json",
        },
      }
    );
    const weatherData = await weatherDataFetch.json();
    console.log(weatherData);
    city.innerHTML;
  } catch (error) {
    console.log(error);
  }
};
getWeather();
