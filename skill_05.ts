const fetchAdvice = async (id: number) => {
  try {
    const response = await fetch(`https://api.adviceslip.com/advice/${id}`);
    if (!response.ok) {
      throw new Error("Fetching did not work");
    }
    const data = await response.json();
    console.log(`Advice ID: ${id}: ${data.slip.advice}`);
  } catch (error) {
    console.log("Error fetching advice:", error);
  }
};

fetchAdvice(1);
