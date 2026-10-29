const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS0H_MLczNIKoWQzA-Bx4hwSCrp-_2BTXAiMhDzWshOpDOnLeHsqqUo5mCfv28lDSwXvCe02qLx6E-s/pubhtml?gid=858596898&single=true";

  const filterInput = document.querySelector("#filter");
  const head = document.querySelector("#table-head");
  const body = document.querySelector("#table-body");
  const status = document.querySelector("#status");

  let headers = [];
  let rows = [];

  function render(query = "") {
    const q = query.trim().toLowerCase();
    const visibleRows = rows.filter(row =>
      row.some(value => String(value ?? "").toLowerCase().includes(q))
    );

    body.replaceChildren();

    for (const row of visibleRows) {
      const tr = document.createElement("tr");
      for (const value of row) {
        const td = document.createElement("td");
        td.textContent = value ?? "";
        tr.appendChild(td);
      }
      body.appendChild(tr);
    }

    status.textContent = `${visibleRows.length} of ${rows.length} rows`;
  }

  Papa.parse(CSV_URL, {
    download: true,
    skipEmptyLines: true,
    complete(results) {
      if (results.errors.length) {
        console.error("CSV parsing errors:", results.errors);
      }

      [headers, ...rows] = results.data;
      head.replaceChildren();

      const tr = document.createElement("tr");
      for (const header of headers) {
        const th = document.createElement("th");
        th.textContent = header;
        tr.appendChild(th);
      }
      head.appendChild(tr);

      render();
    },
    error(error) {
      status.textContent = `Could not load CSV: ${error.message}`;
    }
  });

  filterInput.addEventListener("input", () => render(filterInput.value));
