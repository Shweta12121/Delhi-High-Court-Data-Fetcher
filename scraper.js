const cheerio = require("cheerio");
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

async function fetchLatestJudgments() {
  try {
    const res = await fetch("https://delhihighcourt.nic.in/web/judgement/fetch-data");
    const html = await res.text();
    const $ = cheerio.load(html);

    const judgments = [];

    $("table tbody tr").each((i, row) => {
      const cols = $(row).find("td");

      const caseNo = $(cols[1]).text().trim();
      const date = $(cols[2]).text().trim();
      const parties = $(cols[3]).text().trim();

      // Fix: PDF link
      let pdfLink = $(cols[4]).find("a").attr("href");
      if (pdfLink) {
        // If relative URL, prefix with domain
        if (pdfLink.startsWith("/")) {
          pdfLink = `https://delhihighcourt.nic.in${pdfLink}`;
        }
      } else {
        pdfLink = null;
      }

      judgments.push({ caseNo, date, parties, pdfLink });
    });

    return { success: true, judgments };
  } catch (err) {
    console.error("Scraping Error:", err.message);
    return { success: false, error: err.message };
  }
}

module.exports = { fetchLatestJudgments };
