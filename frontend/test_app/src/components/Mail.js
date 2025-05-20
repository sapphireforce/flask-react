import React, { useState, useEffect } from 'react';
import MailDashboard from './MailDashboard';
import { Box, TextField, Button, Paper, Typography } from '@mui/material';

function Mail() {
  const [receiver, setReceiver] = useState("");
  const [mails, setMails] = useState([]);

  const fetchMails = async () => {
    if (!receiver) return setMails([]);
    const res = await fetch(`http://localhost:5000/api/mailbox/${encodeURIComponent(receiver)}`);
    const data = await res.json();
    setMails(data);
  };

  useEffect(() => { if (receiver) fetchMails(); }, [receiver]);

  return (
    <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>우편함</Typography>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <TextField
          label="수신자(캐릭터 이름)"
          value={receiver}
          onChange={e => setReceiver(e.target.value)}
          size="small"
          sx={{ mr: 2, width: 220 }}
        />
        <Button variant="contained" onClick={fetchMails}>수신함 조회</Button>
      </Box>
      <MailDashboard
        receiver={receiver}
        mails={mails}
        onRefresh={fetchMails}
      />
    </Paper>
  );
}

export default Mail;
