import fetchWeather from './modules/fetchWeather.js';
import results from './modules/results.js';

const handleClick = () => {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
    } else {
        alert("Sorry, your browser doesn't support geolocation services.")
    }
}

const geoError = error => console.log(error);

const geoSuccess = position => {
    const {latitude: lat, longitude: lon} = position.coords;
    fetchWeather([lat, lon]).then(res => results(res.data.timelines[0].intervals[0].values));
}

// add event listener to get weather button
const weatherButton = document.querySelector('#weatherBtn');
weatherButton.addEventListener('click', handleClick);


// input event handler for slider and text value
const changeText = (e) => {
    let sliderVal = e.target.value;
    const valueNode = document.querySelector(`#${e.target.id}Value`)
    sliderVal = sliderVal.toString() + (valueNode.id === 'temperatureValue' ? '°C' : 'm/s');
    valueNode.innerText = sliderVal;
}
// set text as value
document.querySelectorAll('input').forEach(input => {
    let sliderVal = input.value;
    const valueNode = document.querySelector(`#${input.id}Value`);
    sliderVal = sliderVal.toString() + (valueNode.id === 'temperatureValue' ? '°C' : 'm/s');
    valueNode.innerText = sliderVal;
    input.addEventListener('input', e => changeText(e));
});


/*
document.querySelector('#temperature').addEventListener('input', e => changeText(e));
document.querySelector('#windSpeed').addEventListener('input', e => changeText(e));
*/
