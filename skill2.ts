// --- Skill 2: Arrays & Array Methods ---

//Doubling Ages

const ages: number[] = [2, 16, 35, 79, 81, 86];

const agesInFiveYears = ages.map((n) => n + 5);

console.log(ages);
console.log(agesInFiveYears);

//Filtering Names

const names: string[] = [
  "Michiel",
  "Hanna",
  "Emma",
  "Lillie",
  "Nikkie",
  "Quinn",
];

const shortNames = () => names.filter((n) => n.length < 5);

console.log(shortNames());

// Challenge: Combined Transformation

const scores: number[] = [12, 32, 40, 44, 56, 74, 79, 90, 91];

const scoresOver50 = () =>
  scores
    .filter((n) => n > 50)
    .map((n) => {
      if (n <= 60) return "E";
      if (n <= 70) return "D";
      if (n <= 80) return "C";
      if (n <= 90) return "B";
      if (n <= 100) return "A";
    });

console.log(scoresOver50());
// const shortNames = () => names.filter((n) => n.length < 5);
const studentsFailed = () => scores.filter((n) => n < 50);
console.log(studentsFailed().length);
