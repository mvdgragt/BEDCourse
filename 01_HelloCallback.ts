type HelloFunction = (message: string) => void;

const deliverMessage = (callback: HelloFunction) => {
  const message = "Hello from callback!";
  callback(message);
};

const helloFunction = (message: string) => {
  console.log(message);
};

deliverMessage(helloFunction);
