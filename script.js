const date = document.querySelector("[data-current-weather__date]");
const city = document.querySelector("[data-current-weather__city]");
const temp = document.querySelector("[data-current-weather__temperature]");
const tempImg = document.querySelector("[data-current-weather__icon]");
const description = document.querySelector(
  "[data-current-weather__description]"
);
const tempMax = document.querySelector(
  "[data-current-weather__max-temperature]"
);
const tempMin = document.querySelector(
  "[data-current-weather__min-temperature]"
);
const appContainer = document.querySelector("[data-app-container]");

const searchBarInput = document.querySelector("[data-search-bar__input]");
const searchBarList = document.querySelector("[data-search-bar__list]");

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
let day = dateObj.getDate();
let year = dateObj.getFullYear();
//console.log(dateObj)

date.innerHTML = `${month} ${day}, ${year}`;

const app = document.getElementById("app");

// function that sends user input value to API to try to find a required city
//! return fetched.json
const sendInputDataToApi = async () => {
  let inputValue = await searchBarInput.value;
  console.log("Data sent to API:");
  console.log(inputValue);

  let fetchedData = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${inputValue}&count=10`,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );

  return await fetchedData.json();
  // const a = await fetchedData.json();
  // return a;
};

// function that receives the data from API  and analyzes it
// then structures and displays this data at the DOM
//! return array of objects
const analyzeDataFromApi = async (data) => {
  let fetchedData = await data;
  console.log("Analyzed data from API");
  console.log(fetchedData);

  let listOfCities = await fetchedData.results.map((city) => {
    let cityData = {
      name: city.name,
      country: city.country,
      code: city.country_code,
      population: city.population,
      latitude: city.latitude,
      longitude: city.longitude,
      id: city.id,
    };
    return cityData;
  });
  return listOfCities;
};

// function that gets a link for a country flag icon
const getFlagIcon = (code) => {
  return `https://flagcdn.com/${code}.svg`;
};
//function that displays fetched data at DOM
const displayDataAtDom = async () => {
  try {
    let fetchedData = await sendInputDataToApi();
    removeTagLi();
    console.log("Fetched Data:");
    console.log(fetchedData);
    let listOfCities = await analyzeDataFromApi(await fetchedData);
    console.log("List of cities:");
    console.log(listOfCities);

    await listOfCities.forEach(
      (city) => {
        //let j = city.name +  " [" + getFlagIcon(city.code) + "] ";
        let code = getFlagIcon(city.code).toLowerCase();
        createTagLiForCity(city.name, addEventListenerForTagLi, city, code);
        console.log(code);
      }

      /*   await listOfCities.results.forEach((city) => {
   
  
  
  

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
  
  }); */
    );
  } catch (err) {
    console.log(err);
  }
};

// function that gets weather data from API
// needs to be reworked and completed
const getWeather = async (data) => {
  let latitude = await data.latitude;
  let longitude = await data.longitude;
  let currentCity = await data.name;

  let weatherApiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,is_day,weather_code,wind_speed_10m,wind_direction_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,wind_speed_10m_max,wind_direction_10m_dominant&timezone=auto`;

  let weatherDataFetch = await fetch(weatherApiUrl, {
    headers: {
      Accept: "application/json",
    },
  });

  //console.log (weatherDataFetch.status)
  if (weatherDataFetch.status == 200) {
    let weatherData = await weatherDataFetch.json();
    let currentWeather = {
      temperature: weatherData.current.temperature_2m,
      dayOrNight: weatherData.current.is_day,
      weatherCode: weatherData.current.weather_code,
      windDirection: weatherData.current.wind_direction_10m,
      windSpeed: weatherData.wind_speed_10m,
    };

    let dailyWeather = {
      sunrise: weatherData.daily.sunrise,
      sunset: weatherData.daily.sunset,
      tempMax: weatherData.daily.temperature_2m_max,
      tempMin: weatherData.daily.temperature_2m_min,
      time: weatherData.daily.time,
      weatherCode: weatherData.daily.weather_code,
      windDirection: weatherData.daily.wind_direction_10m_dominant,
      windSpeed: weatherData.daily.wind_speed_10m_max,
    };

    console.log(
      `The weather for ${currentCity} is ${currentWeather.temperature}`
    );
    console.log(weatherData);
    console.log(
      `current temp is ${currentWeather.temperature} and the temperature for tomorrow is ${dailyWeather.tempMin[0]} - ${dailyWeather.tempMax[0]}`
    );

    //add data to the DOM
    city.innerHTML = currentCity;
    temp.innerHTML = currentWeather.temperature;
    return new Array(currentWeather, dailyWeather);
  }
};

const addWeeklyWeatherReportToDom = async (dataFunc, data) => {
  let info = await dataFunc(data);
  console.log("INFO");
  console.log(info);
  let div = () => {
    return document.createElement("div");
  };
  let weeklyWeatherContainer = div();
  weeklyWeatherContainer.setAttribute("data-weekly-weather", "");
  weeklyWeatherContainer.classList.add(
    "weekly-weather",
    "app-container__weekly-weather"
  );
  //* use while to create forecast card for a day

  // array[1]   - array of objects, index  [1] contains Arrays
  // weatherCode
  // tempMin
  // tempMax

  for (i = 0; i <= 6; i++) {
    let dayContainer = div(); //!container for a day weather
    dayContainer.classList.add("weekly-weather__day-container"); //*set class for a day container
    let weatherIcon = div(); //!weather icon for a day
    switch (await info[1].weatherCode[i]) {
      case 0: //clear sky
        weatherIcon.classList.add(
          "weekly-weather__weather-icon",
          "fa-solid",
          "fa-sun"
        );
        break;
      case 1: //mainly clear
      case 2: //partly cloudy
        weatherIcon.classList.add(
          "weekly-weather__weather-icon",
          "fa-solid",
          "fa-cloud-sun"
        );
        break;
      case 3: //overcast
        weatherIcon.classList.add(
          "weekly-weather__weather-icon",
          "fa-solid",
          "fa-cloud"
        );
        break;
      case 45: //fog
      case 48: //depositing rime fog
        weatherIcon.classList.add(
          "weekly-weather__weather-icon",
          "fa-solid",
          "fa-smog"
        );
        break;
      case 51: //drizzle light
      case 53: //drizzle moderate
      case 55: //drizzle dense
        weatherIcon.classList.add(
          "weekly-weather__weather-icon",
          "fa-solid",
          "fa-cloud-showers-heavy"
        );
        break;
      case 56: //freezing drizzle - light
      case 57: //freezing  drizzle - dense
        weatherIcon.classList.add(
          "weekly-weather__weather-icon",
          "fa-solid",
          "fa-snowflake"
        );
        break;
      case 61: //rain slight
      case 63: //rain moderate
      case 65: //rain heavy
        weatherIcon.classList.add(
          "weekly-weather__weather-icon",
          "fa-solid",
          "fa-cloud-sun-rain"
        );
        break;
      case 66: //freezing rain - light
      case 67: //freezing rain - heavy
      case 71: //snow fall - slight
      case 73: //snow fall - moderate
      case 75: //snow fall - heavy
      case 77: //snow grains
        weatherIcon.classList.add(
          "weekly-weather__weather-icon",
          "fa-solid",
          "fa-snowflake"
        );
        break;
      case 80: //rain showers - slight
      case 81: //rain showers - moderate
      case 82: //rain showers - violent
      case 85: //snow showers - slight
      case 86: //snow showers - heavy
        weatherIcon.classList.add(
          "weekly-weather__weather-icon",
          "fa-solid",
          "fa-cloud-showers-heavy"
        );
        break;
      case 95: //thunderstorm - slight or moderate
      case 96: //thunderstorm with slight hail
      case 99: //thunderstorm with heavy hail
        weatherIcon.classList.add(
          "weekly-weather__weather-icon",
          "fa-solid",
          "fa-cloud-bolt"
        );
        break;
    }
    let dayTemperature = div(); //!day Temp
    dayTemperature.classList.add("weekly-weather__day-temperature");
    dayTemperature.innerHTML = `${info[1].tempMin[i]} - ${info[1].tempMax[i]} &deg`;
    let dayOfTheWeek = div(); //!date
    dayOfTheWeek.classList.add("weekly-weather__day");
    //format Date
    let dateFormatted = new Date(info[1].time[i]);
    console.log(dateFormatted);
    let monthFormatted = months[dateFormatted.getMonth()];
    let dayFormatted = dateFormatted.getDate();

    //dayOfTheWeek.innerHTML = info[1].time[i];
    dayOfTheWeek.innerHTML = `${monthFormatted} ${dayFormatted}`;

    //*append all children to parent element

    dayContainer.appendChild(weatherIcon);
    dayContainer.appendChild(dayTemperature);
    dayContainer.appendChild(dayOfTheWeek);
    weeklyWeatherContainer.appendChild(dayContainer);
  }
  appContainer.appendChild(weeklyWeatherContainer);
};

//! snippet of OLD code
/*for (i = 0; i <= info[1].length; i++) {
    let dayContainer = div(); //!container for a day weather
    dayContainer.classList.add("weekly-weather__day-container"); //*set class for a day container
    let weatherIcon = div(); //!weather icon for a day
    switch (await info[1].weatherCode.length) {
      case 0: //clear sky
        weatherIcon.classList.add(
          "weekly-weather__weather-icon",
          "fa-solid",
          "fa-sun"
        );
        break;
      case 1: //mainly clear
      case 2: //partly cloudy
        weatherIcon.classList.add(
          "weekly-weather__weather-icon",
          "fa-solid",
          "fa-cloud-sun"
        );
        break;
      case 3: //overcast
        weatherIcon.classList.add(
          "weekly-weather__weather-icon",
          "fa-solid",
          "fa-cloud"
        );
        break;
      case 45: //fog
      case 48: //depositing rime fog
        weatherIcon.classList.add(
          "weekly-weather__weather-icon",
          "fa-solid",
          "fa-smog"
        );
        break;
      case 51: //drizzle light
      case 53: //drizzle moderate
      case 55: //drizzle dense
        weatherIcon.classList.add(
          "weekly-weather__weather-icon",
          "fa-solid",
          "fa-cloud-showers-heavy"
        );
        break;
      case 56: //freezing drizzle - light
      case 57: //freezing  drizzle - dense
        weatherIcon.classList.add(
          "weekly-weather__weather-icon",
          "fa-solid",
          "fa-snowflake"
        );
        break;
      case 61: //rain slight
      case 63: //rain moderate
      case 65: //rain heavy
        weatherIcon.classList.add(
          "weekly-weather__weather-icon",
          "fa-solid",
          "fa-cloud-sun-rain"
        );
        break;
      case 66: //freezing rain - light
      case 67: //freezing rain - heavy
      case 71: //snow fall - slight
      case 73: //snow fall - moderate
      case 75: //snow fall - heavy
      case 77: //snow grains
        weatherIcon.classList.add(
          "weekly-weather__weather-icon",
          "fa-solid",
          "fa-snowflake"
        );
        break;
      case 80: //rain showers - slight
      case 81: //rain showers - moderate
      case 82: //rain showers - violent
      case 85: //snow showers - slight
      case 86: //snow showers - heavy
        weatherIcon.classList.add(
          "weekly-weather__weather-icon",
          "fa-solid",
          "fa-cloud-showers-heavy"
        );
        break;
      case 95: //thunderstorm - slight or moderate
      case 96: //thunderstorm with slight hail
      case 99: //thunderstorm with heavy hail
        weatherIcon.classList.add(
          "weekly-weather__weather-icon",
          "fa-solid",
          "fa-cloud-bolt"
        );
        break;
    }
    let dayTemperature = div(); //!day Temp
    dayTemperature.classList.add("weekly-weather__day-temperature");
    dayTemperature.innerHTML = `${info[0][i].tempMin} - ${info[0][i].tempMax} &deg`;
    let dayOfTheWeek = div(); //!date
    dayOfTheWeek.classList.add("weekly-weather__day");
    dayOfTheWeek.innerHTML = info[0][i].time;

    //*append all children to parent element

    dayContainer.appendChild(weatherIcon);
    dayContainer.appendChild(dayTemperature);
    dayContainer.appendChild(dayOfTheWeek);
    weeklyWeatherContainer.appendChild(dayContainer);
    appContainer.appendChild(weeklyWeatherContainer);
  }
};*/

// function that removes all child elements from UL (list)
const removeTagLi = () => {
  let searchBarList = document.querySelector("[data-search-bar__list]");
  while (searchBarList.firstChild) {
    searchBarList.removeChild(searchBarList.firstChild);
  }
};
const removeWeeklyWeatherReport = () => {
  let weeklyReport = document.querySelector("[data-weekly-weather]");
  weeklyReport
    ? weeklyReport.remove()
    : console.log("Weekly weather report isn't found");
};
// function that creates a LI element, passes API data to it and then displays it at DOM
const createTagLiForCity = async (data, eventListener, dataExt, dataExt2) => {
  let searchBarList = document.querySelector("[data-search-bar__list]");

  let li = document.createElement("li");
  li.innerHTML = data;
  li.setAttribute("data-search-bar-item", "");
  li.classList.add("search-bar__list-item");
  eventListener(li, dataExt);
  //create img
  let img = document.createElement("img");
  img.setAttribute("src", dataExt2);
  img.classList.add("search-bar__list-img");
  li.appendChild(img);

  searchBarList.appendChild(li);
  console.log("el is created" + dataExt);
};

//debugger;

// event listener that invokes API-related functions on input
searchBarInput.addEventListener("input", displayDataAtDom);

// function that tests Event Listener Behavior. It emulates user input
function testEventListenerBehavior() {
  let event = new Event("input");
  searchBarInput.dispatchEvent(event);
}

// function that adds eventListener for tag <li>
// when clicked        - gets coordinates for this city
//                     - activates getWeather function
//                     - removes <li> tags
// then fetch the DATA from API and fill it to the DOM
//clear all <li> tags
//clear input field value when the data is fetched and displayed at the DOM
function addEventListenerForTagLi(liTag, data) {
  liTag.addEventListener("click", async () => {
    removeTagLi(),
      clearInputValue(),
      removeWeeklyWeatherReport(),
      getWeather(data),
      await addWeeklyWeatherReportToDom(getWeather, data);
  });
}

const clearInputValue = () => {
  searchBarInput.value = "";
};

//testEventListenerBehavior();

// -------------end

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

function testDiv() {
  let div = () => {
    return document.createElement("div");
  };
  let day = div();
  day.innerHTML = "HIIII";
  appContainer.appendChild(day);
  console.log(div());
}

//testDiv()
