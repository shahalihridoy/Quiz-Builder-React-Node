import { TextField, TextFieldProps } from "@mui/material";
import { styled } from "@mui/material/styles";

const CustomTextField = styled(TextField)<TextFieldProps>(({ theme }) => ({
  "& .MuiInputLabel-root": {
    position: "relative",
    transform: "none",
    marginBottom: "0.5rem",
    fontWeight: "600",
    color: theme.palette.text.primary,
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: theme.palette.primary.main,
  },
  "& .MuiOutlinedInput-input": {
    position: "relative",
    transform: "none",
    height: "1.5rem",
    paddingTop: "0.5rem",
    paddingBottom: "0.5rem",
  },
  "& .MuiSelect-select.MuiSelect-outlined": {
    display: "inline-flex",
    alignItems: "center",
    height: "1.5rem",
    paddingTop: "0.5rem",
    paddingBottom: "0.5rem",
  },
  "& .MuiOutlinedInput-notchedOutline legend": {
    width: 0,
  },
  "& fieldset": {
    borderColor: "transparent",
  },
}));

export default CustomTextField;
