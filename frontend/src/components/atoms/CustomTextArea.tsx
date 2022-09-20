import { TextFieldProps } from "@mui/material";
import { styled } from "@mui/material/styles";

const CustomTextArea = styled("textarea")<TextFieldProps>(({ theme }) => ({
  width: "100%",
  borderRadius: "8px",
  background: theme.palette.grey[100],
}));

export default CustomTextArea;
