import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Paper,
} from "@mui/material";

export default function EntityFormDialog({
  open,
  title,
  onClose,
  onSubmit,
  children,
  submitLabel = "저장",
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: "#1A1A1A",
          border: "2px solid #DA48FE",
          borderRadius: 3,
          boxShadow: "0 0 40px rgba(218, 72, 254, 0.4)",
          color: "#FFFFFF",
        },
      }}
      sx={{
        "& .MuiBackdrop-root": {
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          backdropFilter: "blur(5px)",
        },
      }}
    >
      <DialogTitle
        sx={{
          backgroundColor: "#2A2A2A",
          color: "#DA48FE",
          fontWeight: "bold",
          fontSize: "1.3rem",
          textAlign: "center",
          borderBottom: "2px solid #DA48FE",
          textShadow: "0 0 10px #DA48FE",
        }}
      >
        {title}
      </DialogTitle>
      <DialogContent
        sx={{
          backgroundColor: "#1A1A1A",
          color: "#FFFFFF",
          pt: 3,
          "& .MuiTextField-root": {
            "& .MuiOutlinedInput-root": {
              color: "#FFFFFF",
              "& fieldset": {
                borderColor: "rgba(218, 72, 254, 0.3)",
              },
              "&:hover fieldset": {
                borderColor: "#DA48FE",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#DA48FE",
                boxShadow: "0 0 10px rgba(218, 72, 254, 0.3)",
              },
            },
            "& .MuiInputLabel-root": {
              color: "rgba(255, 255, 255, 0.7)",
              "&.Mui-focused": {
                color: "#DA48FE",
              },
            },
          },
          "& .MuiFormControl-root": {
            "& .MuiOutlinedInput-root": {
              color: "#FFFFFF",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(218, 72, 254, 0.3)",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#DA48FE",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#DA48FE",
                boxShadow: "0 0 10px rgba(218, 72, 254, 0.3)",
              },
            },
            "& .MuiInputLabel-root": {
              color: "rgba(255, 255, 255, 0.7)",
              "&.Mui-focused": {
                color: "#DA48FE",
              },
            },
          },
        }}
      >
        <form id="entity-form" onSubmit={onSubmit}>
          {children}
        </form>
      </DialogContent>
      <DialogActions
        sx={{
          backgroundColor: "#2A2A2A",
          borderTop: "1px solid #DA48FE",
          p: 2,
          gap: 2,
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            color: "#FFFFFF",
            borderColor: "rgba(255, 255, 255, 0.3)",
            "&:hover": {
              borderColor: "#FFFFFF",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            },
          }}
        >
          취소
        </Button>
        <Button
          type="submit"
          form="entity-form"
          variant="contained"
          sx={{
            backgroundColor: "#DA48FE",
            color: "#FFFFFF",
            fontWeight: "bold",
            boxShadow: "0 0 15px rgba(218, 72, 254, 0.4)",
            "&:hover": {
              backgroundColor: "#B03EE6",
              boxShadow: "0 0 25px rgba(218, 72, 254, 0.6)",
              transform: "translateY(-2px)",
            },
            transition: "all 0.3s ease",
          }}
        >
          {submitLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
