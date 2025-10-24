export async function POST(req: Request) {
  const body = await req.json();
  const text = (body?.text || '').toString().toLowerCase();

  // TODO: plug real LLM. MVP stub returns empty so UI keeps list.
  return Response.json({ suggested: [] });
}
