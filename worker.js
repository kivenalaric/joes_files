import consultationScript from "./frye_consultation.js";

export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname === "/js/frye_consultation.js" || url.pathname === "/") {
      return new Response(consultationScript, {
        headers: {
          "Content-Type": "application/javascript",
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "no-cache",
        },
      });
    }

    return new Response("Not found", { status: 404 });
  },
};
