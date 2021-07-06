require('dotenv').config();
const apikey = process.env.API_KEY;
const PORT = process.env.PORT;
const fetch = require('node-fetch');
const express = require('express');
const app = express();
const path = require('path')
const queryString = require("query-string");

app.use(express.json());
app.use(express.static('public'));
express.static.mime.define({'application/javascript': ['js']});

// call api for weather data based on coordinate args
async function getWeather(latlong) {
    const location = `${latlong[0]},${latlong[1]}`;
    const getTimelineURL = "https://api.tomorrow.io/v4/timelines";
    const fields = [
        "weatherCode",
        "temperature",
        "temperatureApparent",
        "windSpeed",
        "windGust",
        "precipitationIntensity"
    ];
    const units = 'metric';
    const timesteps = ["current"];
    const getTimelineParameters = queryString.stringify({
        location,
        fields,
        units,
        timesteps,
        apikey,
    }, {arrayFormat: "comma"});
    const res = await fetch(getTimelineURL + "?" + getTimelineParameters, {
        method: "GET",
        headers: {Accept: "application/json"}
    });
    console.log(res.status);
    return await res.json();
}

// serving frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/index.html'));
})

app.post('/weather', (req, res) => {
    const response = getWeather(req.body)
        .then(data => res.json(data))
        .catch(e => console.log(e));
});




app.listen(PORT, () => {
    console.log(`Server started localhost:${PORT}`);
})
