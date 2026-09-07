type orderStatusFunction = (message: string) => void;

const orderPizza = (orderStatus: orderStatusFunction) => {
  console.log("Ordering pizza...");
  setTimeout(() => {
    const message = "Your pizza is ready";
    orderStatus(message);
  }, 3000);
};

const orderStatus = (message: string): void => {
  console.log(message);
};

orderPizza(orderStatus);
