const API_KEY = 'a8178da96667451ab1e140038220902'
const API_URL = 'https://api.weatherapi.com/v1'

const WEATHER_CURRENT = '/current.json'
const WEATHER_FORECAST = '/forecast.json'
const WEATHER_SEARCH = '/search.json'
const WEATHER_HISTORY = '/history.json'
const WEATHER_TIMEZONE = '/timezone.json'
const WEATHER_SPORTS = '/sports.json'
const WEATHER_ASTRONOMY = '/astronomy.json'
const WEATHER_IPLOOKUP = '/ip.json'

let lang = '&lang=' + document.documentElement.lang

let weatherLoader = document.getElementById('loader')
let weatherLoaderRing = document.getElementById('loader-ring')
let weatherLoaderAlert = document.getElementById('loader-alert')
let weatherMain = document.getElementById('weather-main')
let weatherIcon = document.getElementById('weather-icon')
let weatherTemp = document.getElementById('weather-temp')
let weatherAdditionalBlock = document.getElementById('weather-additional-block')
let weatherTempBlock = document.getElementById('weather-temp-block')
let weatherCountry = document.getElementById('weather-country')
let weatherTime = document.getElementById('weather-time')
let weatherCondition = document.getElementById('weather-condition')
let weatherFeels = document.getElementById('weather-feels')
let weatherHumidity = document.getElementById('weather-humidity')
let weatherPrecip = document.getElementById('weather-precip')
let weatherWind = document.getElementById('weather-wind')
let weatherCloud = document.getElementById('weather-cloud')
let weatherPressure = document.getElementById('weather-pressure')
let weatherVisibility = document.getElementById('weather-visibility')
let weatherUvIndex = document.getElementById('weather-uv')
let weatherBy = document.getElementById('weather-by')

let dataObject = {}

const weekDays = ['Sunday', 'Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']


const convertKphMph = function (kph) {
    return Math.round(kph * 1000 / 3600) + ' m/s'
}

const getIcon = function(iconUrl) {
    let iconCode = iconUrl.match(/64x64\/[a-z]+\/\d+\.png/gm)[0]
        return `no-repeat center/100% url("./img/${iconCode}")`
}

const convertUnix = function (unixTimestamp) {
    let unixDate = new Date(unixTimestamp*1000)
    let weekday = weekDays[unixDate.getDay()]
    let hours = unixDate.getHours()
    let minutes = unixDate.getMinutes()
    if (hours < 10) {
        hours = '0' + hours
    } else {hours}
    if (minutes < 10) {
        minutes = '0' + minutes
    } else {minutes}
    return weekday + ' ' + hours + ':' + minutes
}

const hideLoader = function (){
    weatherAdditionalBlock.style.opacity = '100'
    weatherTempBlock.style.opacity = '100'
    weatherBy.style.opacity = '100'
    weatherLoader.style.display = 'none'
}

const getWeather = function(url, weatherByValue) {
    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            dataObject = data
            let locationName = ''
            if (data.location.region) {
                locationName = data.location.region
                    + ', ' + data.location.country
            } else {
                locationName = data.location.name
                    + ', ' + data.location.country
            }
            weatherTemp.innerHTML = Math.round(data.current.temp_c)
            weatherIcon.style.background = getIcon(data.current.condition.icon)
            weatherCountry.innerHTML = `<h4>${locationName}</h4>`
            weatherTime.innerHTML = convertUnix(data.location.localtime_epoch)
            weatherCondition.innerHTML = data.current.condition.text
            weatherFeels.innerHTML = Math.round(data.current.feelslike_c) + '°C'
            weatherHumidity.innerHTML = data.current.humidity + ' %'
            weatherPrecip.innerHTML = data.current.precip_mm + ' mm'
            weatherWind.innerHTML = data.current.wind_dir + ' ' + convertKphMph(data.current.wind_kph)
            weatherCloud.innerHTML = data.current.cloud + ' %'
            weatherPressure.innerHTML = Math.round(data.current.pressure_in) + ' in'
            weatherVisibility.innerHTML = data.current.vis_km + ' km'
            weatherUvIndex.innerHTML = data.current.uv
            weatherBy.innerHTML = 'Current weather by ' + weatherByValue
        })

}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(successful, error);
    }

    function error() {
        weatherLoaderRing.style.display = 'none'
        weatherLoaderAlert.style.display = 'flex'
        let query = '&q=auto:ip'
        let url = API_URL + WEATHER_CURRENT + '?key=' + API_KEY + query
        getWeather(url, 'IP')
    }

    async function successful(geoLocation) {
        let lat = geoLocation.coords.latitude
        let lon = geoLocation.coords.longitude
        let query = '&q=' + lat + ',' + lon
        let url = API_URL + WEATHER_CURRENT + '?key=' + API_KEY + query
        await getWeather(url, 'location')
        await hideLoader()
    }
}


const switcher = function() {
    let fahrenheit = document.getElementById('fahrenheit');
    let celsius = document.getElementById('celsius');
    if (celsius.checked) {
        weatherFeels.innerHTML = Math.round(dataObject.current.feelslike_c) + '°C'
        weatherTemp.innerHTML = Math.round(dataObject.current.temp_c)
    } else if (fahrenheit.checked) {
        weatherFeels.innerHTML = Math.round(dataObject.current.feelslike_f) + '°F'
        weatherTemp.innerHTML = Math.round(dataObject.current.temp_f)
    }
}

const bookmark = function() {
    let bookmarkElement = document.getElementById('bookmark')
    let aboutElement = document.getElementById('about')
    // start animation for bookmark
    bookmarkElement.style.animationName = 'bookmark-increase, bookmark-increase-text,' +
                                          'bookmark-decrease, bookmark-decrease-text,' +
                                          'hide-me'
    bookmarkElement.style.animationDuration = '1s, 1s, 3s, 2s, 2s'
    bookmarkElement.style.animationDelay = '0s, 0s, 1s, 1s, 1s'
    bookmarkElement.style.animationTimingFunction = 'linear'
    bookmarkElement.style.animationFillMode = 'forwards'
    bookmarkElement.style.cursor = 'default'
    // start animation for about block
    aboutElement.style.animationName = 'about-drop-down, show-me'
    aboutElement.style.animationDuration = '3s'
    aboutElement.style.animationDelay = '1.5s'
    aboutElement.style.animationTimingFunction = 'cubic-bezier(.49,.46,.51,1.13)'
    aboutElement.style.animationFillMode = 'forwards'
    // start animation for main weather block
    weatherMain.style.animationName = 'hide-bottom-border-radius'
    weatherMain.style.animationDuration = '3s'
    weatherMain.style.animationDelay = '1.5s'
    weatherMain.style.animationTimingFunction = 'linear'
    weatherMain.style.animationFillMode = 'forwards'
}



getLocation()

