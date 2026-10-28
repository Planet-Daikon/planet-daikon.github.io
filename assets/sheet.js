const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS0H_MLczNIKoWQzA-Bx4hwSCrp-_2BTXAiMhDzWshOpDOnLeHsqqUo5mCfv28lDSwXvCe02qLx6E-s/pub?gid=858596898&single=true&output=csv";

fetch(csvUrl)
  .then(response => {
    if (!response.ok) throw new Error("Could not load spreadsheet");
    return response.text();
  })
  .then(csv => {
    // Basic parser for simple CSV data.
    const rows = csv.trim().split(/\r?\n/).map(line => line.split(","));
    document.querySelector("#sheet-data").innerHTML =
      "<table>" + rows.map(row =>
        "<tr>" + row.map(cell => `<td>${escapeHtml(cell)}</td>`).join("") + "</tr>"
      ).join("") + "</table>";
  })
  .catch(error => {
    document.querySelector("#sheet-data").textContent = error.message;
  });

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, ch => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[ch]));
}
