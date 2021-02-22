console.log('here we go');
const codeDescriptions = {
      "0": "Unknown",
      "1000": "Clear",
      "1001": "Cloudy",
      "1100": "Mostly Clear",
      "1101": "Partly Cloudy",
      "1102": "Mostly Cloudy",
      "2000": "Fog",
      "2100": "Light Fog",
      "3000": "Light Wind",
      "3001": "Wind",
      "3002": "Strong Wind",
      "4000": "Drizzle",
      "4001": "Rain",
      "4200": "Light Rain",
      "4201": "Heavy Rain",
      "5000": "Snow",
      "5001": "Flurries",
      "5100": "Light Snow",
      "5101": "Heavy Snow",
      "6000": "Freezing Drizzle",
      "6001": "Freezing Rain",
      "6200": "Light Freezing Rain",
      "6201": "Heavy Freezing Rain",
      "7000": "Ice Pellets",
      "7101": "Heavy Ice Pellets",
      "7102": "Light Ice Pellets",
      "8000": "Thunderstorm"
};
if(!navigator.geolocation) console.log('something is wrong with navigator.geolocation');

const getCurPosition = options => new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
});

async function fetchWeather() {
    try { 
        console.log('fetching geolocation');
        const {coords: {latitude, longitude}} = await getCurPosition({
            enableHighAccuracy: false,
            timeout: 10000,
        });
        console.log('fetching weather');
        const res = await fetch('/weather', {
            method: "POST",
            // mode: "cors",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({latitude: latitude, longitude: longitude})
        });
        console.log(res.status);
        if(res.status > 200) throw Error(res.statusText);
        const data = await res.json();
        console.log(data);
        

        if(data.data.timelines[0].intervals.length === 0) {
            alert("API response is missing data. Please reload.");
        }

        const weatherData = data.data.timelines[0].intervals[0].values;

        console.log(weatherData);
        return weatherData;
    } catch(err) {
        displayErr(err);
        throw new Error(err);
    }
}

function displayErr(e) {
    const heading = document.querySelector('h1');
    heading.textContent = "Oops, we encounted an error when grabbing data:"
    const errorMsg = document.createElement('h2');
    errorMsg.textContent = e;
    const container = document.querySelector('.container');
    container.appendChild(errorMsg);
    return 0;
}

function processScore(weatherDetails, threshHolds, prop) {
    switch(prop) {
        case 'weatherCode':
            console.log('thresholds: ' + threshHolds[prop]);
            const isSunny = threshHolds[prop].includes(weatherDetails[prop]);
            console.log('isSunny: ' + isSunny);
            return (isSunny ? 0 : -3); // bad weather code eg rain rules out everything
        case 'humidity':
            // min 0 max 2
            //const humDifference = weatherDetails[prop] - threshHolds[prop];
            //const humVariance = humDifference*(1/threshHolds[prop]);
            //const humScore = 1 - humVariance; // lower is better
            return (threshHolds[prop] > weatherDetails[prop] ? 1 : 0);
            break;
        case 'precipitationIntensity':

            return (weatherDetails[prop] > threshHolds[prop] ? 0 : 1); 
        case 'temperature':
            // min 0 max 3 (40deg)
            // const tempDifference = weatherDetails[prop] - threshHolds[prop];
            // const tempVariance = tempDifference*0.1;
            // const tempScore = 1 + tempVariance; // higher is better
            
        case 'windSpeed': // max 1 min 0
            // const windSpeed = weatherDetails[prop];
            // const wsScore = windSpeed/threshHolds[prop]; // higher is better
            return (weatherDetails[prop] > threshHolds[prop] ? 1 : 0);
            break;            
        default:
            console.log(`default\nweatherDetails[${prop}] = ${weatherDetails[prop]}\nthreshHolds[${prop}] = ${threshHolds[prop]}`);
            break;
    }
}

function processWeather(weatherDetails) {
    const threshHolds = {
        temperature: 20,
        weatherCode: [1001, 1101, 1100, 1000, 1102],
        windSpeed: 1.5,
        humidity: 80,
        precipitationIntensity: 0
    }
    class descriptor {
        constructor(positive, negative, unit) {
            this.positive = positive;
            this.negative = negative;
            this.unit = unit;
        }
    }
    const descriptors = {
        temperature: new descriptor("Warm", "Cold", "&#x2103"),
        humidity: new descriptor("Dry", "Humid", "%"),
        windSpeed: new descriptor("Windy", "Windless", "m/s"),
        precipitationIntensity: new descriptor("Not Raining", "Raining", "mm/hr")
    };

    const descriptions = {};
    // toalScore max = 3, min to be laundry day = 2
    let totalScore = 0;

    for(prop in weatherDetails) {
        let propScore = processScore(weatherDetails, threshHolds, prop);
        if(prop === 'weatherCode') { 
            descriptions[prop] = codeDescriptions[weatherDetails[prop]];
        } else {    // descriptions = {humidity: ['dry', '%']}
            descriptions[prop] = [(propScore > 0 ? descriptors[prop].positive : descriptors[prop].negative), descriptors[prop].unit]; 
        }
        totalScore += propScore;
        console.log(`total score at ${prop}: ${totalScore}`);
    }
    if(totalScore < 0) { // negative total score indicates bad weather code
        badWeatherCode(weatherDetails['weatherCode'])
    } else {
        generateReport(weatherDetails, descriptions, totalScore);
    }
}

function generateResult(result) {
    const resultElement = document.createElement('h1');
    resultElement.innerText = (result ? "It's a great day for laundry!" : "It's not a great day for laundry.");
    document.body.appendChild(resultElement);
}

function badWeatherCode(code) {
    const weatherState = codeDescriptions[code.toString()];
    const description = document.createElement('h2');
    description.innerText = `Because the weather is described as ${weatherState},`;
    document.body.appendChild(description);
    generateResult(false);
}

function generateReport(weatherDetails, descriptions, total) {
    const heading = document.querySelector('h1');
    heading.textContent = "And the results are:"
    const header = document.createElement('h2');
    header.innerText = "Because the weather is...";
    document.body.append(header);
    const list = document.createElement('ul');
    console.log(descriptions);
    for (prop in descriptions) {
        if(prop === 'weatherCode') {
            list.appendChild(createDescription(prop, weatherDetails[prop], codeDescriptions[weatherDetails[prop]]))
        } else {
            list.appendChild(createDescription(prop, weatherDetails[prop], descriptions[prop]));
        }
    };
    document.body.appendChild(list); 
    
    generateResult(total >= 2);
}


function createDescription(prop, data, description) {
    // create <li>
    const listElement = document.createElement('li');

    if(prop === 'weatherCode') {
        const propertyDesc = document.createElement('p');
        propertyDesc.innerText = codeDescriptions[data.toString()];
        listElement.appendChild(propertyDesc);
    } else {
        // <p>property description</p>
        const propertyDesc = document.createElement('p');
        propertyDesc.innerHTML = `<strong>${description[0]}</strong>  (${data} ${description[1]})`; 
        propertyDesc.classList.add('propDesc');
        listElement.appendChild(propertyDesc);
        // appending to <ul>
    }
    return listElement;
}


//document.addEventListener('load', (e) => {
//    //e.preventDefault(e);
//    
//    fetchWeather().catch(e => console.log(e));
//    
//});

fetchWeather().then(weather => {
    processWeather(weather);
}).catch(e => console.log(e));