import React from 'react';

function Ranking() {
  const handleList = async () => {
    const res = await fetch('http://localhost:5000/api/rankings');
    const data = await res.json();
    alert(JSON.stringify(data, null, 2));
  };

  return (
    <div style={{ marginBottom: "2rem" }}>
      <h2>Ranking API</h2>
      <button onClick={handleList}>전체 조회</button>
    </div>
  );
}

export default Ranking;
