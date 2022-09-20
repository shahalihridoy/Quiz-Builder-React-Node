import CustomBox from "@components/atoms/CustomBox";
import CustomCard from "@components/atoms/CustomCard";
import CustomFlexBox from "@components/atoms/CustomFlexBox";
import NotificationManager from "@components/atoms/NotificationManager";
import { H1, H3, H4, H6, Paragraph } from "@components/atoms/Typography";
import { useAppSelector } from "@hooks/reduxHooks";
import { Clear } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Button,
  Card,
  Checkbox,
  CircularProgress,
  Container,
  Dialog,
  Grid,
  IconButton,
  Radio,
} from "@mui/material";
import { getPublishedQuiz, getQuizMarks } from "@services/quizService";
import {
  AnyRecord,
  Question,
  Quiz,
  QuizOption,
  QuizTestResponse,
} from "@shared/types";
import { getErrorMessage } from "@utils/axiosUtils";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const QuizViewer = () => {
  const [quiz, setQuiz] = useState<Quiz>();
  const [result, setResult] = useState<QuizTestResponse>();
  const [isFetching, setIsFetching] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const { id: publishId } = useParams();
  const [answers, setAnswers] = useState<AnyRecord>({});

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleChange =
    (question: Question, option: QuizOption, checked: boolean) => () => {
      const hasMultipleAnswer = question.isMultipleChoice;

      if (hasMultipleAnswer) {
        const newAnswers = { ...answers };
        let selectedOptions = newAnswers[question._id] || [];
        if (checked) {
          selectedOptions.push(option._id);
        } else {
          selectedOptions = selectedOptions.filter(
            (optionId: string) => optionId !== option._id
          );
        }
        newAnswers[question._id] = selectedOptions;
        setAnswers(newAnswers);
      } else {
        setAnswers({
          ...answers,
          [question._id]: [option._id],
        });
      }
    };

  const handleFormSubmit = async () => {
    if (quiz?.questions.length !== Object.keys(answers).length) {
      NotificationManager.error("Please answer all the questions");
      return;
    }
    try {
      setIsSubmitting(true);
      const result = await getQuizMarks(publishId as string, answers);
      setResult(result);
      toggleModal();
    } catch (error) {
      const message = getErrorMessage(error);
      NotificationManager.error(message);
    }
    setIsSubmitting(false);
  };

  useEffect(() => {
    if (publishId) {
      getPublishedQuiz(publishId)
        .then((quiz) => {
          document.title = `Quiz Engine | ${quiz.title}`;
          setQuiz(quiz);
          setIsFetching(false);
        })
        .catch((error) => {
          navigate("/page-not-found");
          setIsFetching(false);
        });
    }
  }, [navigate, publishId]);

  return (
    <Container sx={{ my: { xs: "1rem", sm: "2rem" } }}>
      <Card
        sx={{
          p: {
            xs: "1.25rem",
            md: "1.5rem",
          },
        }}
      >
        {isFetching && !quiz && (
          <CustomFlexBox sx={{ justifyContent: "center", my: "1rem" }}>
            {isFetching ? (
              <CircularProgress size={24} />
            ) : (
              <H4>No quiz found with the id you </H4>
            )}
          </CustomFlexBox>
        )}
        {quiz && (
          <>
            <H3 mb="2rem">{quiz.title}</H3>
            {quiz.questions?.map((question, ind) => (
              <CustomBox sx={{ mb: "1rem" }} key={question._id}>
                <Paragraph fontWeight={600} mb="1rem">
                  {ind + 1}. {question.question}
                </Paragraph>
                <Grid container spacing={2} mb="2rem">
                  {question.options?.map((option, ind) => (
                    <Grid item xs={12} sm={6} key={option._id}>
                      <CustomCard
                        hoverEffect
                        sx={{
                          bgcolor: "grey.100",
                          cursor: "pointer",
                          height: "100%",
                          p: "1rem",
                          display: "flex",
                          alignItems: "center",
                        }}
                        onClick={handleChange(
                          question,
                          option,
                          !answers[question._id]?.includes(option._id)
                        )}
                      >
                        {question.isMultipleChoice ? (
                          <Checkbox
                            sx={{ mr: "0.5rem" }}
                            checked={
                              answers[question._id]?.includes(option._id) ??
                              false
                            }
                          />
                        ) : (
                          <Radio
                            sx={{ mr: "0.5rem" }}
                            checked={
                              answers[question._id]?.includes(option._id) ??
                              false
                            }
                          />
                        )}
                        <Paragraph>{option.value}</Paragraph>
                      </CustomCard>
                    </Grid>
                  ))}
                </Grid>
              </CustomBox>
            ))}

            <CustomFlexBox sx={{ justifyContent: "center" }}>
              {user && (
                <Link to="/">
                  <Button type="button" variant="contained" sx={{ mr: "1rem" }}>
                    Back to Quiz
                  </Button>
                </Link>
              )}
              <LoadingButton
                type="submit"
                color="primary"
                variant="contained"
                sx={{ minWidth: 120 }}
                loading={isSubmitting}
                onClick={handleFormSubmit}
              >
                Submit
              </LoadingButton>
            </CustomFlexBox>
          </>
        )}
      </Card>

      <Dialog open={isModalOpen} onClose={toggleModal}>
        <IconButton
          sx={{ position: "absolute", top: 4, right: 4 }}
          onClick={toggleModal}
        >
          <Clear fontSize="small" />
        </IconButton>
        <CustomBox sx={{ textAlign: "center", p: "3rem" }}>
          <H1 fontSize={32}>🎉</H1>
          <H4 mt="1rem" fontWeight={600}>
            Congratulations
          </H4>
          <H6 mt="1rem" color="primary.main" fontWeight={600}>
            {result?.message}
          </H6>
        </CustomBox>
      </Dialog>
    </Container>
  );
};

export default QuizViewer;
