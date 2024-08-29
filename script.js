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

// every time when a keyButton is pressed event listener is triggered and function runs
// create a list with all matching cities underneath the searchbar

const sendInputDataToApi = async () => {
  let inputValue = searchBar.value;
  console.log(`test1${inputValue}`);
  try {
    const fetchCities = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${inputValue}&count=10`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );
    //console.log(fetchCities)
    const a = await fetchCities.json();
    //console.log(a);
    return a;

    // iterate through an array and get required data for each item
    // put this data to DOM for each item
  } catch (error) {
    console.log(error);
  }
};

//const cityData = new Object();

//{
// name: this.name,
//latitude: this.latitude,
//longitude: this.longitude,
//countryCode: this.countryCode,
//population: this.population,
//country: this.country,
//};
const analyseDataFromApi = async (data) => {
  //await data();
  const listOfCities = await data();
  console.log(`test2${listOfCities}`);
  //listOfCities();

  const iterateCitiesArray = listOfCities.results.forEach((city) => {
    console.log(`hi${city.id}`);
  });
  await iterateCitiesArray();
  //console.log(
  //  listOfCities,
  //   inputValue,
  //   typeof listOfCities,
  //   listOfCities.results[0].country
  //);
};

//const produceResultFromApi = async (data, analyse) => {

//}

const createTagLiForCity = (data) => {
  let searchBarList = document.querySelector("[data-search-bar-list]");

  let li = document.createElement("li");
  li.innerHTML = data;
  li.innerText = "hi";
  li.setAttribute("data-search-bar-item", "");
  li.classList.add("search-bar__list-item");
  searchBarList.appendChild(li);
  console.log("el is created");
};

//first check if input field has any values
// if true proceed
const inputFieldValChecker = async (func) => {
  let inputValue = searchBar.value;
  if (inputValue != "") {
    await func();
  } else {
    console.log("not trues");
  }
};

debugger;

searchBar.addEventListener(
  "input",
  inputFieldValChecker(analyseDataFromApi(sendInputDataToApi))
);
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

// first remove all previous li
// create new li each time a user input data
// make each li active link so user can click on it
createTagLiForCity();

//console.log(sendInputDataToApi());

// 1st - get the data from APA (wait)
// 2nd - analyse the Date and use it for DOM
