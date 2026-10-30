---
layout: default
title: Profiles
nav_order: 4
has_toc: false
---

# Test

<input id="profile-search" type="search" placeholder="Enter player name…" autocomplete="off">
<ul id="profile-results"></ul>

<script>
document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("profile-search");
  const results = document.getElementById("profile-results");

  if (!input || !results) {
    console.error("Could not find profile search elements.");
    return;
  }

  const profiles = [
    {% assign sorted_profiles = site.profiles | sort_natural: "title" %}
    {% for profile in sorted_profiles %}
    {
      title: {{ profile.title | jsonify }},
      url: {{ profile.url | relative_url | jsonify }}
    }{% unless forloop.last %},{% endunless %}
    {% endfor %}
  ];

  function renderProfiles(query) {
    const term = query.trim().toLowerCase();
    results.replaceChildren();

    const matches = profiles.filter(profile =>
      profile.title.trim().toLowerCase().startsWith(term)
    );

    for (const profile of matches) {
      const li = document.createElement("li");
      const link = document.createElement("a");
      link.href = profile.url;
      link.textContent = profile.title;
      li.appendChild(link);
      results.appendChild(li);
    }

    if (matches.length === 0) {
      const li = document.createElement("li");
      li.textContent = "No matching profiles.";
      results.appendChild(li);
    }
  }

  input.addEventListener("input", () => renderProfiles(input.value));
  renderProfiles("");
});
</script>

<style>
  #profile-results {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 12px;
    list-style: none;
    padding: 0;
  }

  #profile-results li {
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 6px;
  }
</style>
