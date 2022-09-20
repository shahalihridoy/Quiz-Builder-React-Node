import CustomFlexBox from "@components/atoms/CustomFlexBox";
import CustomImage from "@components/atoms/CustomImage";
import CustomLink from "@components/atoms/CustomLink";
import CustomMenu from "@components/atoms/CustomMenu";
import { useAppDispatch } from "@hooks/reduxHooks";
import {
  AppBar,
  Avatar,
  Button,
  Container,
  MenuItem,
  Toolbar,
} from "@mui/material";
import { authActions } from "@redux/auth/authSlice";
import { useNavigate } from "react-router-dom";

const Topbar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    localStorage.removeItem("token");
    await dispatch(authActions.setState({ user: null, token: null }));
    navigate("/signin");
  };

  return (
    <AppBar
      position="relative"
      color="inherit"
      elevation={1}
      sx={{ borderRadius: 0 }}
    >
      <Toolbar sx={{ px: "0 !important" }}>
        <Container sx={{ display: "flex", justifyContent: "space-between" }}>
          <CustomLink to="/" sx={{ display: "flex", alignItems: "center" }}>
            <CustomImage width={32} height={32} src="/logo192.png" />
          </CustomLink>
          <CustomFlexBox
            sx={{
              "& .active button": {
                bgcolor: "grey.100",
              },
            }}
          >
            <CustomLink to="/" sx={{ mr: "0.5rem" }}>
              <Button variant="text" color="inherit">
                Quiz List
              </Button>
            </CustomLink>
            <CustomLink to="/add-quiz">
              <Button variant="text" color="inherit">
                Add Quiz
              </Button>
            </CustomLink>
          </CustomFlexBox>
          <CustomMenu
            style={{ marginTop: "0.5rem" }}
            handler={<Avatar sx={{ cursor: "pointer" }} />}
          >
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </CustomMenu>
        </Container>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
