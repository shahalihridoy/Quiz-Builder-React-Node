import Loader from "@components/atoms/Loader";
import NotificationManager from "@components/atoms/NotificationManager";
import { useAppDispatch, useAppSelector } from "@hooks/reduxHooks";
import { authActions } from "@redux/auth/authSlice";
import { getCurrentUserDetails } from "@services/authService";
import { getErrorMessage } from "@utils/axiosUtils";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const withAuth = (Component: any) => {
  const ModifiedComponent = (props: any) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const token = localStorage.getItem("token");
    const { user, authenticating } = useAppSelector((state) => state.auth);

    useEffect(() => {
      if (token) {
        if (!user) {
          getCurrentUserDetails()
            .then((user) => {
              dispatch(
                authActions.setState({ authenticating: false, user, token })
              );
            })
            .catch((error) => {
              const message = getErrorMessage(error);
              NotificationManager.error(message);
              localStorage.removeItem("token");
              dispatch(
                authActions.setState({
                  authenticating: false,
                  user: null,
                  token: null,
                })
              );
            });
        }
      } else {
        navigate("/signin");
      }
    }, [dispatch, navigate, token, user]);

    return !authenticating && user ? <Component {...props} /> : <Loader />;
  };

  return ModifiedComponent;
};

export default withAuth;
