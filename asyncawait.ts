const myPromise = new Promise((resolve, reject) => {
  console.log("1. This executor function starts immediately!");
  const success = true;

  if (success) {
    console.log("2. Operation was successful!");
    resolve("Resolved operation successfully!");
  } else {
    console.log("2. Operation failed!");
    reject("Resolved operation rejected!");
  }
  console.log("3. executor function has finished");
});

myPromise
  .then((message) => {
    console.log(message);
  })
  .catch((error) => {
    console.log(error);
  });

/*
type AdviceSlipType = {
  slip: {
    id: number;
    advice: string;
  };
};

const fetchAdviceById = (id: number): void => {
  const data = fetch(`https://api.adviceslip.com/advice/${id}`)
    //console.log(data);
    .then((response: Response) => {
      // console.log(response);
      if (!response.ok) {
        throw new Error("Fetching did not work");
      }
      return response.json();
      // console.log(response.ok)
    })
    .then((data: AdviceSlipType) => {
      // console.log(data.slip.advice);
      const advice = data.slip.advice;
      console.log(`Advice ID: ${id}: ${advice}`);
    })
    .catch((error: unknown) => {
      console.log("Error fetching advice:", error);
    });
};

fetchAdviceById(11);
*/
