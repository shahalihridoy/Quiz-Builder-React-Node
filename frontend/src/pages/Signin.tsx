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
import { login } from "@services/authService";
import { useQueryClient } from "@tanstack/react-query";
import { getErrorMessage } from "@utils/axiosUtils";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";

const SignIn = () => {
  const { palette } = useTheme();
  const { primary, background } = palette;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

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
      const { token, data: user } = await login(email, password);
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

      setTimeout(() => {
        navigate("/");
      }, 0);
    } catch (error: any) {
      console.log(error);
      const message = getErrorMessage(error);
      NotificationManager.error(message);
    }
  };

  return (
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
          src="/assets/signin.png"
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
          <CustomBox sx={{ mb: "24px", textAlign: "center" }}>
            <Link to="/">
              <CustomImage src="/logo192.png" width={60} height={60} />
            </Link>

            <H2 mb="8px" mt="20px" fontSize="20px" fontWeight="600">
              Sign in to Quiz Engine
            </H2>
            <Paragraph color="grey.600">
              New author?
              <CustomLink
                to="/signup"
                sx={{
                  fontWeight: 600,
                  marginLeft: "4px",
                  color: primary.main,
                }}
              >
                Create an account
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
                Sign In
              </LoadingButton>
            </form>
          </CustomBox>
        </Container>
      </Grid>
    </Grid>
  );
};

const initialValues = {
  email: "",
  password: "",
};

const formSchema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required(),
});

export default SignIn;
