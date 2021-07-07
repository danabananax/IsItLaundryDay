import fetchWeather from './modules/fetchWeather.js';
import results from './modules/results.js';

const handleClick = () => {
    console.log('clicked');
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
    } else {
        alert("Sorry, your browser doesn't support geolocation services.")
    }
}

const geoError = error => console.log(error);

const geoSuccess = position => {
    console.log(position.coords);
    const {latitude: lat, longitude: lon} = position.coords;
    fetchWeather([lat, lon]).then(res => results(res.data.timelines[0].intervals[0].values));
}

// add event listener to get weather button
const weatherButton = document.querySelector('#weatherBtn');
weatherButton.addEventListener('click', handleClick);


// input event handler for slider and text value
const changeText = (e) => {
    const sliderVal = e.target.value;
    const valueNode = document.querySelector(`#${e.target.id}Value`)
    valueNode.innerText = sliderVal;
}
// set text as value
document.querySelectorAll('input').forEach(input => {
    const sliderVal = input.value;
    const valueNode = document.querySelector(`#${input.id}Value`);
    valueNode.innerText = sliderVal;
    input.addEventListener('input', e => changeText(e));
});


/*
document.querySelector('#temperature').addEventListener('input', e => changeText(e));
document.querySelector('#windSpeed').addEventListener('input', e => changeText(e));
*/
