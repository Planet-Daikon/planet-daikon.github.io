const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS0H_MLczNIKoWQzA-Bx4hwSCrp-_2BTXAiMhDzWshOpDOnLeHsqqUo5mCfv28lDSwXvCe02qLx6E-s/pub?gid=858596898&single=true&output=csv";
const container = document.querySelector("#sheet-data");

fetch(csvUrl)
  .then(response => {
    if (!response.ok) throw new Error("Could not load spreadsheet");
    return response.text();
  })
  .then(csv => {
    const result = Papa.parse(csv, {
      skipEmptyLines: true
    });

    if (result.errors.length) {
      throw new Error("There was a problem reading the CSV.");
    }

    const table = document.createElement("table");

    result.data.forEach((row, rowIndex) => {
      const tr = document.createElement("tr");

      row.forEach(cell => {
        const td = document.createElement(rowIndex === 0 ? "th" : "td");
        td.textContent = cell; // Displays text safely
        tr.appendChild(td);
      });

      table.appendChild(tr);
    });

    container.replaceChildren(table);
  })
  .catch(error => {
    container.textContent = error.message;
  });
