// Interne dokumenter skal ikke kunne åpnes fra nettbutikken.
const BLOCKED = new Set(["/readme.md", "/stripe-setup.md", "/supplier-config.json", "/cursor-pendientes.md"]);
export const onRequest: PagesFunction = async (ctx) => {
  const path = new URL(ctx.request.url).pathname.toLowerCase();
  if (BLOCKED.has(path) || path.startsWith("/docs/")) return new Response("Not found", { status: 404 });
  return ctx.next();
};
