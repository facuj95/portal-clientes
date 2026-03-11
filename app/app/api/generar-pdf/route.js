import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

export async function POST(req) {

  try {

    const { html } = await req.json();

    const browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless
    });

    const page = await browser.newPage();

    await page.setContent(html, {
      waitUntil: "networkidle0"
    });

    const pdf = await page.pdf({
      format: "A4"
    });

    await browser.close();

    return new Response(pdf, {
      headers: {
        "Content-Type": "application/pdf"
      }
    });

  } catch (err) {

    return new Response(err.toString(), {
      status: 500
    });

  }
}
