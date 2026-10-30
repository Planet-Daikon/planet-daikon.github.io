document.addEventListener("DOMContentLoaded", async () => {
  const response = await fetch("/data/GreenOrange.csv");
  if (!response.ok) {
    throw new Error(`Could not load GreenOrange.csv: ${response.status}`);
  }

  const text = await response.text();

  function parseCSV(text) {
    const rows = [];
    let row = [];
    let field = "";
    let quoted = false;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];

      if (quoted) {
        if (char === '"' && text[i + 1] === '"') {
          field += '"';
          i++;
        } else if (char === '"') {
          quoted = false;
        } else {
          field += char;
        }
      } else if (char === '"') {
        quoted = true;
      } else if (char === ",") {
        row.push(field);
        field = "";
      } else if (char === "\n") {
        row.push(field);
        rows.push(row);
        row = [];
        field = "";
      } else if (char !== "\r") {
        field += char;
      }
    }

    if (field !== "" || row.length > 0) {
      row.push(field);
      rows.push(row);
    }

    return rows;
  }

  const [header, ...data] = parseCSV(text);
  if (!header) return;

  const headerRow = document.querySelector("#scoreboard-header");
  const filterRow = document.querySelector("#scoreboard-filters");
  const tbody = document.querySelector("#scoreboard tbody");

  header.forEach((name, index) => {
    const th = document.createElement("th");
    th.textContent = name;
    headerRow.appendChild(th);

    const filterCell = document.createElement("th");

    if ([0, 1, 3].includes(index)) {
      const input = document.createElement("input");
      input.type = "search";
      input.placeholder = `Filter ${name}`;
      input.addEventListener("input", () => {
        table.column(index).search(input.value).draw();
      });
      filterCell.appendChild(input);
    }

    filterRow.appendChild(filterCell);
  });

  data.forEach(row => {
    const tr = document.createElement("tr");

    header.forEach((_, index) => {
      const td = document.createElement("td");
      td.textContent = row[index] ?? "";
      tr.appendChild(td);
    });

    tbody.appendChild(tr);
  });

  const table = new DataTable("#scoreboard", {
    columnDefs: [
      { targets: "_all", orderable: false },
      { targets: [0, 1, 2, 6], orderable: true }
    ],
    order: []
  });
});
