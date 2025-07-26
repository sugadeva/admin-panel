export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const { password } = await req.body ? JSON.parse(req.body) : req.body;
  if (password !== process.env.ADMIN_PASSWORD) return res.status(401).send("Unauthorized");

  try {
    const servers = await fetch(`${process.env.PANEL_URL}/api/application/servers`, {
      headers: { Authorization: `Bearer ${process.env.API_KEY}` }
    }).then(r => r.json());

    for (const s of servers.data) {
      await fetch(`${process.env.PANEL_URL}/api/application/servers/${s.attributes.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${process.env.API_KEY}` }
      });
    }

    res.send("✅ Semua server berhasil dihapus!");
  } catch {
    res.status(500).send("❌ Gagal menghapus server.");
  }
}
