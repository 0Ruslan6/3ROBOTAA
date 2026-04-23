document.addEventListener("DOMContentLoaded", () => {
  /* =========================
      TYPING EFFECT
  ========================= */
  const typing = document.getElementById("typing");
  const text = "Мій сайт";
  let i = 0;

  function type() {
    if (!typing) return;
    if (i < text.length) {
      typing.textContent += text[i++];
      setTimeout(type, 120);
    }
  }

  if (typing) {
    typing.textContent = "";
    type();
  }

  /* =========================
      YEAR
  ========================= */
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  /* =========================
      ACTIVE LINK
  ========================= */
  const links = document.querySelectorAll(".nav-list a");
  const page = location.pathname.split("/").pop();

  links.forEach((link) => {
    if (link.getAttribute("href") === page) {
      link.classList.add("active");
    }
  });

  /* =========================
      THEME
  ========================= */
  const themeBtn = document.querySelector(".theme-toggle");

  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
  }

  themeBtn?.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    localStorage.setItem(
      "theme",
      document.body.classList.contains("dark") ? "dark" : "light"
    );
  });

  /* =========================
      BACK TO TOP
  ========================= */
  const topBtn = document.querySelector(".back-to-top");

  window.addEventListener("scroll", () => {
    if (topBtn) topBtn.hidden = window.scrollY < 300;
  });

  topBtn?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* =========================
      SERVICES (JSON)
  ========================= */
  const container = document.querySelector(".services");
  const search = document.querySelector(".search-box");
  const filter =
    document.querySelector("[data-filter]") ||
    document.getElementById("filterSelect");
  const sort = document.getElementById("sortSelect");

  let allData = [];

  async function loadData() {
    if (!container) return;

    try {
      container.innerHTML = "<p>Завантаження...</p>";

      const res = await fetch("data/services.json");
      if (!res.ok) throw new Error("JSON error");

      allData = await res.json();
      render(allData);
    } catch (err) {
      container.innerHTML = "<p>Помилка завантаження ❌</p>";
      console.log(err);
    }
  }

  function render(data) {
    if (!container) return;

    if (!data.length) {
      container.innerHTML = "<p>Нічого не знайдено 😢</p>";
      return;
    }

    container.innerHTML = data
      .map(
        (item) => `
        <div class="service-card">
          <h3>${item.title}</h3>
          <p>${item.description}</p>
          <span>${item.price}$</span>
          <small>${item.category}</small>
        </div>
      `
      )
      .join("");
  }

  function applyFilters() {
    let filtered = [...allData];

    const query = search?.value.toLowerCase() || "";
    const cat = filter?.value || filter?.dataset?.filter || "all";
    const sortValue = sort?.value || "";

    /* SEARCH */
    filtered = filtered.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
    );

    /* FILTER */
    if (cat !== "all") {
      filtered = filtered.filter((item) => item.category === cat);
    }

    /* SORT */
    if (sortValue === "az") {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    }

    if (sortValue === "price") {
      filtered.sort((a, b) => a.price - b.price);
    }

    render(filtered);
  }

  search?.addEventListener("input", applyFilters);
  filter?.addEventListener("change", applyFilters);
  sort?.addEventListener("change", applyFilters);

  loadData();
});
