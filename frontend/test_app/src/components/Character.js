import React, { useState, useEffect } from 'react';
import CharacterDashboard from './CharacterDashboard';

function Character() {
  const [characters, setCharacters] = useState([]);

  const fetchCharacters = async () => {
    const res = await fetch('http://localhost:5000/api/characters');
    const data = await res.json();
    setCharacters(data);
  };

  useEffect(() => {
    fetchCharacters();
  }, []);

  return (
    <div style={{ marginBottom: "2rem" }}>
      <CharacterDashboard characters={characters} onRefresh={fetchCharacters} />
    </div>
  );
}

export default Character;
