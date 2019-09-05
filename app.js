const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temperature-value p");
const descElement = document.querySelector(".temperature-description p");
const locationElement = document.querySelector(".location p");
const notificationElement = document.querySelector(".notification");

// App data
const weather = {};

weather.temperature = {
    unit : "celsius"
}

// APP CONSTS AND VARS
const KELVIN = 273;
// API KEY
const key = "819efa6b4e530afbefd5b4e548bfc963";

// CHECK IF BROWSER SUPPORTS GEOLOCATION
if('geolocation' in navigator){
    navigator.geolocation.getCurrentPosition(setPosition, showError);
}else{
    notificationElement.style.display = "block";
    notificationElement.innerHTML = "<p>Browser doesn't Support Geolocation</p>";
}

// SET USER'S POSITION
function setPosition(position){
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    
    getWeather(latitude, longitude);
}

// SHOW ERROR WHEN THERE IS AN ISSUE WITH GEOLOCATION SERVICE
function showError(error){
    notificationElement.style.display = "block";
    notificationElement.innerHTML = `<p> ${error.message} </p>`;
}
function getWeather(latitude,longitude){
    let api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;
    fetch(api)
    .then(function(response){
        let data = response.json();
        return data;


    })
    .then(function(data){
        weather.temperature.value = Math.floor(data.main.temp - KELVIN);
        weather.description = data.weather[0].description;
        weather.iconId = data.weather[0].icon;
        weather.city = data.name;
        weather.country = data.sys.country;

    })
    .then(function(){
        displayWeather();

    })
}
//Inject data to the UI
function displayWeather(){
    iconElement.innerHTML = `<img src = "icons/${weather.iconId}.png"/>`;
    tempElement.innerHTML = `${weather.temperature.value}<span><sup>°</sup></span>c`;
    //descElement.innerHTML = `${weather.description}`;
    // for some reason the above code does not work so going the old way below
    document.querySelector('.temperature-description').innerHTML =weather.description;
    locationElement.innerHTML = `${weather.city},${weather.country}`;

}
//temp Convertion
function celsiusToFarenheight(temp){
    return (temp*9/5)+32;

}
//Inject the farenheight data to the UI
tempElement.addEventListener("click",()=>{
    if(weather.temperature.value === undefined) return;
    if(weather.temperature.unit === "celsius"){
        temp = weather.temperature.value;
      let newTemp = celsiusToFarenheight(temp);
      newTemp = Math.floor(newTemp);
      tempElement.innerHTML =`${newTemp}<span><sup>°</sup></span>F`;
      weather.temperature.unit = "farenheight";
    }else{
        tempElement.innerHTML = `${weather.temperature.value}<span><sup>°</sup></span>C`
        weather.temperature.unit = "celsius";

     
    }
    

})