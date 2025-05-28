import React, { useState } from "react";
import useMail from "../hooks/useMail";
import MailTable from "../components/MailTable";
import MailForm from "../components/MailForm";
import { Box, Snackbar, Alert, TextField, Button } from "@mui/material";

export default function MailDashboard() {
  const { mails, fetchMails, sendMail, updateMailStatus, deleteMail } =
    useMail();
  const [receiver, setReceiver] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleFetch = () => {
    fetchMails(receiver).catch(() =>
      setSnackbar({ open: true, message: "조회 실패", severity: "error" })
    );
  };

  const handleSend = async (payload) => {
    try {
      await sendMail(payload);
      setSnackbar({
        open: true,
        message: "메일 전송 완료!",
        severity: "success",
      });
      fetchMails(receiver);
    } catch {
      setSnackbar({ open: true, message: "전송 실패", severity: "error" });
    }
  };

  const handleRead = async (id, status) => {
    await updateMailStatus(id, status);
    fetchMails(receiver);
    setSnackbar({ open: true, message: "읽음 처리 완료!", severity: "info" });
  };

  const handleDelete = async (id) => {
    await deleteMail(id);
    fetchMails(receiver);
    setSnackbar({ open: true, message: "메일 삭제 완료!", severity: "info" });
  };

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 2 }}>
        <TextField
          label="수신자(캐릭터 이름)"
          value={receiver}
          onChange={(e) => setReceiver(e.target.value)}
          size="small"
          sx={{ width: 220 }}
        />
        <Button variant="contained" onClick={handleFetch}>
          수신함 조회
        </Button>
      </Box>
      <MailForm onSend={handleSend} />
      <MailTable mails={mails} onRead={handleRead} onDelete={handleDelete} />
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}
