export default async (request, context) => {
  const url = new URL(request.url);
  
  // Don't handle static assets — let Netlify serve them from dist/client
  if (url.pathname.startsWith("/assets/") || 
      url.pathname.startsWith("/_build/") ||
      url.pathname.match(/\.(js|css|png|jpg|jpeg|svg|ico|woff|woff2|ttf)$/)) {
    return new Response("Not found", { status: 404 });
  }

  const { default: handler } = await import("../../dist/server/server.js");
  return handler.fetch(request, process.env, context);
};

export const config = {
  path: "/*",
  excludedPath: ["/assets/*", "/*.js", "/*.css", "/*.png", "/*.jpg", "/*.svg", "/*.ico"],
};