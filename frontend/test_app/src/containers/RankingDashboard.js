import React, { useEffect, useState } from "react";
import useRanking from "../hooks/useRanking";
import useCharacter from "../hooks/useCharacter";
import RankingTable from "../components/RankingTable";
import RankingForm from "../components/RankingForm";
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

export default function RankingDashboard() {
  const {
    rankings,
    fetchRankings,
    createRanking,
    updateRanking,
    deleteRanking,
  } = useRanking();
  const { characters, fetchCharacters } = useCharacter();
  const [openDialog, setOpenDialog] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form, setForm] = useState({
    character_id: "",
    rank_type: "total",
    character_level: "",
    character_exp: "",
    date: "",
  });
  const [editId, setEditId] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [rankTypeFilter, setRankTypeFilter] = useState("total");

  useEffect(() => {
    fetchRankings(rankTypeFilter);
    fetchCharacters();
  }, [fetchRankings, fetchCharacters, rankTypeFilter]);

  const handleOpenDialog = (editRow) => {
    if (editRow) {
      setIsEdit(true);
      setEditId(editRow.id);
      setForm({
        character_id: editRow.character_id,
        rank_type: editRow.rank_type,
        character_level: editRow.character_level,
        character_exp: editRow.character_exp,
        date: editRow.date ? editRow.date.split("T")[0] : "",
      });
    } else {
      setIsEdit(false);
      setEditId(null);
      setForm({
        character_id: "",
        rank_type: "total",
        character_level: "",
        character_exp: "",
        date: "",
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setIsEdit(false);
    setEditId(null);
    setForm({
      character_id: "",
      rank_type: "total",
      character_level: "",
      character_exp: "",
      date: "",
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({
      ...f,
      [name]:
        name.includes("level") || name.includes("exp") || name.includes("id")
          ? value === ""
            ? ""
            : Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = { ...form };

      // 빈 문자열을 제거하고 필요한 데이터만 전송
      Object.keys(formData).forEach((key) => {
        if (formData[key] === "") {
          delete formData[key];
        }
      });

      if (isEdit) {
        await updateRanking(editId, formData);
        setSnackbar({ open: true, message: "수정 완료!", severity: "success" });
      } else {
        await createRanking(formData);
        setSnackbar({ open: true, message: "등록 완료!", severity: "success" });
      }
      fetchRankings(rankTypeFilter);
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
    try {
      await deleteRanking(id);
      setSnackbar({ open: true, message: "삭제 완료", severity: "info" });
      fetchRankings(rankTypeFilter);
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || "삭제 실패",
        severity: "error",
      });
    }
  };

  const handleRankTypeFilterChange = (e) => {
    setRankTypeFilter(e.target.value);
  };

  const columns = [
    {
      field: "rank",
      headerName: "순위",
      renderCell: (row, index) => index + 1,
    },
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
      ),
    },
  ];

  const actions = (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel sx={{ color: "#FFFFFF" }}>랭킹 타입</InputLabel>
        <Select
          value={rankTypeFilter}
          onChange={handleRankTypeFilterChange}
          label="랭킹 타입"
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
          <MenuItem value="total">전체</MenuItem>
          <MenuItem value="level">레벨</MenuItem>
          <MenuItem value="exp">경험치</MenuItem>
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
        랭킹 등록
      </Button>
      <Button
        startIcon={<RefreshIcon />}
        onClick={() => fetchRankings(rankTypeFilter)}
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
      <RankingTable
        columns={columns}
        rows={rankings}
        actions={actions}
        loading={false}
      />
      <RankingForm
        open={openDialog}
        isEdit={isEdit}
        form={form}
        onChange={handleFormChange}
        onClose={handleCloseDialog}
        onSubmit={handleSubmit}
        characterList={characters}
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
