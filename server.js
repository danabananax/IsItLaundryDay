const apikey = process.env.API_KEY;
const PORT = process.env.PORT || 3000;
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
        fields,
        units,
        timesteps,
        apikey,
        location
    }, {arrayFormat: "comma"});
    const reqURL = getTimelineURL + '?' + getTimelineParameters;
    const res = await fetch(reqURL, {
        method: "GET",
        headers: {Accept: "application/json"}
    });    
    console.log(res.status);
    return await res.json();
}

// serving frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/index.html'));
})

app.post('/weather', (req, res) => {
    getWeather(req.body)
        .then(data => {
            return res.json(data)
        })
        .catch(e => console.log(e));
});




app.listen(PORT, () => {
    console.log(`Server started localhost:${PORT}`);
})
