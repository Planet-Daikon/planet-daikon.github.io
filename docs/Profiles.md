---
layout: default
title: Profiles
nav_order: 4
has_toc: false
---

# Players

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
