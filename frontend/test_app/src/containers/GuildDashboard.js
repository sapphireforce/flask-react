import React, { useEffect, useState } from "react";
import useGuild from "../hooks/useGuild";
import GuildTable from "../components/GuildTable";
import GuildForm from "../components/GuildForm";
import CrudButtons from "../components/CrudButtons";
import {
  Box,
  Button,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import { WORLD_NAMES } from "../constants/enums";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import useCharacter from "../hooks/useCharacter";

export default function GuildDashboard() {
  const {
    guilds,
    fetchGuilds,
    createGuild,
    updateGuild,
    deleteGuild,
    addGuildMember,
  } = useGuild();
  const { characters, fetchCharacters } = useCharacter();
  const [openDialog, setOpenDialog] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form, setForm] = useState({
    world_name: WORLD_NAMES[0],
    guild_name: "",
    guild_level: 1,
    guild_fame: 0,
    guild_point: 0,
    guild_master_name: "",
    guild_member_count: 1,
    guild_member: "",
  });
  const [editId, setEditId] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [addMemberDialog, setAddMemberDialog] = useState({
    open: false,
    guildId: null,
    guildMembers: [],
  });
  const [memberName, setMemberName] = useState("");
  const [worldFilter, setWorldFilter] = useState("전체");

  useEffect(() => {
    fetchGuilds();
    fetchCharacters();
  }, [fetchGuilds, fetchCharacters]);

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
        guild_member: Array.isArray(editRow.guild_member)
          ? editRow.guild_member.join(", ")
          : editRow.guild_member || "",
      });
    } else {
      setIsEdit(false);
      setEditId(null);
      setForm({
        world_name: WORLD_NAMES[0],
        guild_name: "",
        guild_level: 1,
        guild_fame: 0,
        guild_point: 0,
        guild_master_name: "",
        guild_member_count: 1,
        guild_member: "",
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
      guild_name: "",
      guild_level: 1,
      guild_fame: 0,
      guild_point: 0,
      guild_master_name: "",
      guild_member_count: 1,
      guild_member: "",
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({
      ...f,
      [name]:
        name.includes("level") ||
        name.includes("fame") ||
        name.includes("point") ||
        name.includes("count")
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = {
        ...form,
        guild_member: Array.isArray(form.guild_member)
          ? form.guild_member
          : form.guild_member
          ? form.guild_member
              .split(",")
              .map((name) => name.trim())
              .filter(Boolean)
          : [],
      };

      if (isEdit) {
        await updateGuild(editId, formData);
        setSnackbar({ open: true, message: "수정 완료!", severity: "success" });
      } else {
        await createGuild(formData);
        setSnackbar({ open: true, message: "등록 완료!", severity: "success" });
      }
      fetchGuilds();
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
    await deleteGuild(id);
    setSnackbar({ open: true, message: "삭제 완료", severity: "info" });
    fetchGuilds();
  };

  const handleOpenAddMember = (guildId) => {
    const guild = guilds.find((g) => g.id === guildId);
    setAddMemberDialog({
      open: true,
      guildId,
      guildMembers: guild ? guild.guild_member : [],
    });
    setMemberName("");
  };

  const handleCloseAddMember = () => {
    setAddMemberDialog({ open: false, guildId: null, guildMembers: [] });
    setMemberName("");
  };

  const handleAddMember = async () => {
    if (!memberName.trim()) return;
    try {
      await addGuildMember(addMemberDialog.guildId, memberName.trim());
      setSnackbar({
        open: true,
        message: "멤버 추가 완료!",
        severity: "success",
      });
      fetchGuilds();
      handleCloseAddMember();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || "멤버 추가 실패",
        severity: "error",
      });
    }
  };

  const handleWorldFilterChange = (e) => {
    setWorldFilter(e.target.value);
  };

  // 월드 필터링된 길드 목록
  const filteredGuilds =
    worldFilter === "전체"
      ? guilds
      : guilds.filter((guild) => guild.world_name === worldFilter);

  const selectableCharacters = characters.filter(
    (c) => !addMemberDialog.guildMembers.includes(c.character_name)
  );

  const columns = [
    { field: "world_name", headerName: "월드" },
    { field: "guild_name", headerName: "길드명" },
    { field: "guild_master_name", headerName: "길드장" },
    { field: "guild_level", headerName: "레벨" },
    { field: "guild_fame", headerName: "명성" },
    { field: "guild_point", headerName: "포인트" },
    { field: "guild_member_count", headerName: "멤버 수" },
    {
      field: "guild_member",
      headerName: "멤버",
      renderCell: (row) =>
        row.guild_member ? row.guild_member.join(", ") : "",
    },
    {
      field: "actions",
      headerName: "관리",
      renderCell: (row) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <CrudButtons
            onEdit={() => handleOpenDialog(row)}
            onDelete={() => handleDelete(row.id)}
          />
          <Button
            size="small"
            variant="outlined"
            sx={{
              color: "#DA48FE",
              borderColor: "#DA48FE",
              minWidth: 0,
              px: 1,
            }}
            onClick={() => handleOpenAddMember(row.id)}
          >
            멤버추가
          </Button>
        </Box>
      ),
    },
  ];

  const actions = (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel sx={{ color: "#FFFFFF" }}>월드</InputLabel>
        <Select
          value={worldFilter}
          onChange={handleWorldFilterChange}
          label="월드"
          size="small"
          sx={{
            color: "#FFFFFF",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#DA48FE",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#DA48FE",
            },
            "& .MuiSvgIcon-root": {
              color: "#FFFFFF",
            },
          }}
        >
          <MenuItem value="전체">전체</MenuItem>
          {WORLD_NAMES.map((world) => (
            <MenuItem key={world} value={world}>
              {world}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button
        startIcon={<AddIcon />}
        onClick={() => handleOpenDialog()}
        variant="contained"
        sx={{
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
        길드 등록
      </Button>
      <Button
        startIcon={<RefreshIcon />}
        onClick={fetchGuilds}
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
      <GuildTable
        columns={columns}
        rows={filteredGuilds}
        actions={actions}
        loading={false}
      />
      <GuildForm
        open={openDialog}
        isEdit={isEdit}
        form={form}
        onChange={handleFormChange}
        onClose={handleCloseDialog}
        onSubmit={handleSubmit}
        characterList={characters}
      />
      <Dialog open={addMemberDialog.open} onClose={handleCloseAddMember}>
        <DialogTitle>길드 멤버 추가</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 1 }}>
            <InputLabel>캐릭터</InputLabel>
            <Select
              value={memberName}
              label="캐릭터"
              onChange={(e) => setMemberName(e.target.value)}
            >
              {selectableCharacters.map((c) => (
                <MenuItem key={c.character_name} value={c.character_name}>
                  {c.character_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddMember}>취소</Button>
          <Button
            onClick={handleAddMember}
            variant="contained"
            sx={{ backgroundColor: "#DA48FE", color: "#fff" }}
            disabled={!memberName}
          >
            추가
          </Button>
        </DialogActions>
      </Dialog>
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
