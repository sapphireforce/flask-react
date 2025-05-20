import React, { useState } from 'react';
import { WORLD_NAMES } from '../constants/enums';

function Guild({ guilds, onRefresh }) {
  const worldOptions = WORLD_NAMES;
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [memberName, setMemberName] = useState({});
  const [addMemberError, setAddMemberError] = useState({});

  // 삭제
  const handleDelete = async (id) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    await fetch(`http://localhost:5000/api/guild/${id}`, { method: "DELETE" });
    onRefresh();
  };

  const handleEdit = (guild) => {
    setEditId(guild.id);
    setEditForm({
      world_name: guild.world_name,
      guild_name: guild.guild_name,
      guild_level: guild.guild_level,
      guild_fame: guild.guild_fame,
      guild_point: guild.guild_point,
      guild_master_name: guild.guild_master_name,
      guild_member_count: guild.guild_member_count,
      guild_member: guild.guild_member ? guild.guild_member.join(', ') : '',
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: name.includes('level') || name.includes('fame') || name.includes('point') || name.includes('count')
        ? Number(value)
        : value
    }));
  };

  const handleSave = async (id) => {
    const updatedForm = {
      ...editForm,
      guild_member: editForm.guild_member.split(',').map(m => m.trim()).filter(Boolean)
    };
    const res = await fetch(`http://localhost:5000/api/guild/${id}`, {
      method: "PUT",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedForm)
    });
    if (!res.ok) {
      const data = await res.json();
      alert(data.error || "수정 실패");
    }
    setEditId(null);
    setEditForm({});
    onRefresh();
  };

  // 길드원 추가
  const handleAddMember = async (guildId) => {
    const name = memberName[guildId];
    if (!name) {
      setAddMemberError(prev => ({ ...prev, [guildId]: "이름을 입력하세요." }));
      return;
    }
    const res = await fetch(`http://localhost:5000/api/guild/${guildId}/add_member`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ character_name: name })
    });
    if (res.ok) {
      setMemberName(prev => ({ ...prev, [guildId]: "" }));
      setAddMemberError(prev => ({ ...prev, [guildId]: "" }));
      onRefresh();
    } else {
      const err = await res.json();
      setAddMemberError(prev => ({ ...prev, [guildId]: err.error || "추가 실패" }));
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <button onClick={onRefresh} style={{ marginBottom: "1rem" }}>전체 조회</button>
      <div style={{ display: "flex", flexWrap: "wrap", marginTop: "2rem" }}>
        {guilds.map(guild => (
          <div
            key={guild.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "12px",
              padding: "1rem",
              margin: "0.5rem",
              width: "350px",
              boxShadow: "2px 2px 8px #eee"
            }}
          >
            {editId === guild.id ? (
              <div>
                <input
                  name="guild_name"
                  value={editForm.guild_name}
                  onChange={handleChange}
                  placeholder="길드명"
                  style={{ width: "60%" }}
                /><br/>
                <select
                  name="world_name"
                  value={editForm.world_name}
                  onChange={handleChange}
                  style={{ margin: "6px 0" }}
                >
                  {worldOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                <input
                  type="number"
                  name="guild_level"
                  value={editForm.guild_level}
                  min={1}
                  onChange={handleChange}
                  style={{ marginLeft: "10px", width: "90px" }}
                  placeholder="길드 레벨"
                />
                <input
                  type="number"
                  name="guild_fame"
                  value={editForm.guild_fame}
                  min={0}
                  onChange={handleChange}
                  style={{ marginLeft: "10px", width: "110px" }}
                  placeholder="명성"
                />
                <input
                  type="number"
                  name="guild_point"
                  value={editForm.guild_point}
                  min={0}
                  onChange={handleChange}
                  style={{ marginLeft: "10px", width: "110px" }}
                  placeholder="포인트"
                />
                <br/>
                <input
                  type="text"
                  name="guild_master_name"
                  value={editForm.guild_master_name}
                  onChange={handleChange}
                  placeholder="길드장"
                  style={{ margin: "6px 2px", width: "150px" }}
                />
                <input
                  type="number"
                  name="guild_member_count"
                  value={editForm.guild_member_count}
                  min={1}
                  onChange={handleChange}
                  placeholder="멤버수"
                  style={{ marginLeft: "10px", width: "90px" }}
                />
                <br/>
                <input
                  type="text"
                  name="guild_member"
                  value={editForm.guild_member}
                  onChange={handleChange}
                  placeholder="멤버(쉼표로 구분)"
                  style={{ margin: "6px 2px", width: "280px" }}
                />
                <br/>
                <button onClick={() => handleSave(guild.id)} style={{ marginTop: "8px" }}>저장</button>
                <button onClick={() => setEditId(null)} style={{ marginLeft: "8px" }}>취소</button>
              </div>
            ) : (
              <div>
                <h3>{guild.guild_name} (Lv.{guild.guild_level})</h3>
                <p>
                  <b>월드:</b> {guild.world_name}<br />
                  <b>명성:</b> {guild.guild_fame}<br />
                  <b>포인트:</b> {guild.guild_point}<br />
                  <b>길드장:</b> {guild.guild_master_name}<br />
                  <b>멤버수:</b> {guild.guild_member_count}<br />
                  <b>멤버 목록:</b> {guild.guild_member && guild.guild_member.join(', ')}<br />
                  <b>날짜:</b> {guild.date && guild.date.slice(0, 10)}
                </p>
                <button onClick={() => handleEdit(guild)}>수정</button>
              </div>
            )}

            <div style={{ marginTop: "1rem" }}>
              <input
                type="text"
                placeholder="길드원 이름"
                value={memberName[guild.id] || ""}
                onChange={e => setMemberName(prev => ({ ...prev, [guild.id]: e.target.value }))}
                style={{ width: "60%" }}
              />
              <button onClick={() => handleAddMember(guild.id)} style={{ marginLeft: "10px" }}>
                길드원 추가
              </button>
              {addMemberError[guild.id] && (
                <div style={{ color: "red", fontSize: "0.9em" }}>{addMemberError[guild.id]}</div>
              )}
            </div>

            <button
              onClick={() => handleDelete(guild.id)}
              style={{ background: "red", color: "white", border: "none", borderRadius: "5px", padding: "6px 12px", marginTop: "10px" }}
            >삭제</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Guild;
