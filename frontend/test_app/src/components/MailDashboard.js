import React, { useState } from "react";
import {
  Card, CardHeader, Box, Button, Table, TableHead, TableRow, TableCell,
  TableBody, Typography, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Select, MenuItem, Snackbar, Alert, Checkbox, Paper
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';

const STATUS_LABELS = {
  unread: "", //세상 촌스러운 아이콘
  read: "",  
};

function MailDashboard({ receiver, mails, onRefresh }) {
  const [newMail, setNewMail] = useState({
    title: "",
    content: "",
    receiver: "",
    type: "notice",
  });
  const [sendAll, setSendAll] = useState(true);
  const [sendStatus, setSendStatus] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // 메일 전송
  const handleSendMail = async (e) => {
    e.preventDefault();
    if (!sendAll && !newMail.receiver) {
      setSendStatus("수신자 이름을 입력하세요.");
      return;
    }
    const payload = {
      ...newMail,
      receiver: sendAll ? "ALL" : newMail.receiver,
      status: "unread",
      type: newMail.type,
    };
    setSendStatus("전송중...");
    const res = await fetch("http://localhost:5000/api/mail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      setSendStatus("전송 완료!");
      setSnackbar({ open: true, message: "메일 전송 완료!", severity: "success" });
      setNewMail({ ...newMail, title: "", content: "", receiver: "", type: "notice" });
      onRefresh();
    } else {
      const err = await res.json();
      setSendStatus("전송 실패: " + (err.error || "오류"));
      setSnackbar({ open: true, message: err.error || "전송 실패", severity: "error" });
    }
    setTimeout(() => setSendStatus(""), 2000);
  };

  const handleRead = async (id) => {
    await fetch(`http://localhost:5000/api/mail/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "read" }),
    });
    onRefresh();
    setSnackbar({ open: true, message: "읽음 처리 완료!", severity: "info" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    await fetch(`http://localhost:5000/api/mail/${id}`, { method: "DELETE" });
    onRefresh();
    setSnackbar({ open: true, message: "메일 삭제 완료!", severity: "info" });
  };

  const getTypeLabel = (type) => (type === "notice" ? "공지" : "일반");

  return (
    <Card sx={{ p: 2, mt: 1 }}>
      <CardHeader title="대시보드" />
      <Paper sx={{ mb: 3, p: 2, bgcolor: "#f7f7fa" }}>
        <form onSubmit={handleSendMail} style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <TextField
            label="제목"
            value={newMail.title}
            required
            onChange={e => setNewMail(m => ({ ...m, title: e.target.value }))}
            sx={{ width: 140 }}
          />
          <TextField
            label="내용"
            value={newMail.content}
            required
            onChange={e => setNewMail(m => ({ ...m, content: e.target.value }))}
            sx={{ width: 200 }}
          />
          <Checkbox
            checked={sendAll}
            onChange={() => setSendAll(v => !v)}
          />
          <Typography sx={{ mr: 2 }}>모든 유저에게</Typography>
          {!sendAll && (
            <TextField
              label="수신자"
              value={newMail.receiver}
              required={!sendAll}
              onChange={e => setNewMail(m => ({ ...m, receiver: e.target.value }))}
              sx={{ width: 130 }}
            />
          )}
          <Select
            value={newMail.type}
            onChange={e => setNewMail(m => ({ ...m, type: e.target.value }))}
            sx={{ width: 90 }}
          >
            <MenuItem value="notice">공지</MenuItem>
            <MenuItem value="normal">일반</MenuItem>
          </Select>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            startIcon={<SendIcon />}
          >전송</Button>
          <span style={{ marginLeft: "10px", color: "#009900" }}>{sendStatus}</span>
        </form>
      </Paper>

      <Box sx={{ overflowX: "auto" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>상태</TableCell>
              <TableCell>구분</TableCell>
              <TableCell>제목</TableCell>
              <TableCell>내용</TableCell>
              <TableCell>수신자</TableCell>
              <TableCell>관리</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(!mails || mails.length === 0) ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  받은 메일이 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              mails.map(mail => (
                <TableRow key={mail.id}
                  sx={mail.status === "unread"
                    ? { bgcolor: "#fffce7" }
                    : { bgcolor: "#f6f6f6" }}>
                  <TableCell align="center" sx={{ fontSize: "1.4em" }}>
                    {STATUS_LABELS[mail.status]}
                  </TableCell>
                  <TableCell>{getTypeLabel(mail.type)}</TableCell>
                  <TableCell>
                    <Typography fontWeight={mail.status === "unread" ? "bold" : "normal"}>
                      {mail.title}
                    </Typography>
                  </TableCell>
                  <TableCell>{mail.content}</TableCell>
                  <TableCell>{mail.receiver === "ALL" ? "전체" : mail.receiver}</TableCell>
                  <TableCell>
                    {mail.status === "unread" && (
                      <Button
                        size="small"
                        color="success"
                        startIcon={<MarkEmailReadIcon />}
                        onClick={() => handleRead(mail.id)}
                        sx={{ mr: 1 }}
                        variant="outlined"
                      >
                        읽음처리
                      </Button>
                    )}
                    <Button
                      size="small"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDelete(mail.id)}
                      variant="outlined"
                    >삭제</Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2000}
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSnackbar(s => ({ ...s, open: false }))} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Card>
  );
}

export default MailDashboard;
