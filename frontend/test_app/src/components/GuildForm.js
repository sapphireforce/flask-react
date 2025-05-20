import React, { useState } from 'react';
import { WORLD_NAMES } from '../constants/enums';

function GuildForm({ onCreate }) {
  const worldOptions = WORLD_NAMES;
  const [guildName, setGuildName] = useState('');
  const [guildLevel, setGuildLevel] = useState(1);
  const [guildFame, setGuildFame] = useState(0);
  const [guildPoint, setGuildPoint] = useState(0);
  const [guildMasterName, setGuildMasterName] = useState('');
  const [guildMemberCount, setGuildMemberCount] = useState(1);
  const [guildMember, setGuildMember] = useState('');
  const [worldName, setWorldName] = useState(worldOptions[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const members = guildMember.split(',').map(name => name.trim()).filter(Boolean);
    onCreate({
      world_name: worldName,
      guild_name: guildName,
      guild_level: Number(guildLevel),
      guild_fame: Number(guildFame),
      guild_point: Number(guildPoint),
      guild_master_name: guildMasterName,
      guild_member_count: Number(guildMemberCount),
      guild_member: members,
    });
    setGuildName('');
    setGuildLevel(1);
    setGuildFame(0);
    setGuildPoint(0);
    setGuildMasterName('');
    setGuildMemberCount(1);
    setGuildMember('');
    setWorldName(worldOptions[0]);
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: "1rem" }}>
      <select
        value={worldName}
        onChange={e => setWorldName(e.target.value)}
        required
        style={{ marginLeft: "10px" }}
      >
        {worldOptions.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      <input
        type="text"
        placeholder="길드명"
        value={guildName}
        onChange={e => setGuildName(e.target.value)}
        required
        style={{ marginLeft: "10px", width: "120px" }}
      />
      <input
        type="number"
        placeholder="길드 레벨"
        value={guildLevel}
        min={1}
        onChange={e => setGuildLevel(e.target.value)}
        required
        style={{ marginLeft: "10px", width: "100px" }}
      />
      <input
        type="number"
        placeholder="명성"
        value={guildFame}
        min={0}
        onChange={e => setGuildFame(e.target.value)}
        required
        style={{ marginLeft: "10px", width: "100px" }}
      />
      <input
        type="number"
        placeholder="포인트"
        value={guildPoint}
        min={0}
        onChange={e => setGuildPoint(e.target.value)}
        required
        style={{ marginLeft: "10px", width: "100px" }}
      />
      <input
        type="text"
        placeholder="길드장"
        value={guildMasterName}
        onChange={e => setGuildMasterName(e.target.value)}
        required
        style={{ marginLeft: "10px", width: "120px" }}
      />
      <input
        type="number"
        placeholder="멤버 수"
        value={guildMemberCount}
        min={1}
        onChange={e => setGuildMemberCount(e.target.value)}
        required
        style={{ marginLeft: "10px", width: "80px" }}
      />
      <input
        type="text"
        placeholder="멤버(쉼표로 구분)"
        value={guildMember}
        onChange={e => setGuildMember(e.target.value)}
        required
        style={{ marginLeft: "10px", width: "240px" }}
      />
      <button type="submit" style={{ marginLeft: "10px" }}>길드 생성</button>
    </form>
  );
}

export default GuildForm;
