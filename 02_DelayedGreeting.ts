type SayHello = (message: string) => void;

const sayHelloLater = (sayHello: SayHello) => {
  setTimeout(() => {
    const message = "Hi, I am late!";
    sayHello(message);
  }, 2000);
};

const sayHello = (message: string) => {
  console.log(message);
};

sayHelloLater(sayHello);
