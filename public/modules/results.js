import {codeDescriptions, propertyTitles, iconNames} from '../helper.js';

export default function results(data) { // {weatherCode: 1000, precipitationIntensity: 2, temperatur...}
    // get rid of previous display
    console.log(data); 
    document.querySelector('.getWeatherContainer').style.display = 'none';

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

    // populating then displaying generic results
    const resultList = document.querySelector('#results');

    for(const property in data) {
        console.log(property);
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