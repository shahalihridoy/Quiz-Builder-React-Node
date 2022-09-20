import { Paragraph } from "@components/atoms/Typography";
import WarningAmber from "@mui/icons-material/WarningAmber";
import { LoadingButton } from "@mui/lab";
import { Button, Dialog, DialogContent } from "@mui/material";
import { VFC } from "react";

interface AgreementDialogProps {
  text: string;
  open: boolean;
  isLoading?: boolean;
  onAgree?: () => void;
  onDisagree?: () => void;
}

const AgreementDialog: VFC<AgreementDialogProps> = ({
  open,
  text,
  isLoading,
  onAgree,
  onDisagree,
}) => {
  return (
    <Dialog open={open}>
      <DialogContent
        sx={{
          textAlign: "center",
          padding: "2rem 5rem",
        }}
      >
        <WarningAmber
          sx={{
            mt: "10px",
            color: "warning.main",
            fontSize: 90,
          }}
        />
        <Paragraph sx={{ py: "20px", fontSize: 16 }}>{text}</Paragraph>
        <div>
          <Button
            sx={{ mr: "20px" }}
            color="info"
            variant="outlined"
            onClick={onDisagree}
          >
            Cancel
          </Button>
          <LoadingButton
            color="error"
            variant="contained"
            loading={isLoading}
            onClick={onAgree}
          >
            Delete
          </LoadingButton>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AgreementDialog;
