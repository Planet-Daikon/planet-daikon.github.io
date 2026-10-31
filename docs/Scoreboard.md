---
layout: default
title: Scoreboard
nav_order: 2
has_toc: false
---

<div id="scoreboard-filters">
  <label>
    <select id="filter-col-1">
      <option value="">Player Filter</option>
    </select>
  </label>

  <button
    id="filter-col-2"
    type="button"
    data-images="/assets/images/type-b.png,/assets/images/type-c.png,/assets/images/both.png"
    aria-label="All"
  >
    <img src="/assets/images/both.png" alt="">
  </button>

  <label>
    Column 4:
    <input id="filter-col-4" type="search">
  </label>
</div>

<table id="scoreboard">
  <thead><tr id="scoreboard-header"></tr></thead>
  <tbody></tbody>
</table>

<link rel="stylesheet" href="https://cdn.datatables.net/2.3.2/css/dataTables.dataTables.min.css">
<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<script src="https://cdn.datatables.net/2.3.2/js/dataTables.min.js"></script>
<script src="{{ '/assets/scoreboard.js' | relative_url }}" defer></script>
