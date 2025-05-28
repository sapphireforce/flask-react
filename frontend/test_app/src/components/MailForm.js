import {
  Box,
  TextField,
  Button,
  Checkbox,
  Typography,
  Select,
  MenuItem,
} from "@mui/material";
import { useState } from "react";

export default function MailForm({ onSend }) {
  const [form, setForm] = useState({
    title: "",
    content: "",
    receiver: "",
    type: "notice",
    sendAll: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSend({
      ...form,
      receiver: form.sendAll ? "ALL" : form.receiver,
      status: "unread",
    });
    setForm({ ...form, title: "", content: "", receiver: "" });
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: "flex", gap: 2, alignItems: "center" }}
    >
      <TextField
        label="제목"
        name="title"
        value={form.title}
        onChange={handleChange}
        required
        sx={{ width: 140 }}
      />
      <TextField
        label="내용"
        name="content"
        value={form.content}
        onChange={handleChange}
        required
        sx={{ width: 200 }}
      />
      <Checkbox checked={form.sendAll} name="sendAll" onChange={handleChange} />
      <Typography>모든 유저에게</Typography>
      {!form.sendAll && (
        <TextField
          label="수신자"
          name="receiver"
          value={form.receiver}
          onChange={handleChange}
          sx={{ width: 130 }}
        />
      )}
      <Select
        name="type"
        value={form.type}
        onChange={handleChange}
        sx={{ width: 90 }}
      >
        <MenuItem value="notice">공지</MenuItem>
        <MenuItem value="normal">일반</MenuItem>
      </Select>
      <Button type="submit" variant="contained">
        전송
      </Button>
    </Box>
  );
}
