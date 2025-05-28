import React, { useState } from "react";
import CharacterDashboard from "./containers/CharacterDashboard";
import GuildDashboard from "./containers/GuildDashboard";
import RankingDashboard from "./containers/RankingDashboard";
import MailDashboard from "./containers/MailDashboard";
import {
  Button,
  Tabs,
  Tab,
  Box,
  Typography,
  Paper,
  Dialog,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import GroupIcon from "@mui/icons-material/Group";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

function TabPanel({ children, value, index }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function MainPage() {
  const [showMail, setShowMail] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#1A1A1A",
        padding: "2rem",
        maxWidth: "1400px",
        margin: "0 auto",
      }}
    >
      {/* 헤더 섹션 */}
      <Box
        sx={{
          mb: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontWeight: "bold",
            color: "#FFFFFF",
            textShadow: "0 0 20px #DA48FE",
            fontSize: { xs: "2rem", md: "3rem" },
            background: "linear-gradient(135deg, #DA48FE 0%, #B03EE6 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            ml: { xs: 0, md: 2 },
          }}
        >
          🍁 메이플스토리 관리 시스템
        </Typography>
        <Button
          variant={showMail ? "contained" : "outlined"}
          onClick={() => setShowMail(true)}
          sx={{
            fontWeight: 700,
            borderRadius: 3,
            px: 4,
            py: 1.5,
            fontSize: "1.1rem",
            backgroundColor: showMail ? "#DA48FE" : "transparent",
            color: showMail ? "#FFFFFF" : "#DA48FE",
            borderColor: "#DA48FE",
            boxShadow: showMail ? "0 0 20px rgba(218, 72, 254, 0.5)" : 0,
            letterSpacing: 1,
            "&:hover": {
              backgroundColor: showMail ? "#B03EE6" : "rgba(218, 72, 254, 0.1)",
              transform: "translateY(-2px)",
              boxShadow: "0 0 25px rgba(218, 72, 254, 0.6)",
              borderColor: "#DA48FE",
            },
            transition: "all 0.3s ease",
            mr: { xs: 0, md: 2 },
          }}
        >
          {"우편함"}
        </Button>
      </Box>

      {/* 우편함 모달 */}
      <Dialog
        open={showMail}
        onClose={() => setShowMail(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: "#1A1A1A",
            border: "2px solid #DA48FE",
            borderRadius: 3,
            boxShadow: "0 0 40px rgba(218, 72, 254, 0.4)",
            color: "#FFFFFF",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "#2A2A2A",
            borderBottom: "2px solid #DA48FE",
            p: 2,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              color: "#DA48FE",
              textAlign: "center",
              textShadow: "0 0 10px #DA48FE",
            }}
          >
            우편함
          </Typography>
          <Button
            onClick={() => setShowMail(false)}
            sx={{ color: "#DA48FE", fontWeight: "bold" }}
          >
            닫기
          </Button>
        </Box>
        <Box sx={{ p: 3 }}>
          <MailDashboard />
        </Box>
      </Dialog>

      {/* 탭 네비게이션 */}
      <Paper
        elevation={10}
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          background: "#2A2A2A",
          border: "1px solid #DA48FE",
          boxShadow: "0 0 30px rgba(218, 72, 254, 0.3)",
        }}
      >
        <Box sx={{ borderBottom: "2px solid #DA48FE" }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="메인 대시보드 탭"
            variant="fullWidth"
            sx={{
              background: "#1A1A1A",
              "& .MuiTab-root": {
                fontWeight: 700,
                fontSize: "1.1rem",
                textTransform: "none",
                minHeight: "70px",
                color: "#FFFFFF",
                "&:hover": {
                  color: "#DA48FE",
                  backgroundColor: "rgba(218, 72, 254, 0.1)",
                  transform: "translateY(-2px)",
                },
                transition: "all 0.3s ease",
              },
              "& .Mui-selected": {
                color: "#DA48FE !important",
                backgroundColor: "rgba(218, 72, 254, 0.2)",
                boxShadow: "0 0 15px rgba(218, 72, 254, 0.4)",
              },
              "& .MuiTabs-indicator": {
                backgroundColor: "#DA48FE",
                height: "4px",
                boxShadow: "0 0 10px #DA48FE",
              },
            }}
          >
            <Tab
              icon={<PersonIcon sx={{ fontSize: "1.5rem" }} />}
              label="캐릭터"
              iconPosition="start"
            />
            <Tab
              icon={<GroupIcon sx={{ fontSize: "1.5rem" }} />}
              label="길드"
              iconPosition="start"
            />
            <Tab
              icon={<EmojiEventsIcon sx={{ fontSize: "1.5rem" }} />}
              label="랭킹"
              iconPosition="start"
            />
          </Tabs>
        </Box>

        {/* 탭 컨텐츠 */}
        <TabPanel value={tabValue} index={0}>
          <CharacterDashboard />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <GuildDashboard />
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <RankingDashboard />
        </TabPanel>
      </Paper>
    </div>
  );
}

export default MainPage;
