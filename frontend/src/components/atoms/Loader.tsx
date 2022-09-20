import { styled } from "@mui/material";
import React from "react";
import { H5 } from "./Typography";

const StyledLoader = styled("div")(
  ({
    theme: {
      palette: { primary, background },
    },
  }) => ({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    ".loader-wraper": { position: "relative", width: "50px", height: "50px" },
    ".gradient-circle": {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: "300px",
      height: "100%",
      width: "100%",
      background: `linear-gradient(45deg, white, ${primary.light}, ${primary.dark})`,
      WebkitAnimation: "rotation 1000ms infinite linear",
      animation: "rotation 1000ms infinite linear",
    },
    ".white-circle": {
      borderRadius: "300px",
      height: "85%",
      width: "85%",
      background: background.default,
    },
    ".loader-image": {
      position: "absolute",
      width: "50%",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
    },
    "@keyframes rotation": {
      "0%": { WebkitTransform: "rotate(0deg)", transform: "rotate(0deg)" },
      "50%": { WebkitTransform: "rotate(180deg)", transform: "rotate(180deg)" },
      "100%": {
        WebkitTransform: "rotate(360deg)",
        transform: "rotate(360deg)",
      },
    },
  })
);
interface LoaderProps {
  title?: string;
  logo?: boolean;
}

const Loader: React.FC<LoaderProps> = ({ title, logo }) => {
  return (
    <StyledLoader>
      <div className="loader-wraper">
        <div className="gradient-circle">
          <div className="white-circle"></div>
        </div>
        {logo && <img className="loader-image" src="/logo192.png" alt="logo" />}
      </div>

      {title && <H5 mt="0.5rem">{title}</H5>}
    </StyledLoader>
  );
};

export default Loader;
