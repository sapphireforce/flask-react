import { Button, IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function CrudButtons({ onEdit, onDelete }) {
  return (
    <>
      <Tooltip title="수정" arrow>
        <IconButton
          onClick={onEdit}
          size="small"
          sx={{
            color: "#DA48FE",
            backgroundColor: "rgba(218, 72, 254, 0.1)",
            border: "1px solid rgba(218, 72, 254, 0.3)",
            mr: 1,
            "&:hover": {
              backgroundColor: "rgba(218, 72, 254, 0.2)",
              transform: "scale(1.1)",
              boxShadow: "0 0 15px rgba(218, 72, 254, 0.5)",
              borderColor: "#DA48FE",
            },
            transition: "all 0.2s ease",
          }}
        >
          <EditIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Tooltip title="삭제" arrow>
        <IconButton
          onClick={onDelete}
          size="small"
          sx={{
            color: "#FF4757",
            backgroundColor: "rgba(255, 71, 87, 0.1)",
            border: "1px solid rgba(255, 71, 87, 0.3)",
            "&:hover": {
              backgroundColor: "rgba(255, 71, 87, 0.2)",
              transform: "scale(1.1)",
              boxShadow: "0 0 15px rgba(255, 71, 87, 0.5)",
              borderColor: "#FF4757",
            },
            transition: "all 0.2s ease",
          }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </>
  );
}
