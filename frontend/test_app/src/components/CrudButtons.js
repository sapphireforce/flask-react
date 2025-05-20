import { Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function CrudButtons({ onEdit, onDelete }) {
  return (
    <>
      <Button
        startIcon={<EditIcon />}
        onClick={onEdit}
        size="small"
        variant="outlined"
        sx={{ mr: 1 }}
      >수정</Button>
      <Button
        startIcon={<DeleteIcon />}
        onClick={onDelete}
        size="small"
        variant="outlined"
        color="error"
      >삭제</Button>
    </>
  );
}
