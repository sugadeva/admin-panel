export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const { password } = await req.body ? JSON.parse(req.body) : req.body;
  if (password !== process.env.ADMIN_PASSWORD) return res.status(401).send("Unauthorized");

  try {
    const users = await fetch(`${process.env.PANEL_URL}/api/application/users`, {
      headers: { Authorization: `Bearer ${process.env.API_KEY}` }
    }).then(r => r.json());

    for (const u of users.data) {
      await fetch(`${process.env.PANEL_URL}/api/application/users/${u.attributes.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${process.env.API_KEY}` }
      });
    }

    res.send("✅ Semua user berhasil dihapus!");
  } catch {
    res.status(500).send("❌ Gagal menghapus user.");
  }
}
