import CustomBox from "@components/atoms/CustomBox";
import CustomFlexBox from "@components/atoms/CustomFlexBox";
import CustomTextField from "@components/atoms/CustomTextField";
import { H6 } from "@components/atoms/Typography";
import useAppTheme from "@hooks/useAppTheme";
import { Delete } from "@mui/icons-material";
import { Button, FormHelperText, IconButton, Tooltip } from "@mui/material";
import { Quiz } from "@shared/types";
import { FC } from "react";
import {
  Control,
  Controller,
  useController,
  useFieldArray,
} from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import QuestionOptions from "./QuestionOptions";

interface QuizQuestionsProps {
  control: Control<Quiz, any>;
}

const QuizQuestions: FC<QuizQuestionsProps> = ({ control }) => {
  const { palette } = useAppTheme();

  const {
    fieldState: { error: questionError },
  } = useController({
    name: "questions",
    control,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  return (
    <div>
      <CustomFlexBox
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
          mt: "1.5rem",
        }}
      >
        <H6 fontWeight={600}>Questions</H6>
        {fields?.length > 0 && (
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={() => remove(fields.map((_, index) => index))}
          >
            Clear All Questions
          </Button>
        )}
      </CustomFlexBox>
      {fields.map((field, index) => (
        <CustomBox
          sx={{
            p: "1.25rem",
            mt: "1.25rem",
            position: "relative",
            width: "100%",
            height: "100%",
            border: "1px solid",
            borderColor: palette.divider,
            borderRadius: "6px",
          }}
          key={field.id}
        >
          <Controller
            name={`questions.${index}.question` as const}
            control={control}
            render={({ field, fieldState: { error } }) => (
              <CustomTextField
                fullWidth
                label={`Question - ${index + 1}`}
                minRows={2}
                multiline
                error={Boolean(error?.message)}
                helperText={error?.message}
                {...field}
              />
            )}
          />
          <Tooltip title="Remove question" placement="top">
            <IconButton
              sx={{
                position: "absolute",
                right: "1rem",
                top: "1rem",
                zIndex: 11,
              }}
              onClick={() => remove(index)}
            >
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
          <QuestionOptions control={control} questionIndex={index} />
        </CustomBox>
      ))}
      <Button
        type="button"
        variant="outlined"
        color="primary"
        size="small"
        sx={{ mt: "1.25rem" }}
        disabled={fields?.length >= 10}
        onClick={() =>
          append({
            _id: uuidv4(),
            answers: [],
            options: [],
            question: "",
          })
        }
      >
        Add Question
      </Button>
      {Boolean(questionError?.message) && fields.length === 0 && (
        <FormHelperText error sx={{ mt: "0.25rem" }}>
          {questionError?.message}
        </FormHelperText>
      )}
    </div>
  );
};

export default QuizQuestions;
