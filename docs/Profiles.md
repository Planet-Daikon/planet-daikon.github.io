---
layout: default
title: Profiles
nav_order: 4
has_toc: false
---

# Test2

<div class="profile-search">
  <input
    id="profile-search"
    type="search"
    placeholder="Search profiles…"
    autocomplete="off"
    aria-label="Search profiles"
    aria-controls="profile-results"
    aria-expanded="false"
  >
  <ul id="profile-results" class="profile-results" hidden></ul>
</div>

<style>
  .profile-search {
    position: relative;
    max-width: 420px;
  }

  #profile-search {
    box-sizing: border-box;
    width: 100%;
  }

  .profile-results {
    position: absolute;
    z-index: 10;
    top: 100%;
    left: 0;
    right: 0;
    max-height: 280px;
    overflow-y: auto;
    margin: 4px 0 0;
    padding: 0;
    list-style: none;
    background: white;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-shadow: 0 4px 10px rgb(0 0 0 / 12%);
  }

  .profile-results li a {
    display: block;
    padding: 8px 12px;
    text-decoration: none;
  }

  .profile-results li a:hover,
  .profile-results li a:focus {
    background: #f2f2f2;
  }

  .profile-results li.no-results {
    padding: 8px 12px;
  }
</style>

<script>
document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("profile-search");
  const results = document.getElementById("profile-results");

  const profiles = [
    {% assign sorted_profiles = site.profiles | sort_natural: "title" %}
    {% for profile in sorted_profiles %}
    {
      title: {{ profile.title | jsonify }},
      url: {{ profile.url | relative_url | jsonify }}
    }{% unless forloop.last %},{% endunless %}
    {% endfor %}
  ];

  function renderResults() {
    const query = input.value.trim().toLowerCase();
    results.replaceChildren();

    if (!query) {
      results.hidden = true;
      input.setAttribute("aria-expanded", "false");
      return;
    }

    const matches = profiles.filter(profile =>
      profile.title.trim().toLowerCase().startsWith(query)
    );

    if (matches.length) {
      for (const profile of matches) {
        const li = document.createElement("li");
        const link = document.createElement("a");
        link.href = profile.url;
        link.textContent = profile.title;
        li.appendChild(link);
        results.appendChild(li);
      }
    } else {
      const li = document.createElement("li");
      li.className = "no-results";
      li.textContent = "No matching profiles.";
      results.appendChild(li);
    }

    results.hidden = false;
    input.setAttribute("aria-expanded", "true");
  }

  input.addEventListener("input", renderResults);

  document.addEventListener("click", event => {
    if (!event.target.closest(".profile-search")) {
      results.hidden = true;
      input.setAttribute("aria-expanded", "false");
    }
  });

  input.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      results.hidden = true;
      input.setAttribute("aria-expanded", "false");
    }
  });
});
</script>
