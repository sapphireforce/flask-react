export async function fetchGuilds() {
  const res = await fetch("http://localhost:5000/api/guilds");
  if (!res.ok) throw new Error("길드 조회 실패");
  return res.json();
}

export async function createGuild(payload) {
  const res = await fetch("http://localhost:5000/api/guild", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("길드 등록 실패");
  return res.json();
}

export async function updateGuild(id, payload) {
  const res = await fetch(`http://localhost:5000/api/guild/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("길드 수정 실패");
  return res.json();
}

export async function deleteGuild(id) {
  await fetch(`http://localhost:5000/api/guild/${id}`, { method: "DELETE" });
}

export async function addGuildMember(guildId, characterName) {
  const res = await fetch(
    `http://localhost:5000/api/guild/${guildId}/add_member`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ character_name: characterName }),
    }
  );
  if (!res.ok) throw new Error("멤버 추가 실패");
  return await res.json();
}
