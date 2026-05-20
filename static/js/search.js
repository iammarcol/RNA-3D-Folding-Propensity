const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");

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
  })
  .catch(error => {
    console.error(error);
    searchResults.innerHTML = "<p>Could not load model index.</p>";
  });

searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim().toUpperCase();

  searchResults.innerHTML = "";

  if (query.length < 2) {
    return;
  }

  const matches = models
    .filter(model => {
      const rfamId = String(model.rfam_id || "").toUpperCase();
      const pdbId = String(model.pdb_id || "").toUpperCase();

      return rfamId.includes(query) || pdbId.includes(query);
    })
    .slice(0, 30);

  if (matches.length === 0) {
    searchResults.innerHTML = `<p>No models found for <strong>${query}</strong>.</p>`;
    return;
  }

  matches.forEach(model => {
    const result = document.createElement("a");
    result.className = "search-result-card";
    result.href = model.url;

    result.innerHTML = `
      <div>
        <h3>${model.rfam_id}</h3>
        <p>${model.pdb_id ? "PDB ID: " + model.pdb_id : "RNA model"}</p>
      </div>

      <div class="search-meta">
        ${model.three_dfp !== null && model.three_dfp !== undefined ? `<span>3DFP: ${model.three_dfp}</span>` : ""}
        ${model.ptm !== null && model.ptm !== undefined ? `<span>pTM: ${model.ptm}</span>` : ""}
        ${model.tm_similarity !== null && model.tm_similarity !== undefined ? `<span>TM-similarity: ${model.tm_similarity}</span>` : ""}
        ${model.length !== null && model.length !== undefined ? `<span>Length: ${model.length}</span>` : ""}
      </div>
    `;

    searchResults.appendChild(result);
  });
});