import React, { useState } from 'react';
import { WORLD_NAMES, GENDERS, CLASSES } from '../constants/enums';

function CharacterForm({ onCreate }) {
  const [characterName, setCharacterName] = useState('');
  const [worldName, setWorldName] = useState('아덴');
  const [characterGender, setCharacterGender] = useState('남');
  const [characterClass, setCharacterClass] = useState('전사');
  const [characterClassLevel, setCharacterClassLevel] = useState(1);
  const [characterLevel, setCharacterLevel] = useState(1);
  const [characterExp, setCharacterExp] = useState(0);
  const [characterExpRate, setCharacterExpRate] = useState(0);
  const [characterGuildName, setCharacterGuildName] = useState('');
  const [characterImage, setCharacterImage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate({
      character_name: characterName,
      world_name: worldName,
      character_gender: characterGender,
      character_class: characterClass,
      character_class_level: Number(characterClassLevel),
      character_level: Number(characterLevel),
      character_exp: Number(characterExp),
      character_exp_rate: Number(characterExpRate),
      character_guild_name: characterGuildName,
      character_image: characterImage,
    });
    setCharacterName('');
    setWorldName('아덴');
    setCharacterGender('남');
    setCharacterClass('전사');
    setCharacterClassLevel(1);
    setCharacterLevel(1);
    setCharacterExp(0);
    setCharacterExpRate(0);
    setCharacterGuildName('');
    setCharacterImage('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: "1rem" }}>
      <input
        type="text"
        placeholder="캐릭터 이름"
        value={characterName}
        onChange={e => setCharacterName(e.target.value)}
        required
      />
      <select
        value={worldName}
        onChange={e => setWorldName(e.target.value)}
        required
        style={{ marginLeft: "10px" }}
      >
        {WORLD_NAMES.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
      <select
        value={characterGender}
        onChange={e => setCharacterGender(e.target.value)}
        required
        style={{ marginLeft: "10px" }}
      >
        {GENDERS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
      <select
        value={characterClass}
        onChange={e => setCharacterClass(e.target.value)}
        required
        style={{ marginLeft: "10px" }}
      >
        {CLASSES.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
      <input
        type="number"
        placeholder="클래스 레벨"
        value={characterClassLevel}
        min={1}
        onChange={e => setCharacterClassLevel(e.target.value)}
        required
        style={{ marginLeft: "10px", width: "100px" }}
      />
      <input
        type="number"
        placeholder="캐릭터 레벨"
        value={characterLevel}
        min={1}
        onChange={e => setCharacterLevel(e.target.value)}
        required
        style={{ marginLeft: "10px", width: "100px" }}
      />
      <input
        type="number"
        placeholder="경험치"
        value={characterExp}
        min={0}
        onChange={e => setCharacterExp(e.target.value)}
        required
        style={{ marginLeft: "10px", width: "100px" }}
      />
      <input
        type="number"
        placeholder="경험치율(%)"
        value={characterExpRate}
        min={0}
        max={100}
        onChange={e => setCharacterExpRate(e.target.value)}
        required
        style={{ marginLeft: "10px", width: "120px" }}
      />
      <input
        type="text"
        placeholder="길드명"
        value={characterGuildName}
        onChange={e => setCharacterGuildName(e.target.value)}
        style={{ marginLeft: "10px", width: "120px" }}
      />
      <input
        type="text"
        placeholder="캐릭터 이미지 URL"
        value={characterImage}
        onChange={e => setCharacterImage(e.target.value)}
        style={{ marginLeft: "10px", width: "200px" }}
      />
      <button type="submit" style={{ marginLeft: "10px" }}>캐릭터 생성</button>
    </form>
  );
}

export default CharacterForm;
