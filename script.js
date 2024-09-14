const date = document.querySelector("[data-current-weather__date]");
const city = document.querySelector("[data-current-weather__city]");
const currentTemp = document.querySelector(
  "[data-current-weather__temperature]"
);
const currentWeatherIcon = document.querySelector(
  "[data-current-weather__icon]"
);
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

date.textContent = `${month} ${day}, ${year}`;

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
const displaySearchBarListAtDom = async () => {
  try {
    let fetchedData = await sendInputDataToApi();
    // removeChildElemIfTrue(searchBarList,"data-search-bar-item")

    removeDomElement("data-search-bar-item");
    //removeTagLi();
    console.log("Fetched Data:");
    console.log(fetchedData);
    let listOfCities = await analyzeDataFromApi(await fetchedData);
    console.log("List of cities:");
    console.log(listOfCities);

    displayCityAtSearchBarList(listOfCities);
  } catch (err) {
    console.log(err);
  }
};

// TODO create universal displayElAtDom function
// TODO review removeTagLi(), removeWeeklyWeatherReport(), removeChildElIfTrue(). Check if they do the same thing

// function that gets weather data from API
// needs to be reworked and completed
//! need to be refactored, separate function for displaying content at DOM
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
    city.textContent = currentCity;
    currentTemp.textContent = `${currentWeather.temperature} °`;
    //currentWeatherIcon.innerHTML = "";
    currentWeatherIcon.className = "current-weather__icon";
    chooseWeatherIcon(currentWeather, "", currentWeatherIcon, "currentWeather");
    //currentWeather.weatherCode;
    return new Array(currentWeather, dailyWeather);
  }
};

//! need to be refactored. Too complex
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

  for (i = 0; i <= 6; i++) {
    let dayContainer = div(); //!container for a day weather
    dayContainer.classList.add("weekly-weather__day-container"); //*set class for a day container
    let weatherIcon = div(); //!weather icon for a day
    //switch - choose weather icon
    chooseWeatherIcon(info, i, weatherIcon, "dailyWeather");

    let dayTemperature = div(); //!day Temp
    dayTemperature.classList.add("weekly-weather__day-temperature");
    dayTemperature.textContent = `${info[1].tempMin[i]} - ${info[1].tempMax[i]} °`;
    let dayOfTheWeek = div(); //!date
    dayOfTheWeek.classList.add("weekly-weather__day");
    //format Date
    let dateFormatted = new Date(info[1].time[i]);
    console.log(dateFormatted);
    let monthFormatted = months[dateFormatted.getMonth()];
    let dayFormatted = dateFormatted.getDate();

    //dayOfTheWeek.innerHTML = info[1].time[i];
    dayOfTheWeek.textContent = `${monthFormatted} ${dayFormatted}`;

    //*append all children to parent element

    dayContainer.appendChild(weatherIcon);
    dayContainer.appendChild(dayTemperature);
    dayContainer.appendChild(dayOfTheWeek);
    weeklyWeatherContainer.appendChild(dayContainer);
  }
  // removeChildElemIfTrue(appContainer, "data-weekly-weather");
  removeDomElement("data-weekly-weather");
  appContainer.appendChild(weeklyWeatherContainer);
};

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
searchBarInput.addEventListener("input", displaySearchBarListAtDom);

// function that tests Event Listener Behavior. It emulates user input
function testEventListenerBehavior() {
  let event = new Event("input");
  searchBarInput.dispatchEvent(event);
}

function addEventListenerForTagLi(liTag, data) {
  liTag.addEventListener("click", async () => {
    // removeTagLi(),
    removeDomElement("data-search-bar-item");
    clearInputValue(),
      // removeWeeklyWeatherReport()
      getWeather(data),
      await addWeeklyWeatherReportToDom(getWeather, data);
  });
}

const clearInputValue = () => {
  searchBarInput.value = "";
};

//testEventListenerBehavior();

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
//! what is a purpose of nesting a const func() inside a const func()?
const chooseWeatherIcon = (data, i = 0, domElement, forecastType) => {
  const typeOfIcon = async (data) => {
    switch (await data) {
      case 0: //clear sky
        domElement.classList.add(
          "weekly-weather__weather-icon",
          "fa-solid",
          "fa-sun"
        );
        break;
      case 1: //mainly clear
      case 2: //partly cloudy
        domElement.classList.add(
          "weekly-weather__weather-icon",
          "fa-solid",
          "fa-cloud-sun"
        );
        break;
      case 3: //overcast
        domElement.classList.add(
          "weekly-weather__weather-icon",
          "fa-solid",
          "fa-cloud"
        );
        break;
      case 45: //fog
      case 48: //depositing rime fog
        domElement.classList.add(
          "weekly-weather__weather-icon",
          "fa-solid",
          "fa-smog"
        );
        break;
      case 51: //drizzle light
      case 53: //drizzle moderate
      case 55: //drizzle dense
        domElement.classList.add(
          "weekly-weather__weather-icon",
          "fa-solid",
          "fa-cloud-showers-heavy"
        );
        break;
      case 56: //freezing drizzle - light
      case 57: //freezing  drizzle - dense
        domElement.classList.add(
          "weekly-weather__weather-icon",
          "fa-solid",
          "fa-snowflake"
        );
        break;
      case 61: //rain slight
      case 63: //rain moderate
      case 65: //rain heavy
        domElement.classList.add(
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
        domElement.classList.add(
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
        domElement.classList.add(
          "weekly-weather__weather-icon",
          "fa-solid",
          "fa-cloud-showers-heavy"
        );
        break;
      case 95: //thunderstorm - slight or moderate
      case 96: //thunderstorm with slight hail
      case 99: //thunderstorm with heavy hail
        domElement.classList.add(
          "weekly-weather__weather-icon",
          "fa-solid",
          "fa-cloud-bolt"
        );
        break;
    }
  };

  if (forecastType == "currentWeather") {
    typeOfIcon(data.weatherCode); //change to data[0].weatherCode[i], now returned Obj
    console.log("test icon - current");
    console.log(data);
  } else if (forecastType == "dailyWeather") {
    typeOfIcon(data[1].weatherCode[i]);
    console.log("test icon - daily");
    console.log(data[1].weatherCode[i]);
  }
};

const removeChildElemIfTrue = (parentEl, childSelector) => {
  let childEl = document.querySelector(`[${childSelector}]`);
  if (parentEl.contains(childEl)) {
    childEl.remove();
    console.log(`Element ${childEl} is removed`);
  } else console.log("no elements to remove");
};

const removeDomElement = (selector) => {
  let element = document.querySelectorAll(`[${selector}]`);
  if (element.length > 0) {
    element.forEach((el) => {
      el.remove();
      console.log(`Dom element ${el} is removed`);
    });
  }
  console.log("No DOM element need to be removed");
  console.log(element);
};

const displayCityAtSearchBarList = async (arrOfCities) => {
  await arrOfCities.forEach((city) => {
    let code = getFlagIcon(city.code).toLowerCase();
    createTagLiForCity(city.name, addEventListenerForTagLi, city, code);
    console.log(code);
  });
};
