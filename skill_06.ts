const fetchApi1 = "https://api.adviceslip.com/advice/1";
const fetchApi2 = "https://api.adviceslip.com/advice/2";

// const fetchAdvice = () => {
//   fetch(fetchApi1)
//     .then((response1) => response1.json())
//     .then((data1) => {
//       return fetch(fetchApi2)
//         .then((response2) => response2.json())
//         .then((data2) => {
//           console.log(data1, data2);
//         });
//     })
//     .catch((error) => {
//       console.log("Error fetching advice:", error);
//     });
// };

const fetchAdvice = async () => {
  try {
    const response1 = await fetch(fetchApi1);
    const data1 = await response1.json();
    const response2 = await fetch(fetchApi2);
    const data2 = await response2.json();
    console.log(data1, data2);
  } catch (error) {
    console.log("Error fetching advice:", error);
  }
};

fetchAdvice();
