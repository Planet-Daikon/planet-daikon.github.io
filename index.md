<body>
  <h1>My Spreadsheet Data</h1>

  <div id="data">Loading…</div>

<script>
const csvUrl = "PASTE_PUBLISHED_CSV_URL_HERE";

fetch(csvUrl)
  .then(response => {
    if (!response.ok) throw new Error("Could not load the sheet");
    return response.text();
  })
  .then(csv => {
    // Basic CSV parsing; suitable for simple sheets.
    const rows = csv.trim().split(/\r?\n/).map(line => line.split(","));
    document.getElementById("data").innerHTML =
      "<table>" + rows.map(row =>
        "<tr>" + row.map(cell => `<td>${escapeHtml(cell)}</td>`).join("") + "</tr>"
      ).join("") + "</table>";
  })
  .catch(error => {
    document.getElementById("data").textContent = error.message;
  });

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, ch => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[ch]));
}
</script>
</body>
