import React, { useState } from 'react';

function RankingForm({ characters, onCreate }) {
  const [characterId, setCharacterId] = useState(characters.length > 0 ? characters[0].id : "");
  const [rankType, setRankType] = useState("total");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!characterId) {
      alert("캐릭터를 선택하세요.");
      return;
    }
    onCreate({
      character_id: characterId,
      rank_type: rankType,
    });
    setCharacterId(characters.length > 0 ? characters[0].id : "");
    setRankType("total");
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
      <select value={characterId} onChange={e => setCharacterId(e.target.value)} required>
        <option value="">캐릭터 선택</option>
        {characters.map(c => (
          <option key={c.id} value={c.id}>
            {c.character_name} (Lv.{c.character_level}, {c.world_name})
          </option>
        ))}
      </select>
      <select value={rankType} onChange={e => setRankType(e.target.value)} style={{ marginLeft: "10px" }}>
        <option value="total">전체 랭킹</option>
        <option value="world">월드별</option>
      </select>
      <button type="submit" style={{ marginLeft: "10px" }}>랭킹 등록</button>
    </form>
  );
}

export default RankingForm;
