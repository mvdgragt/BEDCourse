const fetchAdvice = async () => {
  try {
    const response = await fetch(`https://api.adviceslip.com/advice`);
    const data = await response.json();
    console.log(data.slip.advice);
  } catch (error) {
    console.log("Error fetching advice:", error);
  }
};

fetchAdvice();
