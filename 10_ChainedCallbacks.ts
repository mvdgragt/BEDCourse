type StepDone = (result: string) => void;

const chainedCallback1 = (onDone: StepDone) => {
  setTimeout(() => {
    onDone("step 1 done");
    chainedCallback2(onDone);
  }, 1000);
};

const chainedCallback2 = (onDone: StepDone) => {
  setTimeout(() => {
    onDone("step 2 done");
    chainedCallback3(onDone);
  }, 1000);
};

const chainedCallback3 = (onDone: StepDone) => {
  setTimeout(() => {
    onDone("step 3 done");
  }, 1000);
};

const logStep: StepDone = (result) => {
  console.log(result);
};

chainedCallback1(logStep);
