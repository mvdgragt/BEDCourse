type Success = () => void;
type NoSuccess = () => void;

const randomSuccess = (success: Success, nosuccess: NoSuccess) => {
  Math.random() < 0.5 ? success() : nosuccess();
};

const success = () => {
  console.log("This is a success!");
};

const nosuccess = () => {
  console.log("This is an error!");
};

randomSuccess(success, nosuccess);
