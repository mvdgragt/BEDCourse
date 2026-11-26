import { Outlet } from "react-router-dom";
import Header from "../components/Header/Header";

const Main = () => {
  return (
    <div>
      <Header />
      <hr />
      <Outlet />
    </div>
  );
};

export default Main;
