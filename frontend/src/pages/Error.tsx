import CustomBox from "@components/atoms/CustomBox";
import CustomImage from "@components/atoms/CustomImage";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";

const Error = () => {
  return (
    <CustomBox
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.paper",
      }}
    >
      <CustomBox sx={{ p: "1rem", maxWidth: 500, textAlign: "center" }}>
        <CustomImage width="100%" src="/assets/404.png" />
        <Link to="/">
          <Button
            fullWidth
            color="primary"
            variant="contained"
            sx={{ mt: "2rem", maxWidth: 225 }}
          >
            Go to Home
          </Button>
        </Link>
      </CustomBox>
    </CustomBox>
  );
};

export default Error;
