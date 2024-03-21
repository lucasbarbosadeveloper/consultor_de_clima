const form_search = document.querySelector('.search');
const alert_input = document.querySelector('.alert_input');
const weather = document.querySelector('.weather');

// função assincrona nos parametros do evento
form_search.addEventListener('submit', async (ev) => {
  ev.preventDefault();
  const city_name = document.querySelector('#city_name').value;
  
  if (city_name.length === 0) {
    alert_input.innerHTML = "";

    const p_alert = document.createElement('span');
    p_alert.innerText = 'Digite uma cidade!';

    const img_alert = document.createElement('img');
    img_alert.setAttribute('src', './src/imgs/undraw_typewriter_re_u9i2.svg');

    alert_input.append(p_alert, img_alert);

    weather.style.display = "none";
    
  };

  if (city_name.length !== 0) {
    weather.style.display = "block";
  };

  // requisicoes da API open wether
  // chave da api(pega no site)
  const apiKey = '8a60b2de14f7a17c7a11706b2cfcd87c';

  // url da api
  const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURI(city_name)}&appid=${apiKey}&units=metric&lang=pt_br`;

  // requisição a API
  const results = await fetch(apiURL);

  // convertendo o JSON para Objeto
  const json = await results.json();
  
  if (json.cod !== 200 && city_name.length !== 0) {
    alert_input.innerHTML = "";

    weather.style.display = "none";
    
    const p_alert = document.createElement('span');
    p_alert.innerText = 'Não foi possível localizar...';
    
    const img_alert = document.createElement('img');
    img_alert.setAttribute('src', './src/imgs/undraw_page_not_found_re_e9o6.svg');
    
    alert_input.append(p_alert, img_alert);
    
  };
  
  // requisicoes da API places
  const geoCode = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${json.coord.lat},${json.coord.lon}&key=AIzaSyDztNU2xHvZrX0Dcwrad-TGLR7EkQCmGHk`;
  
  const geoCodeResult = await fetch(geoCode);
  
  const jsonGeoCode = await geoCodeResult.json();
  
  if (json.cod === 200 && jsonGeoCode.status === "OK") {
    showInfos({
      city: json.name,
      UF: jsonGeoCode.plus_code.compound_code.slice(9).split(',')[1].slice(1),
      country: json.sys.country,
      temp: json.main.temp,
      tempMax: json.main.temp_max,
      tempMin: json.main.temp_min,
      description: json.weather[0].description,
      icon: json.weather[0].icon,
      humidity: json.main.humidity,
      windSpeed: json.wind.speed,
      lat: json.coord.lat,
      lon: json.coord.lon
    });
  }
  
  
});

function showInfos(json) {
  document.querySelector('.title').innerText = `${json.city}-${json.UF}, ${json.country}`;
  document.querySelector('.temp_value').innerHTML = `${json.temp.toFixed(1).toString().replace('.', ',')} <sup>°C</sup>`;
  document.querySelector('.temp_description').innerText = json.description;
  document.querySelector('.temp_max').innerHTML = `${json.tempMax.toFixed(1).toString().replace('.', ',')} <sup>°C</sup>`;
  document.querySelector('.temp_min').innerHTML = `${json.tempMin.toFixed(1).toString().replace('.', ',')} <sup>°C</sup>`;
  document.querySelector('.humidity').innerText = `${json.humidity}%`;
  document.querySelector('.wind').innerText = `${(json.windSpeed * 3.6).toFixed(1)} km/h`;
  document.querySelector('.temp_icon').setAttribute('src', `https://openweathermap.org/img/wn/${json.icon}@2x.png`);
}