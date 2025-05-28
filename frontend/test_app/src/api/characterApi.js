export async function fetchCharacters() {
  const res = await fetch("http://localhost:5000/api/characters");
  if (!res.ok) throw new Error("캐릭터 조회 실패");
  return res.json();
}

export async function createCharacter(payload) {
  const res = await fetch("http://localhost:5000/api/character", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("캐릭터 등록 실패");
  return res.json();
}

export async function updateCharacter(id, payload) {
  const res = await fetch(`http://localhost:5000/api/character/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("캐릭터 수정 실패");
  return res.json();
}

export async function deleteCharacter(id) {
  await fetch(`http://localhost:5000/api/character/${id}`, {
    method: "DELETE",
  });
}
