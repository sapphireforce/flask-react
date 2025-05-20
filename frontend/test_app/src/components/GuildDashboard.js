import React, { useEffect, useState } from 'react';
import {
  Box, Button, Select, MenuItem, TextField, Snackbar, Alert, InputAdornment, IconButton, Chip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import CloseIcon from '@mui/icons-material/Close';

import EntityCardTable from './EntityCardTable';
import EntityFormDialog from './EntityFormDialog';
import CrudButtons from './CrudButtons';
import useSnackbar from './useSnackbar';
import { WORLD_NAMES } from '../constants/enums';

function GuildDashboard() {
  const [guilds, setGuilds] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(false);

  // 검색 상태
  const [search, setSearch] = useState({ name: '', master: '', world: '' });

  // Dialog/폼 상태
  const [openDialog, setOpenDialog] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form, setForm] = useState({
    world_name: WORLD_NAMES[0],
    guild_name: '',
    guild_level: 1,
    guild_fame: 0,
    guild_point: 0,
    guild_master_name: '',
    guild_member_count: 1,
    guild_member: '',
    date: new Date().toISOString().slice(0, 10)
  });
  const [editId, setEditId] = useState(null);

  const [memberAddGuildId, setMemberAddGuildId] = useState(null);
  const [memberAddName, setMemberAddName] = useState('');
  const [memberAddError, setMemberAddError] = useState('');

  const { snackbar, showSnackbar, closeSnackbar } = useSnackbar();

  const fetchGuilds = async () => {
    setLoading(true);
    const res = await fetch('http://localhost:5000/api/guilds');
    const data = await res.json();
    setGuilds(data);
    setLoading(false);
  };
  const fetchCharacters = async () => {
    const res = await fetch('http://localhost:5000/api/characters');
    setCharacters(await res.json());
  };

  useEffect(() => {
    fetchGuilds();
    fetchCharacters();
  }, []);

  const handleOpenDialog = (editRow) => {
    if (editRow) {
      setIsEdit(true);
      setEditId(editRow.id);
      setForm({
        world_name: editRow.world_name,
        guild_name: editRow.guild_name,
        guild_level: editRow.guild_level,
        guild_fame: editRow.guild_fame,
        guild_point: editRow.guild_point,
        guild_master_name: editRow.guild_master_name,
        guild_member_count: editRow.guild_member_count,
        guild_member: (editRow.guild_member || []).join(', '),
        date: editRow.date ? editRow.date.slice(0, 10) : new Date().toISOString().slice(0, 10)
      });
    } else {
      setIsEdit(false);
      setEditId(null);
      setForm({
        world_name: WORLD_NAMES[0],
        guild_name: '',
        guild_level: 1,
        guild_fame: 0,
        guild_point: 0,
        guild_master_name: '',
        guild_member_count: 1,
        guild_member: '',
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
      world_name: WORLD_NAMES[0],
      guild_name: '',
      guild_level: 1,
      guild_fame: 0,
      guild_point: 0,
      guild_master_name: '',
      guild_member_count: 1,
      guild_member: '',
      date: new Date().toISOString().slice(0, 10)
    });
  };

  const handleFormChange = e => {
    const { name, value } = e.target;
    setForm(f => ({
      ...f,
      [name]: name.includes("level") || name.includes("fame") || name.includes("point") || name.includes("count")
        ? Number(value)
        : value
    }));
  };

  // 등록/수정
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      guild_member: form.guild_member.split(',').map(m => m.trim()).filter(Boolean),
    };
    const api = isEdit
      ? `http://localhost:5000/api/guild/${editId}`
      : `http://localhost:5000/api/guild`;
    const method = isEdit ? 'PUT' : 'POST';
    const res = await fetch(api, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      showSnackbar(isEdit ? '수정 완료!' : '등록 완료!');
      fetchGuilds();
      handleCloseDialog();
    } else {
      const err = await res.json();
      showSnackbar(err.error || "처리 실패", "error");
    }
  };

  // 삭제
  const handleDelete = async (id) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    await fetch(`http://localhost:5000/api/guild/${id}`, { method: "DELETE" });
    showSnackbar("삭제 완료", "info");
    fetchGuilds();
  };

  // 길드원 추가
  const handleAddMemberOpen = async (guildId) => {
  await fetchCharacters();
  setMemberAddGuildId(guildId);
  setMemberAddName('');
  setMemberAddError('');
};
  const handleAddMember = async () => {
    if (!memberAddName) return setMemberAddError("길드원 이름을 입력하세요.");
    const char = characters.find(c => c.character_name === memberAddName);
    if (!char) return setMemberAddError("존재하지 않는 캐릭터입니다.");
    const res = await fetch(`http://localhost:5000/api/guild/${memberAddGuildId}/add_member`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ character_name: memberAddName })
    });
    if (res.ok) {
      showSnackbar("추가 완료!", "success");
      setMemberAddGuildId(null);
      setMemberAddName('');
      fetchGuilds();
    } else {
      const err = await res.json();
      setMemberAddError(err.error || "추가 실패");
    }
  };

  const handleRemoveMember = async (guild, memberName) => {
    if (!window.confirm(`정말 ${memberName}을(를) 삭제하시겠습니까?`)) return;
    const updated = {
      ...guild,
      guild_member: (guild.guild_member || []).filter(m => m !== memberName),
      guild_member_count: (guild.guild_member_count || 1) - 1
    };
    await fetch(`http://localhost:5000/api/guild/${guild.id}`, {
      method: "PUT",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...updated,
        guild_member: updated.guild_member
      })
    });
    showSnackbar("길드원 삭제 완료", "info");
    fetchGuilds();
  };

  const filteredGuilds = guilds.filter(g =>
    (!search.name || g.guild_name.includes(search.name)) &&
    (!search.master || g.guild_master_name.includes(search.master)) &&
    (!search.world || g.world_name === search.world)
  );

  const columns = [
    { field: "guild_name", headerName: "길드명" },
    { field: "world_name", headerName: "월드" },
    { field: "guild_level", headerName: "길드 레벨" },
    { field: "guild_fame", headerName: "명성" },
    { field: "guild_point", headerName: "포인트" },
    { field: "guild_master_name", headerName: "길드장" },
    { field: "guild_member_count", headerName: "멤버수" },
    {
      field: "guild_member",
      headerName: "멤버 목록",
      renderCell: (row) => (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
          {(row.guild_member || []).map(name => (
            <Chip
              key={name}
              label={name}
              onDelete={() => handleRemoveMember(row, name)}
              size="small"
              sx={{ m: "2px" }}
            />
          ))}
        </Box>
      )
    },
    { field: "date", headerName: "날짜", renderCell: (row) => row.date && row.date.slice(0, 10) },
    {
      field: "actions",
      headerName: "관리",
      renderCell: (row) => (
        <Box>
          <CrudButtons
            onEdit={() => handleOpenDialog(row)}
            onDelete={() => handleDelete(row.id)}
          />
          <Button
            startIcon={<PersonAddAltIcon />}
            onClick={() => handleAddMemberOpen(row.id)}
            size="small"
            sx={{ ml: 1, mt: 0.5 }}
            variant="outlined"
          >
            멤버추가
          </Button>
        </Box>
      )
    }
  ];

  const actions = (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      <TextField
        label="길드명 검색"
        value={search.name}
        onChange={e => setSearch(s => ({ ...s, name: e.target.value }))}
        InputProps={{
          endAdornment: search.name &&
            <InputAdornment position="end">
              <IconButton onClick={() => setSearch(s => ({ ...s, name: '' }))}><CloseIcon /></IconButton>
            </InputAdornment>
        }}
        size="small"
        sx={{ width: 120 }}
      />
      <TextField
        label="길드장"
        value={search.master}
        onChange={e => setSearch(s => ({ ...s, master: e.target.value }))}
        InputProps={{
          endAdornment: search.master &&
            <InputAdornment position="end">
              <IconButton onClick={() => setSearch(s => ({ ...s, master: '' }))}><CloseIcon /></IconButton>
            </InputAdornment>
        }}
        size="small"
        sx={{ width: 120 }}
      />
      <Select
        value={search.world}
        onChange={e => setSearch(s => ({ ...s, world: e.target.value }))}
        displayEmpty
        size="small"
        sx={{ width: 120 }}
      >
        <MenuItem value="">전체 월드</MenuItem>
        {WORLD_NAMES.map(opt => (
          <MenuItem key={opt} value={opt}>{opt}</MenuItem>
        ))}
      </Select>
      <Button
        startIcon={<AddIcon />}
        onClick={() => handleOpenDialog()}
        variant="contained"
        color="primary"
      >
        길드 등록
      </Button>
      <Button
        startIcon={<RefreshIcon />}
        onClick={fetchGuilds}
        variant="outlined"
      >
        새로고침
      </Button>
    </Box>
  );

  return (
    <>
      <EntityCardTable
        title="길드 대시보드"
        columns={columns}
        rows={filteredGuilds}
        actions={actions}
        loading={loading}
      />

      {/* 등록/수정 Dialog */}
      <EntityFormDialog
        open={openDialog}
        title={isEdit ? "길드 수정" : "길드 등록"}
        onClose={handleCloseDialog}
        onSubmit={handleSubmit}
        submitLabel={isEdit ? "저장" : "등록"}
      >
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
        <TextField
          label="길드명"
          name="guild_name"
          value={form.guild_name}
          onChange={handleFormChange}
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        <TextField
          label="길드 레벨"
          name="guild_level"
          type="number"
          value={form.guild_level}
          onChange={handleFormChange}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="명성"
          name="guild_fame"
          type="number"
          value={form.guild_fame}
          onChange={handleFormChange}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="포인트"
          name="guild_point"
          type="number"
          value={form.guild_point}
          onChange={handleFormChange}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="길드장"
          name="guild_master_name"
          value={form.guild_master_name}
          onChange={handleFormChange}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="멤버 수"
          name="guild_member_count"
          type="number"
          value={form.guild_member_count}
          onChange={handleFormChange}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="멤버(쉼표로 구분)"
          name="guild_member"
          value={form.guild_member}
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

      {memberAddGuildId && (
        <EntityFormDialog
          open={!!memberAddGuildId}
          title="길드원 추가"
          onClose={() => setMemberAddGuildId(null)}
          onSubmit={e => {
            e.preventDefault();
            handleAddMember();
          }}
          submitLabel="추가"
        >
          <Select
            value={memberAddName}
            onChange={e => setMemberAddName(e.target.value)}
            fullWidth
            required
            sx={{ mb: 2 }}
            displayEmpty
          >
            <MenuItem value="">캐릭터 선택</MenuItem>
            {characters.map(c => (
              <MenuItem key={c.id} value={c.character_name}>
                {c.character_name} (Lv.{c.character_level}, {c.world_name})
              </MenuItem>
            ))}
          </Select>
          {memberAddError && <Alert severity="error">{memberAddError}</Alert>}
        </EntityFormDialog>
      )}

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

export default GuildDashboard;
