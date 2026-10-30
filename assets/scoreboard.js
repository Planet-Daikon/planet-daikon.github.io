document.addEventListener("DOMContentLoaded", async () => {
  const response = await fetch("/data/GreenOrange.csv");
  if (!response.ok) {
    throw new Error(`Could not load GreenOrange.csv: ${response.status}`);
  }

  const rows = parseCSV(await response.text());
  const [header, ...data] = rows;
  if (!header) return;

  const headerRow = document.querySelector("#scoreboard-header");
  const filterRow = document.querySelector("#scoreboard-filters");
  const tbody = document.querySelector("#scoreboard tbody");

  header.forEach(name => {
    const th = document.createElement("th");
    th.textContent = name;
    headerRow.appendChild(th);

    filterRow.appendChild(document.createElement("th"));
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

  // Enable sorting only on columns 1, 2, 3, and 7 (zero-based indexes).
  const table = $("#scoreboard").DataTable({
    order: [],
    columnDefs: [
      { targets: "_all", orderable: false },
      { targets: [0, 1, 2, 6], orderable: true }
    ]
  });

  // Add independent filters for columns 1, 2, and 4.
  [0, 1, 3].forEach(index => {
    const input = document.createElement("input");
    input.type = "search";
    input.placeholder = `Filter ${header[index]}`;
    filterRow.children[index].appendChild(input);

    input.addEventListener("input", () => {
      table.column(index).search(input.value).draw();
    });
  });

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
});
