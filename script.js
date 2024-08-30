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
  //let inputValue = "mos"; //SET inputValue BACK to normal!!!
  let inputValue = await searchBar.value;
  console.log(`test1 send data to API${inputValue}`);
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
    console.log(a);
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
const analyzeDataFromApi = async (data) => {
  try {
  const listOfCities = await data();
  removeTagLi()
  console.log(`test2 Analyze DATA from API${listOfCities}`);

  //create if-else to check if the value is defined or not.
  //if the value is undefined then remove data
 await listOfCities.results.forEach((city) => {
    //console.log(`ID: ${city.id} NAME: ${city.name} COUNTRY: ${city.country} CODE: ${city.country_code} POPULATION: ${city.population}`);
  
  
  //create an object with data
  //convert this object data and send to inner HTML (li)

  let thisCityData = {
    name: city.name,
    country: city.country,
    code:  city.country_code,
    population: city.population,
    latitude: city.latitude,
    longitude: city.longitude,
    id: city.id
  }
 let j = city.name +  " [" + city.country_code + "] ";
 //let j =  city.name
 //let j = JSON.stringify(thisCityData)
  console.log(j)
  //let  tt = "a";
 createTagLiForCity(j);

  //console.log(thisCityData)
  
  });
  //await iterateCitiesArray();
  //console.log(
  //  listOfCities,
  //   inputValue,
  //   typeof listOfCities,
  //   listOfCities.results[0].country
  //);
  } catch(error){
    console.log(`No matches were found at API${error}`)
  }
};

//const produceResultFromApi = async (data, analyze) => {

//}


const removeTagLi = () => {
  let searchBarList = document.querySelector("[data-search-bar-list]");
  while (searchBarList.firstChild) {
    searchBarList.removeChild(searchBarList.firstChild);
  }
}

const createTagLiForCity = async(data) => {
  //let text = await data;
  let searchBarList = document.querySelector("[data-search-bar-list]");

  let li = document.createElement("li");
  //li.innerHTML = data;
  //li.innerText = await text / "hi";
  li.innerHTML = data;
  li.setAttribute("data-search-bar-item", "");
  li.classList.add("search-bar__list-item");
  searchBarList.appendChild(li);
  console.log("el is created" + data);
};

//first check if input field has any values
// if true proceed



//debugger;

//the problem is that the func is invoked when u pass the arguments


searchBar.addEventListener("input", ()=>{analyzeDataFromApi(sendInputDataToApi)});

//function to test Event Listener Behavior. Emulate user input
function testEventListenerBehavior () {
let event = new Event ('input');
searchBar.dispatchEvent(event);
}

//testEventListenerBehavior();

// -------------end

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
//before removing a li check if APIdata were changed
// create new li each time a user input data
// make each li active link so user can click on it
//createTagLiForCity();

//console.log(sendInputDataToApi());

// 1st - get the data from APA (wait)
// 2nd - analyze the Date and use it for DOM