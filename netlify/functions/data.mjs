import { getStore } from "@netlify/blobs";
const DEF = { cats: ["Darvaza","Qapı","Məhəccər","Reşotka","Masa"], products: [] };
export default async (req) => {
  const store = getStore("kreon");
  if (req.method === "GET") {
    const d = await store.get("data", { type: "json" });
    return Response.json(d || DEF);
  }
  if (req.method === "POST") {
    const code = process.env.ADMIN_CODE;
    if (!code || req.headers.get("x-admin-code") !== code) return new Response("Kod səhvdir", { status: 401 });
    const d = await req.json();
    if (d.check) return Response.json({ ok: true });
    await store.setJSON("data", { cats: d.cats || [], products: d.products || [] });
    return Response.json({ ok: true });
  }
  return new Response("", { status: 405 });
};
export const config = { path: "/api/data" };
