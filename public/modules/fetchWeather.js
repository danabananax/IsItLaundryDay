export default async function fetchWeather(latlon) { // [lat, lon]
    console.log('fetching weather');
    try { 
        const res = await fetch('/weather', {
            method: "POST", 
            body: JSON.stringify(latlon),
            headers: {
                'Content-type': 'application/json'
            }
        });
        if(res.status > 200) throw Error(res.statusText);        
        return await res.json()
    } catch(err) {
        throw new Error(err);
    }
}