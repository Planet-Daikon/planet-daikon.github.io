document.addEventListener("DOMContentLoaded", async () => {
  const csvResponse = await fetch("/data/GreenOrange.csv");

  if (!csvResponse.ok) {
    throw new Error(`Could not load GreenOrange.csv: ${csvResponse.status}`);
  }

  const [header, ...data] = parseCSV(await csvResponse.text());

  if (!header) return;

  const headerRow = document.querySelector("#scoreboard-header");
  const tbody = document.querySelector("#scoreboard tbody");

  header.forEach(name => {
    const th = document.createElement("th");
    th.textContent = name;
    headerRow.appendChild(th);
  });

  data.forEach(row => {
    const tr = document.createElement("tr");

  header.forEach((_, index) => {
    const td = document.createElement("td");
    const value = row[index] ?? "";
  
    if (index === 0 && value.trim()) {
      const link = document.createElement("a");
      link.textContent = value;
      link.href =
        "https://planet-daikon.github.io/profiles/" +
        encodeURIComponent(value.trim().toLowerCase());
      td.appendChild(link);
    } else {
      td.textContent = value;
    }
  
    tr.appendChild(td);
  });

    tbody.appendChild(tr);
  });

  const table = $("#scoreboard").DataTable({
    order: [],
    columnDefs: [
      { targets: "_all", orderable: false },
      { targets: [0, 1, 2, 6], orderable: true }
    ]
  });

  [
    ["#filter-col-1", 0],
    ["#filter-col-4", 3]
  ].forEach(([selector, columnIndex]) => {
    document.querySelector(selector).addEventListener("input", event => {
      table.column(columnIndex).search(event.target.value).draw();
    });
  });

  const filter2 = document.querySelector("#filter-col-2");
  const filter2Image = filter2.querySelector("img");

  const states = [
    { value: "", label: "both" },
    { value: "B", label: "B" },
    { value: "C", label: "C" }
  ];
  
  const imageUrls = filter2.dataset.images.split(",");
  let stateIndex = 0;
  
  table.column(1).search("").draw();
  filter2Image.src = imageUrls[stateIndex].trim();
  filter2.setAttribute("aria-label", "Show B entries");

  filter2.addEventListener("click", () => {
    stateIndex = (stateIndex + 1) % states.length;
    const state = states[stateIndex];

    table.column(1)
      .search(state.value ? `^${state.value}$` : "", true, false)
      .draw();

    filter2Image.src = imageUrls[stateIndex].trim();
    filter2.setAttribute("aria-label", `Show ${state.label} entries`);
  });
  
  const profilesResponse = await fetch("/data/profiles.txt");

  if (!profilesResponse.ok) {
    throw new Error(`Could not load profiles.txt: ${profilesResponse.status}`);
  }

  const profiles = (await profilesResponse.text())
    .split(/\r?\n/)
    .map(profile => profile.trim())
    .filter(Boolean);

  const datalist = document.querySelector("#profiles-list");

  profiles.forEach(profile => {
    const option = document.createElement("option");
    option.value = profile;
    datalist.appendChild(option);
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
