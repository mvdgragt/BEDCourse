const flipCoin = () => {
  return new Promise((resolve, reject) => {
    const outcome = Math.random() > 0.5;
    outcome ? resolve("You win!") : reject("You lose!");
  });
};

const result = async () => {
  try {
    const response = await fetch("https://api.adviceslip.com/advice");
    const data = await response.json();
    console.log(data.slip.advice);
  } catch (error) {
    console.log(error);
  }
};

result();
