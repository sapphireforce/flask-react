export async function fetchRankings(rankType = "total") {
  const res = await fetch(
    `http://localhost:5000/api/rankings?rank_type=${rankType}`
  );
  if (!res.ok) throw new Error("랭킹 조회 실패");
  return res.json();
}

export async function createRanking(payload) {
  const res = await fetch("http://localhost:5000/api/ranking", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("랭킹 등록 실패");
  return res.json();
}

export async function updateRanking(id, payload) {
  const res = await fetch(`http://localhost:5000/api/ranking/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("랭킹 수정 실패");
  return res.json();
}

export async function deleteRanking(id) {
  await fetch(`http://localhost:5000/api/ranking/${id}`, { method: "DELETE" });
}
