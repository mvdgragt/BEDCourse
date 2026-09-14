const delayedMessage = (message: string, delay: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(message);
    }, delay);
  });
};

const result = async () => {
  try {
    const message = await delayedMessage("hello", 1000);
    console.log(message);
  } catch (error) {
    console.log(error);
  }
};

result();
