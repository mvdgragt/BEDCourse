const lon_hbg = 12.6944;
const lat_hbg = 56.0467;

const lon_ams = 4.8897;
const lat_ams = 52.374;

const weatherInHelsingborg = async () => {
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat_hbg}&longitude=${lon_hbg}&current=temperature_2m`,
  );
  const data = await response.json();
  return `The temperature in Helsingborg is currently ${data.current.temperature_2m} ${data.current_units.temperature_2m}.`;
};

const weatherInAmsterdam = async () => {
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat_ams}&longitude=${lon_ams}&current=temperature_2m`,
  );
  const data = await response.json();
  return `The temperature in Amsterdam is currently ${data.current.temperature_2m} ${data.current_units.temperature_2m}.`;
};

const getWeather = async () => {
  try {
    const [helsingborgResult, amsterdamResult] = await Promise.all([
      weatherInHelsingborg(),
      weatherInAmsterdam(),
    ]);
    console.log(helsingborgResult);
    console.log(amsterdamResult);
  } catch (error) {
    console.log(error);
  }
};

getWeather();
