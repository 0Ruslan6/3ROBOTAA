document.addEventListener("DOMContentLoaded", () => {
  const tbody = document.querySelector("#servicesTable tbody");
  const searchInput = document.getElementById("searchInput");
  const filterSelect = document.getElementById("filterSelect");
  const sortSelect = document.getElementById("sortSelect");

  let allServices = [];

  // =========================
  // LOAD DATA
  // =========================
  async function loadData() {
    try {
      tbody.innerHTML = "<tr><td colspan='3'>Завантаження...</td></tr>";

      const res = await fetch("./data/services.json");
      if (!res.ok) throw new Error("JSON не знайдено");

      const data = await res.json();

      allServices = data;
      render(data);
    } catch (err) {
      console.error(err);
      tbody.innerHTML =
        "<tr><td colspan='3'>❌ Помилка завантаження даних</td></tr>";
    }
  }

  // =========================
  // RENDER TABLE
  // =========================
  function render(data) {
    tbody.innerHTML = "";

    if (!data.length) {
      tbody.innerHTML = "<tr><td colspan='3'>😢 Нічого не знайдено</td></tr>";
      return;
    }

    data.forEach((item) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${item.title}</td>
        <td>${item.description}</td>
        <td>${item.price} $</td>
      `;

      tbody.appendChild(row);
    });
  }

  // =========================
  // FILTER / SEARCH / SORT
  // =========================
  function update() {
    let result = [...allServices];

    const search = searchInput.value.toLowerCase().trim();
    const filter = filterSelect.value;
    const sort = sortSelect.value;

    // SEARCH
    if (search) {
      result = result.filter(
        (i) =>
          i.title.toLowerCase().includes(search) ||
          i.description.toLowerCase().includes(search)
      );
    }

    // FILTER
    if (filter !== "all") {
      result = result.filter((i) => i.category === filter);
    }

    // SORT
    if (sort === "az") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    if (sort === "price") {
      result.sort((a, b) => a.price - b.price);
    }

    render(result);
  }

  // =========================
  // EVENTS
  // =========================
  searchInput?.addEventListener("input", update);
  filterSelect?.addEventListener("change", update);
  sortSelect?.addEventListener("change", update);

  // старт
  loadData();
});
