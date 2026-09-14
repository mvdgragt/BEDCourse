const flipCoin = () => {
  return new Promise((resolve, reject) => {
    const outcome = Math.random() > 0.5;
    outcome ? resolve("You win!") : reject("You lose!");
    console.log(outcome);
  });
};

const result = async () => {
  try {
    const outcome = await flipCoin();
    console.log(outcome);
  } catch (error) {
    console.log(error);
  }
};

result();
