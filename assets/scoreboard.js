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
  
  const filter2 = document.querySelector("#filter-col-2");
  const filter2Image = filter2.querySelector("img");

  const states = [
    { value: "", label: "both" },
    { value: "B", label: "typeb" },
    { value: "C", label: "typec" }
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

  const filter1 = document.querySelector("#filter-col-1");
  const profilesResponse = await fetch("/data/profiles.txt");

  if (!profilesResponse.ok) {
    throw new Error(`Could not load profiles.txt: ${profilesResponse.status}`);
  }

  const profiles = (await profilesResponse.text())
    .split(/\r?\n/)
    .map(profile => profile.trim())
    .filter(Boolean);

  const filter1 = document.querySelector("#filter-col-1");
  const results = document.querySelector("#profile-results");

  function escapeRegex(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function renderResults() {
    const query = filter1.value.trim().toLowerCase();
    results.replaceChildren();

    if (!query) {
      results.hidden = true;
      filter1.setAttribute("aria-expanded", "false");
      table.column(0).search("").draw();
      return;
    }

    const matches = profiles.filter(profile =>
      profile.toLowerCase().startsWith(query)
    );

    for (const profile of matches) {
      const li = document.createElement("li");
      const button = document.createElement("button");

      button.type = "button";
      button.textContent = profile;
      button.addEventListener("click", () => {
        filter1.value = profile;
        table.column(0)
          .search(`^${escapeRegex(profile)}$`, true, false)
          .draw();
        results.hidden = true;
        filter1.setAttribute("aria-expanded", "false");
      });

      li.appendChild(button);
      results.appendChild(li);
    }

    if (!matches.length) {
      const li = document.createElement("li");
      li.className = "no-results";
      li.textContent = "No matching profiles.";
      results.appendChild(li);
    }

    results.hidden = false;
    filter1.setAttribute("aria-expanded", "true");
  }

  filter1.addEventListener("input", renderResults);

  document.addEventListener("click", event => {
    if (!event.target.closest(".profile-search")) {
      results.hidden = true;
      filter1.setAttribute("aria-expanded", "false");
    }
  });

  filter1.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      results.hidden = true;
      filter1.setAttribute("aria-expanded", "false");
    }
  });

  document.querySelector("#filter-col-4").addEventListener("input", event => {
    table.column(3).search(event.target.value).draw();
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
