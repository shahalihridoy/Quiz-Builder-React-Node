import { Typography, TypographyProps } from "@mui/material";

export const H1: React.FC<TypographyProps> = ({ ...props }) => (
  <Typography variant="h1" fontSize="30px" fontWeight={600} {...props} />
);

export const H2: React.FC<TypographyProps> = ({ ...props }) => (
  <Typography variant="h2" fontSize="25px" fontWeight={600} {...props} />
);

export const H3: React.FC<TypographyProps> = ({ ...props }) => (
  <Typography variant="h3" fontSize="20px" fontWeight={600} {...props} />
);

export const H4: React.FC<TypographyProps> = ({ ...props }) => (
  <Typography variant="h4" fontSize="18px" fontWeight={500} {...props} />
);

export const H5: React.FC<TypographyProps> = ({ ...props }) => (
  <Typography variant="h5" fontSize="16px" fontWeight={500} {...props} />
);

export const H6: React.FC<TypographyProps> = ({ ...props }) => (
  <Typography variant="h6" fontSize="14px" fontWeight={500} {...props} />
);

export const Paragraph: React.FC<TypographyProps> = ({ ...props }) => (
  <Typography variant="body1" fontSize="14px" {...props} />
);

export const Span: React.FC<TypographyProps> = ({ ...props }) => (
  <Typography variant="body1" component="span" fontSize="14px" {...props} />
);

export const Small: React.FC<TypographyProps> = ({ ...props }) => (
  <Typography variant="body1" component="span" fontSize="12px" {...props} />
);
