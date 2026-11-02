document.addEventListener("DOMContentLoaded", async () => {
  const csvFiles = [
    { path: "/data/GreenOrange.csv", label: "Green Orange" },
    { path: "/data/WhiteVanilla.csv", label: "White Vanilla" }
  ];

  let currentFileIndex = 0;
  let table = null;

  const headerRow = document.querySelector("#scoreboard-header");
  const tbody = document.querySelector("#scoreboard tbody");
  const swapButton = document.querySelector("#swap-mode");
  const swapButtonImage = swapButton.querySelector("img");
  const patchButton = document.querySelector("#patch-filter");
  const patchImage = patchButton.querySelector("img");

  const modes = [
	  {
		path: "/data/GreenOrange.csv",
		label: "Green Orange",
		image: "/assets/images/go.png"
	  },
	  {
		path: "/data/WhiteVanilla.csv",
		label: "White Vanilla",
		image: "/assets/images/wv.png"
	  }
	];

  const patches = [
  { value: "rev.2020", image: "/assets/images/rev2020.png" },
  { value: "rev.2018", image: "/assets/images/rev2018.png" }
  ];

  const detailImages = {
	  
    "Commentary": {
      src: "/assets/images/details/fusk.png",
      title: "Commentary"
    },
    "GDQ": {
      src: "/assets/images/details/gdq.png",
      title: "Live at GDQ Hotfix"
    },
    "Z-Rank": {
      src: "/assets/images/details/zrank.png",
      title: "Z-Rank"
    },
    "ZeroRanger Medal": {
      src: "/assets/images/details/medal.png",
      title: "ZeroRanger Medal"
    },
    "Smuggle": {
      src: "/assets/images/details/smuggle.png",
      title: "Melee Smuggle"
    },
    "thingy": {
      src: "/assets/images/details/thingy.png",
      title: "''thingy''"
    },
    "Crab Tunnel 1": {
      src: "/assets/images/details/crab.png",
      title: "Crab Tunnel 1 Chain"
    },
    "Crab Tunnel 2": {
      src: "/assets/images/details/crab2.png",
      title: "Crab Tunnel 2 Chain"
    },
    "Crab Tunnel 1 & 2": {
      src: "/assets/images/details/crab3.png",
      title: "Crab Tunnel 1 & 2 Chain"
    },
    "Tower 1": {
      src: "/assets/images/details/tower.png",
      title: "Tower 1 Chain"
    },
    "Tower 2": {
      src: "/assets/images/details/tower2.png",
      title: "Tower 2 Chain"
    },
    "Tower 1 & 2": {
      src: "/assets/images/details/tower3.png",
      title: "Tower 1 & 2 Chain"
    },
    "Maze": {
      src: "/assets/images/details/maze.png",
      title: "Maze Chain"
    },
    "Super Vulcan": {
      src: "/assets/images/details/super.png",
      title: "Super Vulcan"
    },
    "GF Laser": {
      src: "/assets/images/details/gflaser.png",
      title: "GF Laser"
    },
  };

  async function loadCsv(filePath) {
    const response = await fetch(filePath);

    if (!response.ok) {
      throw new Error(`Could not load ${filePath}: ${response.status}`);
    }

    const [header, ...data] = parseCSV(await response.text());

    if (!header) return;

    if (table) {
      table.destroy();
      table = null;
    }

    headerRow.replaceChildren();
    tbody.replaceChildren();

    [header[5], header[8]] = [header[8], header[5]];
    header[5] = "DETAILS";

    header.forEach(name => {
      const th = document.createElement("th");
      th.textContent = name;
      headerRow.appendChild(th);
    });

    data.forEach(row => {
      [row[5], row[8]] = [row[8], row[5]];

      const tr = document.createElement("tr");

      header.forEach((_, index) => {
        const td = document.createElement("td");
        const value = row[index] ?? "";

        if (index === 8 && value.trim()) {
          const link = document.createElement("a");
          link.href = value.trim();
          link.target = "_blank";
          link.rel = "noopener noreferrer";
          link.textContent = "🔗";
          link.setAttribute("aria-label", "Open link");
          link.className = "link-icon";
          td.appendChild(link);
        } else if (index === 5 && value.trim()) {
          for (const [text, image] of Object.entries(detailImages)) {
            if (
              text === "Crab Tunnel 1" &&
              value.includes("Crab Tunnel 1 & 2")
            ) {
              continue;
            }

            if (
              text === "Tower 1" &&
              value.includes("Tower 1 & 2")
            ) {
              continue;
            }

            if (value.includes(text)) {
              const img = document.createElement("img");
              img.src = image.src;
              img.alt = text;
              img.title = image.title;
              img.className = "detail-icon";
              td.appendChild(img);
            }
          }
        } else if (index === 3 && value.trim()) {
          const parts = value
            .trim()
            .split("-")
            .map(part => part.replaceAll("/", "").trim().toLowerCase())
            .filter(Boolean);

          for (const part of parts) {
            const img = document.createElement("img");
            img.src = `/assets/images/loadouts/${encodeURIComponent(part)}.png`;
            img.alt = part;
            img.className = "loadout-icon";
            td.appendChild(img);
          }
        } else if (index === 1 && ["B", "C"].includes(value.trim())) {
          const img = document.createElement("img");
          img.src = value.trim() === "B"
            ? "/assets/images/typeb.png"
            : "/assets/images/typec.png";
          img.alt = value.trim();
          img.className = "type-icon";
          td.appendChild(img);
        } else if (index === 0 && value.trim()) {
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

    table = $("#scoreboard").DataTable({
      order: [],
      columnDefs: [
        { targets: [0, 1, 3, 5, 8], orderable: false },
        { targets: [2, 4, 6, 7], orderable: true }
      ]
    });

	table.column(6).search(patches[0].value).draw();

    const filter1 = document.querySelector("#filter-col-1");
    if (filter1) {
      filter1.addEventListener("change", () => {
        table.column(0).search(filter1.value, false, false).draw();
      });
    }

    const filter4 = document.querySelector("#filter-col-4");
    if (filter4) {
      filter4.addEventListener("input", event => {
        table.column(3).search(event.target.value).draw();
      });
    }

    const filter2 = document.querySelector("#filter-col-2");

    if (filter2) {
      const filter2Image = filter2.querySelector("img");
      const imageUrls = (filter2.dataset.images || "").split(",");
      const states = [
        { value: "", label: "all" },
        { value: "B", label: "typeb" },
        { value: "C", label: "typec" }
      ];

      let stateIndex = 0;

      const applyStateFilter = () => {
        $.fn.dataTable.ext.search = $.fn.dataTable.ext.search.filter(
          searchFunction => !searchFunction._scoreboardStateFilter
        );

        const stateFilter = (settings, data, dataIndex) => {
          if (settings.nTable.id !== "scoreboard") return true;

          const state = states[stateIndex].value;
          if (!state) return true;

          const cell = table.cell(dataIndex, 1).node();
          const image = cell?.querySelector("img");

          return image?.alt === state;
        };

        stateFilter._scoreboardStateFilter = true;
        $.fn.dataTable.ext.search.push(stateFilter);
        table.draw();
      };

      if (filter2Image && imageUrls.length) {
        filter2Image.src = imageUrls[0].trim();
      }

      filter2.setAttribute("aria-label", "Show entries");

      filter2.onclick = () => {
        stateIndex = (stateIndex + 1) % states.length;
        applyStateFilter();

        if (filter2Image && imageUrls[stateIndex]) {
          filter2Image.src = imageUrls[stateIndex].trim();
        }

        filter2.setAttribute(
          "aria-label",
          `Show ${states[stateIndex].label} entries`
        );
      };
    }
  }

	function updateSwapButton() {
	  const currentFile = modes[currentFileIndex];
	  swapButtonImage.src = currentFile.image;
	  swapButton.setAttribute("aria-label", `Mode: ${currentFile.label}`);
	}

	let isSwitching = false;

	swapButton.addEventListener("click", async () => {
	  if (isSwitching) return;
	  isSwitching = true;
	  swapButton.disabled = true;

	  const nextIndex = 1 - currentFileIndex;

	  try {
		await loadCsv(modes[nextIndex].path);
		currentFileIndex = nextIndex;
		updateSwapButton();
	  } catch (error) {
		console.error(error);
	  } finally {
		setTimeout(() => {
		  isSwitching = false;
		  swapButton.disabled = false;
		}, 1000);
	  }
	});

	updateSwapButton();

	let patchIndex = 0

	patchButton.addEventListener("click", () => {
	  patchIndex = 1 - patchIndex;
	  const patch = patches[patchIndex];

	  patchImage.src = patch.image;
	  patchButton.setAttribute("aria-label", `Filter for ${patch.value}`);

	  table.column(6).search(patch.value).draw();
	});

  await loadCsv(modes[currentFileIndex].path);

  const profilesResponse = await fetch("/data/profiles.txt");

  if (!profilesResponse.ok) {
    throw new Error(
      `Could not load profiles.txt: ${profilesResponse.status}`
    );
  }

  const profiles = (await profilesResponse.text())
    .split(/\r?\n/)
    .map(profile => profile.trim())
    .filter(Boolean);

  const datalist = document.querySelector("#profiles-list");

  if (datalist) {
    profiles.forEach(profile => {
      const option = document.createElement("option");
      option.value = profile;
      datalist.appendChild(option);
    });
  }

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