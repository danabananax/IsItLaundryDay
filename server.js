require('dotenv').config();
const APIKEY = process.env.CLIMACELL_API_KEY;
const fetch = require('node-fetch');
const express = require('express');
const app = express();

app.use(express.json());
app.use(express.static('public'));

async function getWeather(coords) {
    const response = await fetch(`https://data.climacell.co/v4/timelines?location=${coords.latitude}%2C${coords.longitude}&fields=temperature&fields=weatherCode&fields=windSpeed&fields=humidity&fields=precipitationIntensity&timesteps=current&units=metric&apikey=${APIKEY}`, {
        "method": "GET",
        "mode": "cors",
        "headers": {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    });
    console.log(response);
    // console.log(await response.json());
    return await response.json();
}

app.post('/weather', (req, res) => {
    console.log(req.body);
    const response = getWeather(req.body).then(data => res.json(data)).catch(e => console.log(e));
    // console.log(response);
    // res.json(response);
});


app.listen(8080, () => {
console.log('Server started');
})
