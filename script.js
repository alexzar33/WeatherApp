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

// function that sends user input value to API to try to find a required city
const sendInputDataToApi = async () => {
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
    const a = await fetchCities.json();
    console.log(a);
    return a;

 
  } catch (error) {
    console.log(error);
  }
};


// function that receives the data from API  and analyzes it
// then structures and displays this data at the DOM
const analyzeDataFromApi = async (data) => {
  try {
  const listOfCities = await data();
  removeTagLi()
  console.log(`test2 Analyze DATA from API${listOfCities}`);

  //create if-else to check if the value is defined or not.
  //if the value is undefined then remove data
 await listOfCities.results.forEach((city) => {
    //console.log(`ID: ${city.id} NAME: ${city.name} COUNTRY: ${city.country} CODE: ${city.country_code} POPULATION: ${city.population}`);
  
  
  

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
 //let j = JSON.stringify(thisCityData)
  console.log(j);
  createTagLiForCity(j,addEventListenerForTagLi,thisCityData);
  
  });

  //return thisCityData;

  } catch(error){
    console.log(`No matches were found at API${error}`)
  }
};

// function that removes all child elements from UL (list)
const removeTagLi = () => {
  let searchBarList = document.querySelector("[data-search-bar-list]");
  while (searchBarList.firstChild) {
    searchBarList.removeChild(searchBarList.firstChild);
  }
}

// function that creates a LI element, passes API data to it and then displays it at DOM
const createTagLiForCity = async(data,eventListener,dataExt) => {
  let searchBarList = document.querySelector("[data-search-bar-list]");

  let li = document.createElement("li");
  li.innerHTML = data;
  li.setAttribute("data-search-bar-item", "");
  li.classList.add("search-bar__list-item");
  eventListener(li,dataExt);
  searchBarList.appendChild(li);
  console.log("el is created" + dataExt);
};

//debugger;

// event listener that invokes API-related functions on input
searchBar.addEventListener("input", ()=>{analyzeDataFromApi(sendInputDataToApi)});

// function that tests Event Listener Behavior. It emulates user input
function testEventListenerBehavior () {
let event = new Event ('input');
searchBar.dispatchEvent(event);
}


// function that adds eventListener for tag <li>
// when clicked        - get coordinates for this city
//                     - activate getWeather function
// then fetching the DATA from API and fill it to the DOM
//clear all <li> tags
//clear input field value when the data is fetched and displayed at the DOM
function addEventListenerForTagLi (liTag, data){
  liTag.addEventListener ("click", ()=>{getWeather(data)})

}





//testEventListenerBehavior();

// -------------end


// function that gets weather data from API
// needs to be reworked and completed
const getWeather = async (data) => {
  //let testData = await data
  //console.log("GetWeather Test " + testData)
  //convert data to int and limit numbers to 2 after point x.xx (Number().toFixed())
  let  latitude = await data.latitude
  let  longitude = await data.longitude
  let city = await data.name
  //latitude = await data.latitude;
  //longitude = await data.longitude;
  try {
    const weatherDataFetch = await fetch(
      `https://api.open-meteo.com/v1/dwd-icon?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,is_day,weather_code&daily=weather_code,apparent_temperature_max,apparent_temperature_min`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );
    const weatherData = await weatherDataFetch.json();
    const currentWeather = await weatherData.current.temperature_2m
    console.log(`The weather for ${city} is ${currentWeather}`);
    console.log(weatherData)
    //city.innerHTML;
  } catch (error) {
    console.log(error);
  }
};

//getWeather();


//create an object with data
  //convert this object data and send to inner HTML (li)

   // iterate through an array and get required data for each item
    // put this data to DOM for each item

// every time when a keyButton is pressed event listener is triggered and function runs
// create a list with all matching cities underneath the searchbar
// first remove all previous li
//before removing a li check if APIdata were changed
// create new li each time a user input data
// make each li active link so user can click on it

// 1st - get the data from APA (wait)
// 2nd - analyze the Date and use it for DOM