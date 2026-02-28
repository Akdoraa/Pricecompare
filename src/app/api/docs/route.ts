const swaggerHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Pricecompare API Docs</title>
    <link
      rel="stylesheet"
      href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css"
    />
    <style>
      body {
        margin: 0;
        background: #f8fafc;
      }
      .topbar {
        display: none;
      }
    </style>
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
    <script>
      window.ui = SwaggerUIBundle({
        url: "/api/openapi",
        dom_id: "#swagger-ui",
        deepLinking: true,
        tryItOutEnabled: true,
        displayRequestDuration: true,
      });
    </script>
  </body>
</html>`;

export async function GET() {
  return new Response(swaggerHtml, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

