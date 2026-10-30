---
layout: default
title: Profiles
nav_order: 4
has_toc: false
---

# Profiles

<input id="profile-search" type="search" placeholder="Enter player name…" autocomplete="off">
<ul id="profile-results"></ul>

<script>
  const profiles = [
    {% assign sorted_profiles = site.profiles | sort_natural: "title" %}
    {% for profile in sorted_profiles %}
      {
        title: {{ profile.title | jsonify }},
        url: {{ profile.url | relative_url | jsonify }}
      }{% unless forloop.last %},{% endunless %}
    {% endfor %}
  ];

  const input = document.getElementById("profile-search");
  const results = document.getElementById("profile-results");

  function renderProfiles() {
    const matches = profiles.filter(profile =>
      profile.title.toLowerCase().includes(query.trim().toLowerCase())
    );

    results.replaceChildren();

    for (const profile of matches) {
      const item = document.createElement("li");
      const link = document.createElement("a");
      link.href = profile.url;
      link.textContent = profile.title;
      item.appendChild(link);
      results.appendChild(item);
    }

    if (!matches.length) {
      const item = document.createElement("li");
      item.textContent = "No matching player.";
      results.appendChild(item);
    }
  }

  input.addEventListener("input", () => (input.value));
  renderProfiles();
</script>
