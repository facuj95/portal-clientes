import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const REQUIRED_FIELDS = [
  'fecha',
  'activo',
  'sector',
  'diagnostico',
  'recomendaciones',
  'estado',
];

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function buildInformeHtml(data) {
  const logo = data.logo ? `<img src="${escapeHtml(data.logo)}" alt="Logo" class="logo" />` : '';

  return `
    <!doctype html>
    <html lang="es">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Informe de diagnóstico</title>
        <style>
          :root {
            color-scheme: light;
          }

          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            padding: 32px;
            font-family: Arial, sans-serif;
            color: #1a1a1a;
            background-color: #ffffff;
          }

          .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 24px;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 12px;
          }

          .title {
            margin: 0;
            font-size: 28px;
            color: #111827;
          }

          .logo {
            max-height: 64px;
            max-width: 180px;
            object-fit: contain;
          }

          .tabla {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 24px;
          }

          .tabla th,
          .tabla td {
            border: 1px solid #d1d5db;
            padding: 10px;
            text-align: left;
            font-size: 14px;
          }

          .tabla th {
            background-color: #f3f4f6;
            width: 24%;
            font-weight: 700;
          }

          .seccion {
            margin-bottom: 20px;
          }

          .seccion h2 {
            margin: 0 0 8px;
            font-size: 18px;
            color: #111827;
          }

          .seccion p {
            margin: 0;
            font-size: 14px;
            line-height: 1.6;
            white-space: pre-wrap;
          }

          .estado {
            display: inline-block;
            margin-top: 4px;
            padding: 6px 10px;
            border-radius: 9999px;
            font-weight: 700;
            font-size: 13px;
            border: 1px solid #cbd5e1;
            background: #eef2ff;
          }
        </style>
      </head>
      <body>
        <header class="header">
          <h1 class="title">Informe de diagnóstico</h1>
          ${logo}
        </header>

        <table class="tabla">
          <tbody>
            <tr>
              <th>Fecha</th>
              <td>${escapeHtml(data.fecha)}</td>
            </tr>
            <tr>
              <th>Activo</th>
              <td>${escapeHtml(data.activo)}</td>
            </tr>
            <tr>
              <th>Sector</th>
              <td>${escapeHtml(data.sector)}</td>
            </tr>
          </tbody>
        </table>

        <section class="seccion">
          <h2>Diagnóstico</h2>
          <p>${escapeHtml(data.diagnostico)}</p>
        </section>

        <section class="seccion">
          <h2>Recomendaciones</h2>
          <p>${escapeHtml(data.recomendaciones)}</p>
        </section>

        <section class="seccion">
          <h2>Estado</h2>
          <span class="estado">${escapeHtml(data.estado)}</span>
        </section>
      </body>
    </html>
  `;
}

function validatePayload(payload) {
  const missingFields = REQUIRED_FIELDS.filter((field) => {
    const value = payload[field];
    return typeof value !== 'string' || value.trim() === '';
  });

  return missingFields;
}

export async function POST(request) {
  let browser;

  try {
    const payload = await request.json();
    const missingFields = validatePayload(payload);

    if (missingFields.length > 0) {
      return Response.json(
        {
          error: `Faltan campos requeridos: ${missingFields.join(', ')}`,
        },
        { status: 400 },
      );
    }

    const html = buildInformeHtml(payload);

    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '24px',
        right: '24px',
        bottom: '24px',
        left: '24px',
      },
    });

    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="informe-diagnostico.pdf"',
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    return Response.json(
      {
        error: 'No se pudo generar el PDF.',
        details: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 },
    );
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
