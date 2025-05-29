import React, { useEffect, useState } from "react";
import useCharacter from "../hooks/useCharacter";
import CharacterTable from "../components/CharacterTable";
import CharacterForm from "../components/CharacterForm";
import CrudButtons from "../components/CrudButtons";
import { Box, Button, Snackbar, Alert } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import { WORLD_NAMES, GENDERS, CLASSES } from "../constants/enums";

export default function CharacterDashboard() {
  const {
    characters,
    fetchCharacters,
    createCharacter,
    updateCharacter,
    deleteCharacter,
  } = useCharacter();
  const [openDialog, setOpenDialog] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form, setForm] = useState({
    character_name: "",
    world_name: WORLD_NAMES[0],
    character_gender: GENDERS[0],
    character_class: CLASSES[0],
    character_class_level: 1,
    character_level: 1,
    character_exp: 0,
    character_exp_rate: 0,
    character_guild_name: "",
    character_image: "",
    date: new Date().toISOString().slice(0, 10),
  });
  const [editId, setEditId] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    fetchCharacters();
  }, [fetchCharacters]);

  const handleOpenDialog = (editRow) => {
    if (editRow) {
      setIsEdit(true);
      setEditId(editRow.id);
      setForm({
        character_name: editRow.character_name,
        world_name: editRow.world_name,
        character_gender: editRow.character_gender,
        character_class: editRow.character_class,
        character_class_level: editRow.character_class_level,
        character_level: editRow.character_level,
        character_exp: editRow.character_exp,
        character_exp_rate: editRow.character_exp_rate,
        character_guild_name: editRow.character_guild_name,
        character_image: editRow.character_image,
        date: editRow.date
          ? editRow.date.slice(0, 10)
          : new Date().toISOString().slice(0, 10),
      });
    } else {
      setIsEdit(false);
      setEditId(null);
      setForm({
        character_name: "",
        world_name: WORLD_NAMES[0],
        character_gender: GENDERS[0],
        character_class: CLASSES[0],
        character_class_level: 1,
        character_level: 1,
        character_exp: 0,
        character_exp_rate: 0,
        character_guild_name: "",
        character_image: "",
        date: new Date().toISOString().slice(0, 10),
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setIsEdit(false);
    setEditId(null);
    setForm({
      character_name: "",
      world_name: WORLD_NAMES[0],
      character_gender: GENDERS[0],
      character_class: CLASSES[0],
      character_class_level: 1,
      character_level: 1,
      character_exp: 0,
      character_exp_rate: 0,
      character_guild_name: "",
      character_image: "",
      date: new Date().toISOString().slice(0, 10),
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({
      ...f,
      [name]:
        name.includes("level") || name.includes("exp") ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await updateCharacter(editId, form);
        setSnackbar({ open: true, message: "수정 완료!", severity: "success" });
      } else {
        await createCharacter(form);
        setSnackbar({ open: true, message: "등록 완료!", severity: "success" });
      }
      fetchCharacters();
      handleCloseDialog();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || "처리 실패",
        severity: "error",
      });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    await deleteCharacter(id);
    setSnackbar({ open: true, message: "삭제 완료", severity: "info" });
    fetchCharacters();
  };

  const columns = [
    {
      field: "character_image",
      headerName: "이미지",
      renderCell: (row) => (
        <img
          src={row.character_image}
          alt={row.character_name}
          style={{
            width: 56,
            height: 56,
            objectFit: "cover",
            borderRadius: "8px",
          }}
          onError={(e) => (e.target.style.display = "none")}
        />
      ),
    },
    { field: "character_name", headerName: "이름" },
    { field: "world_name", headerName: "월드" },
    { field: "character_gender", headerName: "성별" },
    { field: "character_class", headerName: "직업" },
    { field: "character_class_level", headerName: "클래스 레벨" },
    { field: "character_level", headerName: "캐릭터 레벨" },
    { field: "character_exp", headerName: "경험치" },
    { field: "character_exp_rate", headerName: "경험치율(%)" },
    { field: "character_guild_name", headerName: "길드명" },
    {
      field: "date",
      headerName: "날짜",
      renderCell: (row) => row.date && row.date.slice(0, 10),
    },
    {
      field: "actions",
      headerName: "관리",
      renderCell: (row) => (
        <CrudButtons
          onEdit={() => handleOpenDialog(row)}
          onDelete={() => handleDelete(row.id)}
        />
      ),
    },
  ];

  const actions = (
    <Box>
      <Button
        startIcon={<AddIcon />}
        onClick={() => handleOpenDialog()}
        variant="contained"
        sx={{
          mr: 1,
          backgroundColor: "#DA48FE",
          color: "#FFFFFF",
          fontWeight: "bold",
          "&:hover": {
            backgroundColor: "#B03EE6",
            boxShadow: "0 0 20px rgba(218, 72, 254, 0.6)",
            transform: "translateY(-2px)",
          },
          transition: "all 0.3s ease",
        }}
      >
        캐릭터 등록
      </Button>
      <Button
        startIcon={<RefreshIcon />}
        onClick={fetchCharacters}
        variant="outlined"
        sx={{
          color: "#FFFFFF",
          borderColor: "#DA48FE",
          "&:hover": {
            borderColor: "#DA48FE",
            backgroundColor: "rgba(218, 72, 254, 0.1)",
            transform: "translateY(-2px)",
          },
          transition: "all 0.3s ease",
        }}
      >
        새로고침
      </Button>
    </Box>
  );

  return (
    <>
      <CharacterTable
        columns={columns}
        rows={characters}
        actions={actions}
        loading={false}
      />
      <CharacterForm
        open={openDialog}
        isEdit={isEdit}
        form={form}
        onChange={handleFormChange}
        onClose={handleCloseDialog}
        onSubmit={handleSubmit}
      />
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </>
  );
}
