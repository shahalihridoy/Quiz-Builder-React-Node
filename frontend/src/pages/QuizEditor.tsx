import CustomFlexBox from "@components/atoms/CustomFlexBox";
import CustomTextField from "@components/atoms/CustomTextField";
import NotificationManager from "@components/atoms/NotificationManager";
import withAuth from "@components/auth/withAuth";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import {
  Alert,
  Button,
  Card,
  Container,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { addQuiz, updateQuiz } from "@services/quizService";
import { Quiz } from "@shared/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getErrorMessage } from "@utils/axiosUtils";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import QuizQuestions from "./QuizQuestions";

const QuizEditor = () => {
  const { id: quizId } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: quiz, isLoading } = useQuery<Quiz>([`/quiz/${quizId}`], {
    enabled: Boolean(quizId),
    retry: false,
  });

  const {
    handleSubmit,
    control,
    reset: resetForm,
    clearErrors,
  } = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: initialValues,
  });

  const { mutate, isLoading: isSubmitting } = useMutation(
    quiz ? updateQuiz : addQuiz,
    {
      onSuccess: (newQuiz) => {
        if (newQuiz.publishId) {
          navigate(`/publish/${newQuiz.publishId}`);
        }
        if (!quizId) {
          resetForm(initialValues);
          setTimeout(() => {
            clearErrors();
          }, 0);
        }
        queryClient.invalidateQueries(["/quiz", `/quiz/${quizId}`]);
        NotificationManager.success("Quiz saved successfully");
      },
      onError: (error) => {
        const message = getErrorMessage(error);
        NotificationManager.error(message);
      },
    }
  );

  const handleFormSubmit = async (values: Quiz) => {
    mutate(values);
  };

  useEffect(() => {
    if (!quiz && !isLoading) {
      NotificationManager.error("Quiz not found");
      navigate("/");
    }
    if (quiz && quizId) {
      resetForm(quiz);
    } else {
      resetForm(initialValues);
    }
  }, [quiz, resetForm, quizId, isLoading, navigate]);

  return (
    <Container sx={{ my: { xs: "1rem", sm: "2rem" } }}>
      {quiz?.publishId && (
        <Alert
          severity="error"
          sx={{ mb: "1rem", textAlign: "center", justifyContent: "center" }}
        >
          You can't update this quiz anymore. Because it is published already.
        </Alert>
      )}
      <Card
        sx={{
          p: {
            xs: "1.25rem",
            md: "1.5rem",
          },
        }}
      >
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <Controller
            name="title"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <CustomTextField
                fullWidth
                label="Quiz Title"
                error={Boolean(error?.message)}
                helperText={error?.message}
                {...field}
                value={field.value ?? ""}
              />
            )}
          />
          <QuizQuestions control={control} />
          <CustomFlexBox
            sx={{
              mt: "1.5rem",
              width: "100%",
              flexWrap: "wrap",
              justifyContent: "space-between",
              "& button": { minWidth: "140px" },
            }}
          >
            <Controller
              name="published"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  label="Publish"
                  sx={{ mb: { xs: "1rem", sm: 0 } }}
                  control={
                    <Switch size="small" {...field} checked={field.value} />
                  }
                />
              )}
            />
            {quiz?.publishId ? (
              <Link to={`/quiz/${quiz.publishId}`}>
                <Button type="button" color="primary" variant="contained">
                  View Quiz
                </Button>
              </Link>
            ) : (
              <LoadingButton
                type="submit"
                color="primary"
                variant="contained"
                loading={isSubmitting}
              >
                Save
              </LoadingButton>
            )}
          </CustomFlexBox>
        </form>
      </Card>
    </Container>
  );
};

const initialValues: Quiz = {
  title: "",
  questions: [],
  published: false,
};

const trimmer = (v: string) => v.trim();

const questionSchema = yup.object().shape({
  question: yup
    .string()
    .transform(trimmer)
    .max(520, "Question must not be more than 520 characters")
    .required("Question is required"),
  options: yup
    .array()
    .of(
      yup.object().shape({
        value: yup
          .string()
          .transform(trimmer)
          .max(520, "Option must not be more than 520 characters")
          .required("Option is required"),
        _id: yup.string().required(),
      })
    )
    .min(1, "Must add at least 1 option")
    .max(5, "Can't add more than 5 options")
    .required("At least one option is required"),
  answers: yup
    .array()
    .of(yup.string().required("Answer is required"))
    .min(1, "Must select at least 1 answer")
    .max(5, "Can't select more than 5 answers")
    .required("At least one answer is required"),
});

const formSchema = yup.object().shape({
  title: yup
    .string()
    .transform(trimmer)
    .max(520, "Title must not be more than 520 characters")
    .required("Quiz title is required"),
  questions: yup
    .array()
    .of(questionSchema)
    .min(1, "Must add at least 1 question")
    .max(10, "Can't add more than 10 questions")
    .required(),
});

export default withAuth(QuizEditor);
