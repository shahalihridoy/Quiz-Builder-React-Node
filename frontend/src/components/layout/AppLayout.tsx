import CustomBox from "@components/atoms/CustomBox";
import { Outlet } from "react-router-dom";
import Topbar from "./Topbar";

const AppLayout = () => {
  return (
    <CustomBox
      sx={{ height: "100vh", display: "flex", flexDirection: "column" }}
    >
      <Topbar />
      <CustomBox sx={{ flex: "1 1 0", overflow: "auto" }}>
        <Outlet />
      </CustomBox>
    </CustomBox>
  );
};

export default AppLayout;
