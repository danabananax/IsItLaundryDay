import {codeDescriptions, propertyTitles, iconNames} from '../helper.js';


// grab user configured conditions for drying and output with object {temperature: X, windSpeed: Y} 
const getConditions = () => {
    const conditions = {};
    document.querySelectorAll('.mdl-slider').forEach(slider => conditions[slider.id] = slider.value);
    return conditions;
}

// get and diff conditions and produce appropriate output string from score
const getResultString = (data) => {
    const conditions = getConditions();

    if(data['precipitationIntensity'] > 0) return "Since its raining,\nstick to the dryer today."
    
    let score = 0;
    const resultStrings = {
        0: 'None of your conditions matched so\nmaybe stick to the dryer today.',
        1: '1/2 conditions passed. Maybe not\nthe best day, but doable!',
        2: '2/2 conditions passed. Perfect day!'
    }

    for(const property in conditions) if(data[property] > conditions[property]) score++;
    
    return resultStrings[score];
}

export default function results(data) { // {weatherCode: 1000, precipitationIntensity: 2, temperatur...}
    // get rid of previous display
    document.querySelector('.getWeatherContainer').style.display = 'none';

    // Generate result string using local fn's in module
    const resultString = document.createTextNode(getResultString(data));
    document.querySelector('#resultText').appendChild(resultString);


    // add image above header corresponding to weather
    const hours = new Date().getHours();
    const isDay = hours > 6 && hours < 20;
    let iconName;

    if(iconNames.variableCodes.includes(data.weatherCode)) { // if icon is variable according to day/night
        iconName = isDay ? iconNames[data.weatherCode].day : iconNames[data.weatherCode].night;
    } else {
        iconName = iconNames[data.weatherCode];
    }
    const iconElement = document.querySelector('#weatherImg');
    iconElement.setAttribute('src', `./icons/color/${iconName}.svg`)
    iconElement.setAttribute('alt', iconName);

    // displaying weather condition
    const header = document.querySelector('#header');
    const headerText = document.createTextNode(codeDescriptions[data.weatherCode]);
    header.appendChild(headerText);

    // populating then displaying results
    const resultList = document.querySelector('#results');

    for(const property in data) {
        if(property === 'weatherCode') continue;
        const listElement = document.createElement('li');

        const propName = document.createElement('span');
        propName.classList.add('propName');
        propName.appendChild(document.createTextNode(propertyTitles[property].name));

        const propData = document.createElement('span');
        propData.classList.add('propData');
        propData.appendChild(document.createTextNode(data[property] + propertyTitles[property].units));

        listElement.append(propName, propData);
        resultList.append(listElement);
    }

    const resultContainer = document.querySelector('.resultContainer');
    resultContainer.style.display = 'flex'; 
}