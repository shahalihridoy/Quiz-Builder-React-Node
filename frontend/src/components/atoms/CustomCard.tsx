import { Card } from "@mui/material";
import { styled } from "@mui/material/styles";

type CustomProps = {
  hoverEffect?: boolean;
};

const CustomCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== "hoverEffect",
})<CustomProps>(({ theme, hoverEffect }) => ({
  borderRadius: "8px",
  overflow: "unset",
  transition: "all 250ms ease-in-out",
  "&:hover": {
    boxShadow: hoverEffect ? theme.shadows[2] : "",
  },
}));

CustomCard.defaultProps = {
  hoverEffect: false,
};

export default CustomCard;
