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

const propertyTitles = {
      'temperature': {
            name: 'Temperature:',
            units: '°C'
      }, 
      'temperatureApparent': {
            name: "Apparent Temperature:", 
            units: '°C'
      },
      'windSpeed': {
            name: 'Wind Speed:', 
            units: 'm/s'
      },
      'windGust': {
            name: 'Wind Gust:', 
            units: 'm/s'
      },
      'precipitationIntensity': {
            name: 'Precipitation Intensity', 
            units: 'mm/hr'
      },
}

const iconNames = {
      "0": "Unknown",
      "1000": {
            day: "clear_day",
            night: "clear_night"
      },
      "1001": "cloudy.svg",
      "1100": {
            day: "mostly_clear_day",
            night: "mostly_clear_night",
      },
      "1101": {
            day: "partly_cloudy_day",
            night: "partly_cloudy_night",
      },
      "1102": "mostly_cloudy",
      "2000": "fog",
      "2100": "fog_light",
      "4000": "drizzle",
      "4001": "rain",
      "4200": "rain_light",
      "4201": "rain_heavy",
      "5000": "snow",
      "5001": "flurries",
      "5100": "snow_light",
      "5101": "snow_heavy",
      "6000": "freezing_drizzle",
      "6001": "freezing_rain",
      "6200": "freezing_rain_light",
      "6201": "freezing_rain_heavy",
      "7000": "ice_pellets",
      "7101": "ice_pellets_heavy",
      "7102": "ice_pellets_light",
      "8000": "tstorm",
      "variableCodes": [1000,1100,1101],
}

export {codeDescriptions, propertyTitles, iconNames};
