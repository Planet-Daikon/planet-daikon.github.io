---
layout: default
title: Scoreboard
nav_order: 2
has_toc: false
---

<div id="scoreboard-filters">
  <label>
    <input id="filter-col-1" type="text" list="profiles-list" autocomplete="off" placeholder="Filter by player">
    <datalist id="profiles-list"></datalist>
  </label>

  <button 
	id="swap-mode" 
	type="button" 
	aria-label="Mode: Green Orange"
  >
	<img src="/assets/images/go.png" alt="">
  </button>

  <button
    id="filter-col-2"
    type="button"
    data-images="/assets/images/all.png,/assets/images/typeb.png,/assets/images/typec.png"
    aria-label="All"
  >
    <img src="/assets/images/all.png" alt="">
  </button>

  <button 
    id="patch-filter" 
	type="button" 
	aria-label="Patch"
  >
    <img src="/assets/images/rev2020.png" alt="">
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

<style>
#swap-mode {
  box-sizing: border-box;
  width: 60px;
  height: 58px;
  padding: 4px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}  

#filter-col-2 {
  box-sizing: border-box;
  width: 60px;
  height: 58px;
  padding: 4px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

#patch-filter {
  box-sizing: border-box;
  width: 60px;
  height: 58px;
  padding: 4px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}  

#swap-mode img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

#filter-col-2 img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

#patch-filter img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.type-icon {
  width: 30px;
  height: 26px;
  object-fit: contain;
  vertical-align: middle;
}
.link-icon {
	font-size : 1.5em;
}
</style>