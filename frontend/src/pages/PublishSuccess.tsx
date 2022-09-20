import CustomBox from "@components/atoms/CustomBox";
import CustomCard from "@components/atoms/CustomCard";
import CustomFlexBox from "@components/atoms/CustomFlexBox";
import CustomLink from "@components/atoms/CustomLink";
import NotificationManager from "@components/atoms/NotificationManager";
import { H4, H6, Paragraph } from "@components/atoms/Typography";
import { Button, Container, useTheme } from "@mui/material";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const PublishSuccess = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { palette } = useTheme();
  const { grey } = palette;

  const quizUrl = `${window.location.origin}/quiz/${id}`;

  useEffect(() => {
    if (!id) {
      NotificationManager.error("Invalid quiz id");
      navigate("/");
    }
  }, [id, navigate]);

  return (
    <Container sx={{ my: { xs: "1rem", sm: "2rem" } }}>
      <CustomCard>
        <CustomBox
          sx={{ py: "60px", px: "20px", mx: "auto", maxWidth: "400px" }}
        >
          <CustomBox sx={{ textAlign: "center" }}>
            <H4 mt="20px" fontWeight={600}>
              Thanks for publishing quiz 🎉
            </H4>
            <Paragraph mt="20px" mb="20px">
              You can share this quiz with your friends by copying the link
              below
            </Paragraph>
            <H6 my="16px" color="primary.main" fontWeight={600}>
              {quizUrl}
            </H6>
          </CustomBox>
          <CustomFlexBox
            sx={{
              mt: "24px",
              pt: "20px",
              borderTop: `1px solid ${grey[700]}`,
            }}
          >
            <CustomLink to={`/quiz/${id}`} sx={{ width: "100%" }}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                sx={{ px: 0, ml: "6px", width: "100%" }}
              >
                View Quiz
              </Button>
            </CustomLink>
          </CustomFlexBox>
        </CustomBox>
      </CustomCard>
    </Container>
  );
};

export default PublishSuccess;
