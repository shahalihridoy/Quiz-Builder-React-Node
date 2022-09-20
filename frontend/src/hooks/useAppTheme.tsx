import { useTheme } from "@mui/material";
import { AppTheme } from "@shared/theme";

const useAppTheme = () => {
  const theme = useTheme<AppTheme>();
  return theme;
};

export default useAppTheme;
