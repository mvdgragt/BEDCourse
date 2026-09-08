// --- A Different Advice Slip ---

type AdviceSlipType = {
  slip: {
    id: number;
    advice: string;
  };
};

const fetchAdviceAndLog = (id: number): void => {
  fetch(`https://api.adviceslip.com/advice/${id}`)
    .then((response: Response) => {
      if (!response.ok) {
        throw new Error("Fetching did not work");
      }
      return response.json();
    })
    .then((data: AdviceSlipType) => {
      const advice = data.slip.advice;
      console.log(`Advice ID ${id}: ${advice}`);
    })
    .catch((error: unknown) => {
      console.log(`Error fetching advice for ID ${id}:`, error);
    });
};

// Loop over an array of chosen IDs
const ids = [5, 42, 100];
ids.forEach((id) => fetchAdviceAndLog(id));

// -- Handling a Bad Request ---

const fetchAdviceAndLog2 = (id: number): void => {
  fetch(`https://api.adviceslip.com/advice/${id}`)
    .then((response: Response) => {
      if (!response.ok) {
        console.log(`Response not ok for ID ${id}`);
        throw new Error("Fetching did not work");
      }
      return response.json();
    })
    .then((data: AdviceSlipType) => {
      const advice = data.slip.advice;
      console.log(`Advice ID ${id}: ${advice}`);
    })
    .catch((error: unknown) => {
      console.log(`Error fetching advice for ID ${id}:`, error);
    });
};

// Includes an invalid ID to trigger the error
const ids2 = [5, 42, 99999999];
ids2.forEach((id) => fetchAdviceAndLog2(id));

// --- Challenge (optional): A Second API Type

type CatFactType = {
  fact: string;
  length: number;
};

const fetchCatFact = (): void => {
  fetch("https://catfact.ninja/fact")
    .then((response: Response) => {
      if (!response.ok) {
        console.log("Response not ok");
        throw new Error("Fetching cat fact did not work");
      }
      return response.json();
    })
    .then((data: CatFactType) => {
      console.log(`Cat fact: ${data.fact}`);
    })
    .catch((error: unknown) => {
      console.log("Error fetching cat fact:", error);
    });
};

fetchCatFact();
