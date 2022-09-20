import Loader from "@components/atoms/Loader";
import AppLayout from "@components/layout/AppLayout";
import { CssBaseline, ThemeProvider } from "@mui/material";
import PublishSuccess from "@pages/PublishSuccess";
import reduxStore from "@redux/reduxStore";
import theme from "@shared/theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { defaultQueryFunction } from "@utils/axiosUtils";
import React, { Suspense } from "react";
import { NotificationContainer } from "react-notifications";
import "react-notifications/lib/notifications.css";
import { Provider } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

const SignIn = React.lazy(() => import("@pages/Signin"));
const SignUp = React.lazy(() => import("@pages/Signup"));
const QuizList = React.lazy(() => import("@pages/QuizList"));
const QuizEditor = React.lazy(() => import("@pages/QuizEditor"));
const QuizViewer = React.lazy(() => import("@pages/QuizViewer"));
const Error = React.lazy(() => import("@pages/Error"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: defaultQueryFunction,
    },
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NotificationContainer />
      <QueryClientProvider client={queryClient}>
        <Provider store={reduxStore}>
          <BrowserRouter>
            <Suspense fallback={<Loader />}>
              <Routes>
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/page-not-found" element={<Error />} />
                <Route path="/quiz/:id" element={<QuizViewer />} />
                <Route path="/" element={<AppLayout />}>
                  <Route path="/edit-quiz/:id" element={<QuizEditor />} />
                  <Route path="/add-quiz" element={<QuizEditor />} />
                  <Route path="/publish/:id" element={<PublishSuccess />} />
                  <Route path="/" element={<QuizList />} />
                </Route>
                <Route path="*" element={<Navigate to="/page-not-found" />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </Provider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
