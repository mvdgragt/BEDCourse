type Message = (message: string) => void;

const multipleMessages = (callback: Message) => {
  callback("I am message 1");
  callback("I am message 2");
  callback("I am message 3");
};

const message = (message: string) => {
  console.log(message);
};

multipleMessages(message);
