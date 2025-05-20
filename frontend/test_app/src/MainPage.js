import React, { useState } from 'react';
import Character from './components/Character';
import GuildDashboard from './components/GuildDashboard';
import RankingDashboard from './components/RankingDashboard';
import Mail from './components/Mail';
import { Button } from '@mui/material';
import MailOutlineIcon from '@mui/icons-material/MailOutline';

function MainPage() {
  const [showMail, setShowMail] = useState(false);

  return (
    <div style={{ padding: "2rem" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <Button
          variant={showMail ? "contained" : "outlined"}
          color="primary"
          startIcon={<MailOutlineIcon />}
          onClick={() => setShowMail(!showMail)}
          sx={{
            fontWeight: 700,
            borderRadius: 2,
            px: 3,
            py: 1,
            boxShadow: showMail ? 2 : 0,
            letterSpacing: 1
          }}
        >
          {showMail ? '우편함 닫기' : '우편함 열기'}
        </Button>
      </div>

      {showMail && (
        <div style={{ marginBottom: "2rem" }}>
          <Mail />
        </div>
      )}

      <div style={{ marginBottom: "4rem" }}>
        <h2>캐릭터 대시보드</h2>
        <Character />
      </div>
      <div style={{ marginBottom: "4rem" }}>
        <h2>길드 대시보드</h2>
        <GuildDashboard />
      </div>
      <div style={{ marginBottom: "4rem" }}>
        <h2>랭킹 대시보드</h2>
        <RankingDashboard />
      </div>
    </div>
  );
}

export default MainPage;
