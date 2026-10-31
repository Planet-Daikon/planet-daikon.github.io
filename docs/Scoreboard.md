---
layout: default
title: Scoreboard
nav_order: 2
has_toc: false
---

<div id="scoreboard-filters">
  <label>
    <input id="filter-col-1" type="text" list="profiles-list" autocomplete="off">
    <datalist id="profiles-list"></datalist>
  </label>

  <button
    id="filter-col-2"
    type="button"
    data-images="/assets/images/both.png,/assets/images/typeb.png,/assets/images/typec.png"
    aria-label="All"
  >
    <img src="/assets/images/both.png" alt="">
  </button>

  <label>
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
