const myPromise = new Promise((resolve, reject) => {
  const success = true;

  if (success) {
    resolve("Resolved operation successfully!");
  } else {
    reject("Resolved operation rejected!");
  }
});

const result = async () => {
  try {
    const message = await myPromise;
    console.log(message);
  } catch (error) {
    console.log("rejected reason:", error);
  }
};

result();

// type AdviceSlipType = {
//   slip: {
//     id: number;
//     advice: string;
//   };
// };

// const fetchAdviceById = (id: number): void => {
//   const data = fetch(`https://api.adviceslip.com/advice/${id}`)
//     //console.log(data);
//     .then((response: Response) => {
//       // console.log(response);
//       if (!response.ok) {
//         throw new Error("Fetching did not work");
//       }
//       return response.json();
//       // console.log(response.ok)
//     })
//     .then((data: AdviceSlipType) => {
//       // console.log(data.slip.advice);
//       const advice = data.slip.advice;
//       console.log(`Advice ID: ${id}: ${advice}`);
//     })
//     .catch((error: unknown) => {
//       console.log("Error fetching advice:", error);
//     });
// };

const fetchAdviceById = async (id: number): Promise<void> => {
  try {
    const response = await fetch(`https://api.adviceslip.com/advice/${id}`);
    if (!response.ok) {
      throw new Error("Fetching did not work");
    }
    const data = await response.json();
    const advice = data.slip.advice;
    console.log(`Advice ID: ${id}: ${advice}`);
  } catch (error) {
    console.log("Error fetching advice:", error);
  }
};

fetchAdviceById(11);

/*
async //before the function
await  //before the promise
try //block of code that might fail
catch //block of code that only runs if something goes wrong
Promise //a value we don't have yet

await only works inside an async function!
*/

const weatherInHelsingborg = async () => {
  try {
    const response = await fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=56.0467&longitude=12.6944&current=temperature_2m",
    );
    const data = await response.json();
    console.log(
      `The temperature in Helsingborg is currently ${data.current.temperature_2m} ${data.current_units.temperature_2m}.`,
    );
  } catch (error) {}
};

weatherInHelsingborg();

const apiKey = "e862426d0c9d8e47efc1c248e4f5a66a";
const lat = 56.0467;
const lon = 12.6944;
//api.openweathermap.org/data/4.0/onecall/current?lat={lat}&lon={lon}&appid={apiKey}

const weatherInHelsingborg2 = async () => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`,
    );
    const data = await response.json();
    console.log(
      `The temperature in ${data.name} is ${data.main.temp} degrees Celcius.`,
    );
  } catch (error) {
    console.log(error);
  }
};

weatherInHelsingborg2();
