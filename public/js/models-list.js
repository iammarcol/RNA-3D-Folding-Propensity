const modelGrid = document.getElementById("modelGrid");
const sortMetric = document.getElementById("sortMetric");
const sortDirection = document.getElementById("sortDirection");
const modelCount = document.getElementById("modelCount");

let models = [];

fetch("/data/models.json")
  .then(response => {
    if (!response.ok) {
      throw new Error("Could not load models.json");
    }
    return response.json();
  })
  .then(data => {
    models = data;
    renderModels();
  })
  .catch(error => {
    console.error(error);
    modelGrid.innerHTML = "<p>Could not load model list.</p>";
  });

sortMetric.addEventListener("change", renderModels);
sortDirection.addEventListener("change", renderModels);

function renderModels() {
  const metric = sortMetric.value;
  const direction = sortDirection.value;

  const sortedModels = [...models].sort((a, b) => {
    const aValue = getSortableValue(a, metric);
    const bValue = getSortableValue(b, metric);

    // Put missing values at the bottom.
    if (aValue === null && bValue === null) return 0;
    if (aValue === null) return 1;
    if (bValue === null) return -1;

    if (metric === "rfam_id") {
      const comparison = String(aValue).localeCompare(String(bValue));
      return direction === "asc" ? comparison : -comparison;
    }

    const comparison = Number(aValue) - Number(bValue);
    return direction === "asc" ? comparison : -comparison;
  });

  modelGrid.innerHTML = "";

  modelCount.textContent = `${sortedModels.length} models`;

  sortedModels.forEach(model => {
    const card = document.createElement("a");
    card.className = "model-card";
    card.href = model.url;

    card.innerHTML = `
      <h2>${safeText(model.rfam_id)}</h2>

      <div class="card-meta">
        ${formatMeta("3DFP", model.three_dfp)}
        ${formatMeta("pTM", model.ptm)}
        ${formatMeta("TM-similarity", model.tm_similarity)}
        ${formatMeta("Length", model.length)}
      </div>
    `;

    modelGrid.appendChild(card);
  });
}

function getSortableValue(model, metric) {
  const value = model[metric];

  if (value === null || value === undefined || value === "") {
    return null;
  }

  if (metric === "rfam_id") {
    return String(value);
  }

  const number = Number(value);

  if (Number.isNaN(number)) {
    return null;
  }

  return number;
}

function formatMeta(label, value) {
  if (value === null || value === undefined || value === "") {
    return "";
  }

  return `<span>${label}: ${safeText(value)}</span>`;
}

function safeText(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}