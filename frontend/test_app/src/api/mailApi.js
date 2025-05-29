// src/api/mailApi.js
export async function fetchMails(receiver) {
  const res = await fetch(
    `http://localhost:5000/api/mailbox/${encodeURIComponent(receiver)}`
  );
  if (!res.ok) throw new Error("메일 조회 실패");
  return res.json();
}

export async function sendMail(payload) {
  const res = await fetch("http://localhost:5000/api/mail", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("메일 전송 실패");
  return res.json();
}

export async function updateMailStatus(id, status) {
  await fetch(`http://localhost:5000/api/mail/${id}/status`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
}

export async function deleteMail(id) {
  await fetch(`http://localhost:5000/api/mail/${id}`, { method: "DELETE" });
}
