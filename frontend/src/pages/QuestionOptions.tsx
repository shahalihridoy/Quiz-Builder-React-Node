import CustomFlexBox from "@components/atoms/CustomFlexBox";
import CustomTextField from "@components/atoms/CustomTextField";
import { Delete } from "@mui/icons-material";
import {
  Button,
  Checkbox,
  FormHelperText,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Quiz } from "@shared/types";
import { FC, useCallback } from "react";
import {
  Control,
  Controller,
  ControllerRenderProps,
  useController,
  useFieldArray,
} from "react-hook-form";
import { v4 as uuidv4 } from "uuid";

interface QuestionOptionsProps {
  control: Control<Quiz, any>;
  questionIndex: number;
}

const QuestionOptions: FC<QuestionOptionsProps> = ({
  control,
  questionIndex,
}) => {
  const {
    field: answerField,
    fieldState: { error: answerError },
  } = useController({
    name: `questions.${questionIndex}.answers`,
    control,
  });

  const {
    fieldState: { error: optionError },
  } = useController({
    name: `questions.${questionIndex}.options`,
    control,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: `questions.${questionIndex}.options`,
  });

  const handleAnswerChange = useCallback(
    (
        field: ControllerRenderProps<Quiz, `questions.${number}.answers`>,
        _id: string
      ) =>
      (_e: any, checked: boolean) => {
        if (checked) {
          field.onChange(field.value.concat(_id));
        } else {
          field.onChange(field.value.filter((id) => id !== _id));
        }
      },
    []
  );

  return (
    <>
      {fields.map((arrayField, optionIndex) => (
        <CustomFlexBox
          sx={{
            alignItems: "start",
            mt: "1rem",
          }}
          key={arrayField.id}
        >
          <Controller
            name={`questions.${questionIndex}.answers`}
            control={control}
            render={({ field }) => (
              <Tooltip
                title="Mark as correct answer"
                placement="top"
                componentsProps={{
                  tooltip: {
                    sx: {
                      fontSize: 13,
                    },
                  },
                }}
              >
                <Checkbox
                  color="primary"
                  size="small"
                  {...field}
                  checked={field.value.includes(arrayField._id)}
                  onChange={handleAnswerChange(field, arrayField._id)}
                />
              </Tooltip>
            )}
          />

          <Controller
            name={
              `questions.${questionIndex}.options.${optionIndex}.value` as const
            }
            control={control}
            render={({ field, fieldState: { error } }) => (
              <CustomTextField
                fullWidth
                sx={{ mx: "0.5rem" }}
                error={Boolean(error?.message)}
                helperText={error?.message}
                {...field}
              />
            )}
          />
          <Tooltip title="Remove option" placement="top">
            <IconButton
              onClick={() => {
                remove(optionIndex);
                answerField.onChange(
                  answerField.value.filter((id) => id !== arrayField._id)
                );
              }}
            >
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
        </CustomFlexBox>
      ))}
      <CustomFlexBox
        sx={{
          mt: "1rem",
          justifyContent: "space-between",
        }}
      >
        <Button
          type="button"
          variant="outlined"
          color="primary"
          size="small"
          disabled={fields?.length >= 5}
          onClick={() => append({ _id: uuidv4(), value: "" })}
        >
          Add Option
        </Button>
        {fields.length > 0 && (
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={() => {
              answerField.onChange([]);
              remove(fields.map((_, index) => index));
            }}
          >
            Clear All Options
          </Button>
        )}
      </CustomFlexBox>

      {Boolean(optionError?.message) && fields.length === 0 && (
        <FormHelperText error sx={{ mt: "0.25rem" }}>
          {optionError?.message}
        </FormHelperText>
      )}
      {Boolean(answerError?.message) && (
        <FormHelperText error sx={{ mt: "0.25rem" }}>
          {answerError?.message}
        </FormHelperText>
      )}
    </>
  );
};

export default QuestionOptions;
