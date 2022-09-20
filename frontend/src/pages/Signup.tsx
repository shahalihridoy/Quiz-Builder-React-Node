import CustomBox from "@components/atoms/CustomBox";
import CustomImage from "@components/atoms/CustomImage";
import CustomLink from "@components/atoms/CustomLink";
import CustomTextField from "@components/atoms/CustomTextField";
import NotificationManager from "@components/atoms/NotificationManager";
import { H2, Paragraph } from "@components/atoms/Typography";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAppDispatch } from "@hooks/reduxHooks";
import { LoadingButton } from "@mui/lab";
import { useTheme } from "@mui/material";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { authActions } from "@redux/auth/authSlice";
import { signup } from "@services/authService";
import { useQueryClient } from "@tanstack/react-query";
import { getErrorMessage } from "@utils/axiosUtils";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";

const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const { palette } = useTheme();
  const { primary, background } = palette;

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: initialValues,
  });

  const handleFormSubmit = async ({
    email,
    password,
  }: typeof initialValues) => {
    try {
      const { token, data: user } = await signup(email, password);
      localStorage.setItem("token", token);
      queryClient.clear();
      queryClient.resetQueries();

      await dispatch(
        authActions.setState({
          authenticating: false,
          user,
          token,
        })
      );
      navigate("/");
    } catch (error: any) {
      let message = getErrorMessage(error);
      if (message.includes("Duplicate")) {
        message = "Email already exists";
      } else if (message.includes("password")) {
        message = "Password must be at least 6 characters";
      }
      NotificationManager.error(message);
    }
  };

  return (
    <div>
      <Grid container height="100vh">
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: background.default,
          }}
        >
          <CustomImage
            width={848}
            height={562}
            src="/assets/signup.png"
            sx={{ p: "2rem 10%", objectFit: "contain", maxWidth: "100%" }}
          />
        </Grid>

        <Grid item xs={12} md={6} sx={{ bgcolor: "background.paper" }}>
          <Container
            maxWidth="sm"
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: { xs: "1rem", sm: "2rem" },
            }}
          >
            <CustomBox>
              <CustomBox sx={{ mb: "24px", textAlign: "center" }}>
                <Link to="/">
                  <CustomImage src="/logo192.png" width={60} height={60} />
                </Link>

                <H2 mb="8px" mt="20px" fontSize="20px" fontWeight="600">
                  Create an Account
                </H2>
                <Paragraph color="grey.600">
                  Already have an account?
                  <CustomLink
                    to="/signin"
                    sx={{
                      fontWeight: 600,
                      marginLeft: "4px",
                      color: primary.main,
                    }}
                  >
                    Sign in here
                  </CustomLink>
                </Paragraph>
              </CustomBox>

              <CustomBox sx={{ maxWidth: 370 }}>
                <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <CustomTextField
                        fullWidth
                        label="Email"
                        type="email"
                        sx={{ mb: "24px" }}
                        {...field}
                        error={Boolean(error?.message)}
                        helperText={error?.message}
                      />
                    )}
                  />
                  <Controller
                    name="password"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <CustomTextField
                        fullWidth
                        label="Password"
                        type="password"
                        sx={{ mb: "24px" }}
                        {...field}
                        error={Boolean(error?.message)}
                        helperText={error?.message}
                      />
                    )}
                  />

                  <LoadingButton
                    fullWidth
                    type="submit"
                    color="primary"
                    variant="contained"
                    sx={{ my: "12px" }}
                    loading={isSubmitting}
                  >
                    Sign Up
                  </LoadingButton>
                </form>
              </CustomBox>
            </CustomBox>
          </Container>
        </Grid>
      </Grid>
    </div>
  );
};

const initialValues = {
  email: "",
  password: "",
};

const formSchema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(6).max(128).required(),
});

export default SignUp;
