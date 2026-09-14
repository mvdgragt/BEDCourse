const myPromise = new Promise((resolve, reject) => {
  const success = true;

  if (success) {
    resolve("Resolved operation successfully!");
  } else {
    reject("Resolved operation rejected!");
  }
});

const result = async () => {
  try {
    const message = await myPromise;
    console.log(message);
  } catch (error) {
    console.log("rejected reason:", error);
  }
};

result();
