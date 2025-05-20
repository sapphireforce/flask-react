import React, { useState } from 'react';
import { Box, Button, Select, MenuItem, TextField, Snackbar, Alert } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import EntityCardTable from './EntityCardTable';
import EntityFormDialog from './EntityFormDialog';
import CrudButtons from './CrudButtons';
import useSnackbar from './useSnackbar'; //hooks
import { WORLD_NAMES, GENDERS, CLASSES } from '../constants/enums';

function CharacterDashboard({ characters, onRefresh }) {
  const [openDialog, setOpenDialog] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form, setForm] = useState({
    character_name: '',
    world_name: WORLD_NAMES[0],
    character_gender: GENDERS[0],
    character_class: CLASSES[0],
    character_class_level: 1,
    character_level: 1,
    character_exp: 0,
    character_exp_rate: 0,
    character_guild_name: '',
    character_image: '',
    date: new Date().toISOString().slice(0, 10)
  });
  const [editId, setEditId] = useState(null);

  const { snackbar, showSnackbar, closeSnackbar } = useSnackbar();

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
        date: editRow.date ? editRow.date.slice(0, 10) : new Date().toISOString().slice(0, 10)
      });
    } 
    else {
      setIsEdit(false);
      setEditId(null);
      setForm({
        character_name: '',
        world_name: WORLD_NAMES[0],
        character_gender: GENDERS[0],
        character_class: CLASSES[0],
        character_class_level: 1,
        character_level: 1,
        character_exp: 0,
        character_exp_rate: 0,
        character_guild_name: '',
        character_image: '',
        date: new Date().toISOString().slice(0, 10)
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setIsEdit(false);
    setEditId(null);
    setForm({
      character_name: '',
      world_name: WORLD_NAMES[0],
      character_gender: GENDERS[0],
      character_class: CLASSES[0],
      character_class_level: 1,
      character_level: 1,
      character_exp: 0,
      character_exp_rate: 0,
      character_guild_name: '',
      character_image: '',
      date: new Date().toISOString().slice(0, 10)
    });
  };

  const handleFormChange = e => {
    const { name, value } = e.target;
    setForm(f => ({
      ...f,
      [name]: name.includes("level") || name.includes("exp") ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const api = isEdit
      ? `http://localhost:5000/api/character/${editId}`
      : `http://localhost:5000/api/character`;
    const method = isEdit ? 'PUT' : 'POST';
    const res = await fetch(api, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    if (res.ok) {
      showSnackbar(isEdit ? '수정 완료!' : '등록 완료!');
      onRefresh();
      handleCloseDialog();
    } else {
      const err = await res.json();
      showSnackbar(err.error || "처리 실패", "error");
    }
  };

  // 삭제
  const handleDelete = async (id) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    await fetch(`http://localhost:5000/api/character/${id}`, { method: "DELETE" });
    showSnackbar("삭제 완료", "info");
    onRefresh();
  };

  const columns = [
    {
      field: "character_image",
      headerName: "이미지",
      renderCell: (row) => (
        <img
          src={row.character_image}
          alt={row.character_name}
          style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: '8px' }}
          onError={e => (e.target.style.display = 'none')}
        />
      )
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
    { field: "date", headerName: "날짜", renderCell: (row) => row.date && row.date.slice(0, 10) },
    {
      field: "actions",
      headerName: "관리",
      renderCell: (row) => (
        <CrudButtons
          onEdit={() => handleOpenDialog(row)}
          onDelete={() => handleDelete(row.id)}
        />
      )
    }
  ];

  const actions = (
    <Box>
      <Button
        startIcon={<AddIcon />}
        onClick={() => handleOpenDialog()}
        variant="contained"
        color="primary"
        sx={{ mr: 1 }}
      >
        캐릭터 등록
      </Button>
      <Button
        startIcon={<RefreshIcon />}
        onClick={onRefresh}
        variant="outlined"
      >
        새로고침
      </Button>
    </Box>
  );

  return (
    <>
      <EntityCardTable
        title="캐릭터 대시보드"
        columns={columns}
        rows={characters}
        actions={actions}
        loading={false}
      />

      <EntityFormDialog
        open={openDialog}
        title={isEdit ? "캐릭터 수정" : "캐릭터 등록"}
        onClose={handleCloseDialog}
        onSubmit={handleSubmit}
        submitLabel={isEdit ? "저장" : "등록"}
      >
        <TextField
          label="이름"
          name="character_name"
          value={form.character_name}
          onChange={handleFormChange}
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        <Select
          name="world_name"
          label="월드"
          value={form.world_name}
          onChange={handleFormChange}
          fullWidth
          sx={{ mb: 2 }}
        >
          {WORLD_NAMES.map(opt => (
            <MenuItem key={opt} value={opt}>{opt}</MenuItem>
          ))}
        </Select>
        <Select
          name="character_gender"
          label="성별"
          value={form.character_gender}
          onChange={handleFormChange}
          fullWidth
          sx={{ mb: 2 }}
        >
          {GENDERS.map(opt => (
            <MenuItem key={opt} value={opt}>{opt}</MenuItem>
          ))}
        </Select>
        <Select
          name="character_class"
          label="직업"
          value={form.character_class}
          onChange={handleFormChange}
          fullWidth
          sx={{ mb: 2 }}
        >
          {CLASSES.map(opt => (
            <MenuItem key={opt} value={opt}>{opt}</MenuItem>
          ))}
        </Select>
        <TextField
          label="클래스 레벨"
          name="character_class_level"
          type="number"
          value={form.character_class_level}
          onChange={handleFormChange}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="캐릭터 레벨"
          name="character_level"
          type="number"
          value={form.character_level}
          onChange={handleFormChange}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="경험치"
          name="character_exp"
          type="number"
          value={form.character_exp}
          onChange={handleFormChange}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="경험치율(%)"
          name="character_exp_rate"
          type="number"
          value={form.character_exp_rate}
          onChange={handleFormChange}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="길드명"
          name="character_guild_name"
          value={form.character_guild_name}
          onChange={handleFormChange}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="이미지 URL"
          name="character_image"
          value={form.character_image}
          onChange={handleFormChange}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="날짜"
          name="date"
          type="date"
          value={form.date}
          onChange={handleFormChange}
          fullWidth
          sx={{ mb: 2 }}
          InputLabelProps={{ shrink: true }}
        />
      </EntityFormDialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={2000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={closeSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default CharacterDashboard;
