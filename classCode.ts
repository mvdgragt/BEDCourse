type displayDataFunction = (data: string) => void;

const deliverPackage = (displayData: any) => {
  console.log("waiting for package...");
  setTimeout(() => {
    const data = "Delivering package after 2 seconds";
    displayData(data);
  }, 2000);
};

const displayData = (data: string) => {
  console.log(data);
};

deliverPackage(displayData);

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

type printResultFunction = (result: number) => void;

const calculate = (a: number, b: number, printResult: printResultFunction) => {
  const result = a + b;
  printResult(result);
};

const printResult = (result: number) => {
  console.log("The result is: ", result);
};
calculate(45, 23, printResult);

type showFileFunction = (fileContent: string) => void;

const downloadFile = (url: string, showFile: showFileFunction) => {
  console.log("Starting download from:", url);
  setTimeout(() => {
    const fileContent = `File data from ${url}`;
    showFile(fileContent);
  }, 4000);
};

const showFile = (fileContent: string) => {
  console.log("Downloaded content:", fileContent);
};

downloadFile("http://example.com/file.txt", showFile);
