type ToUppercase = (result: string) => void;

const uppercase = (message: string, callback: ToUppercase) => {
  const result = message.toUpperCase();
  callback(result);
};

const toUppercase = (result: string) => {
  console.log(result);
};

uppercase("hello world", toUppercase);
