import React, { useState, useEffect } from 'react';
import GuildForm from './GuildForm';
import Guild from './Guild';

function Guilds() {
  const [guilds, setGuilds] = useState([]);

  const fetchGuilds = async () => {
    const res = await fetch('http://localhost:5000/api/guilds');
    const data = await res.json();
    setGuilds(data);
  };

  useEffect(() => {
    fetchGuilds();
  }, []);

  const handleCreate = async (guildData) => {
    const res = await fetch('http://localhost:5000/api/guild', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(guildData)
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "생성 실패");
    } else {
      alert("생성 완료!");
      fetchGuilds();
    }
  };

  return (
    <div>
      <h2>길드 관리</h2>
      <GuildForm onCreate={handleCreate} />
      <Guild guilds={guilds} onRefresh={fetchGuilds} />
    </div>
  );
}

export default Guilds;
