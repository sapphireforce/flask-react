import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

export default function EntityFormDialog({ open, title, onClose, onSubmit, children, submitLabel="저장" }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <form id="entity-form" onSubmit={onSubmit}>
          {children}
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>취소</Button>
        <Button type="submit" form="entity-form" variant="contained" color="primary">
          {submitLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
