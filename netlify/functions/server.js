export default async (request, context) => {
  const { default: handler } = await import("../../dist/server/server.js");
  return handler.fetch(request, process.env, context);
};

export const config = {
  path: "/*",
};