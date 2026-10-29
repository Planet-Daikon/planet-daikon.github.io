---
layout: default
title: Scoreboard
nav_order: 2
has_toc: false
---

<div>
  <input id="filter" type="search" placeholder="Filter table…" />
  <span id="status"></span>
</div>

<table>
  <thead id="table-head"></thead>
  <tbody id="table-body"></tbody>
</table>

<script src="https://cdn.jsdelivr.net/npm/papaparse@5.4.1/papaparse.min.js"></script>
<script src="{{ '/assets/csv-table.js' | relative_url }}"></script>
