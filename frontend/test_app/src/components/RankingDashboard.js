import React, { useEffect, useState } from 'react';
import {
  Box, Button, Select, MenuItem, TextField, Snackbar, Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';

import EntityCardTable from './EntityCardTable';
import EntityFormDialog from './EntityFormDialog';
import CrudButtons from './CrudButtons';
import useSnackbar from './useSnackbar';

function RankingDashboard() {
  const [ranking, setRanking] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(false);

  const [openDialog, setOpenDialog] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form, setForm] = useState({ character_id: '', rank_type: 'total' });
  const [editId, setEditId] = useState(null);

  const { snackbar, showSnackbar, closeSnackbar } = useSnackbar();

  const fetchRanking = async () => {
    setLoading(true);
    const res = await fetch('http://localhost:5000/api/rankings');
    setRanking(await res.json());
    setLoading(false);
  };
  const fetchCharacters = async () => {
    const res = await fetch('http://localhost:5000/api/characters');
    setCharacters(await res.json());
  };

  useEffect(() => {
    fetchRanking();
    fetchCharacters();
  }, []);

  // 폼 값 변경
  const handleFormChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleOpenDialog = (editRow) => {
    fetchCharacters().then(() => {
      if (editRow) {
        setIsEdit(true);
        setEditId(editRow.id);
        setForm({
          character_id: editRow.character_id,
          rank_type: editRow.rank_type,
          character_level: editRow.character_level,
          character_exp: editRow.character_exp,
        });
      } else {
        setIsEdit(false);
        setEditId(null);
        setForm({ character_id: characters[0]?.id || '', rank_type: 'total' });
      }
      setOpenDialog(true);
    });
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setForm({ character_id: '', rank_type: 'total' });
    setIsEdit(false);
    setEditId(null);
  };

  // 등록/수정
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.character_id) return;
    const api = isEdit
      ? `http://localhost:5000/api/ranking/${editId}`
      : `http://localhost:5000/api/ranking`;
    const method = isEdit ? 'PUT' : 'POST';
    const res = await fetch(api, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    if (res.ok) {
      showSnackbar(isEdit ? '수정 완료!' : '등록 완료!');
      fetchRanking();
      handleCloseDialog();
    } else {
      const err = await res.json();
      showSnackbar(err.error || "처리 실패", "error");
    }
  };

  // 삭제
  const handleDelete = async (id) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    await fetch(`http://localhost:5000/api/ranking/${id}`, { method: "DELETE" });
    showSnackbar("삭제 완료", "info");
    fetchRanking();
  };

  const columns = [
    { field: "idx", headerName: "순위", renderCell: (_, idx) => idx + 1 },
    { field: "character_name", headerName: "이름" },
    { field: "character_level", headerName: "레벨" },
    { field: "character_class", headerName: "클래스" },
    { field: "world_name", headerName: "월드" },
    { field: "character_exp", headerName: "경험치" },
    { field: "character_guild_name", headerName: "길드명" },
    { field: "rank_type", headerName: "랭킹타입" },
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
        랭킹 등록
      </Button>
      <Button
        startIcon={<RefreshIcon />}
        onClick={fetchRanking}
        variant="outlined"
      >
        새로고침
      </Button>
    </Box>
  );

  return (
    <>
      <EntityCardTable
        title="캐릭터 랭킹"
        columns={columns}
        rows={ranking}
        actions={actions}
        loading={loading}
      />

      <EntityFormDialog
        open={openDialog}
        title={isEdit ? "랭킹 수정" : "랭킹 등록"}
        onClose={handleCloseDialog}
        onSubmit={handleSubmit}
        submitLabel={isEdit ? "저장" : "등록"}
      >
        <Select
          name="character_id"
          label="캐릭터"
          value={form.character_id}
          onChange={handleFormChange}
          fullWidth
          sx={{ mb: 2 }}
          disabled={isEdit}
          required
        >
          {characters.map(c => (
            <MenuItem key={c.id} value={c.id}>
              {c.character_name} (Lv.{c.character_level}, {c.world_name})
            </MenuItem>
          ))}
        </Select>
        <Select
          name="rank_type"
          label="랭킹 타입"
          value={form.rank_type}
          onChange={handleFormChange}
          fullWidth
          sx={{ mb: 2 }}
        >
          <MenuItem value="total">전체 랭킹</MenuItem>
          <MenuItem value="world">월드별</MenuItem>
        </Select>
        {isEdit && (
          <>
            <TextField
              label="레벨"
              name="character_level"
              value={form.character_level}
              onChange={handleFormChange}
              fullWidth
              type="number"
              sx={{ mb: 2 }}
            />
            <TextField
              label="경험치"
              name="character_exp"
              value={form.character_exp}
              onChange={handleFormChange}
              fullWidth
              type="number"
              sx={{ mb: 2 }}
            />
          </>
        )}
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

export default RankingDashboard;
