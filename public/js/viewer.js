let viewer = null;

const viewerElement = document.getElementById("viewer");
const pdbUrl = viewerElement.dataset.pdbUrl;

function initializeViewer() {
  viewer = $3Dmol.createViewer(viewerElement, {
    backgroundColor: "white"
  });

  loadStructureText(pdbUrl)
    .then(pdbData => {
      console.log("Loaded structure characters:", pdbData.length);
      console.log("First 200 characters:", pdbData.slice(0, 200));

      viewer.addModel(pdbData, "pdb");

      viewer.setStyle({}, {
        stick: { radius: 0.18 },
        sphere: { scale: 0.22 }
      });

      viewer.zoomTo();
      viewer.render();
      viewer.resize();

      setTimeout(() => {
        viewer.resize();
        viewer.zoomTo();
        viewer.render();
      }, 300);
    })
    .catch(error => {
      console.error(error);
      viewerElement.innerHTML = `
        <div class="viewer-error">
          Could not load PDB file: ${pdbUrl}
        </div>
      `;
    });
}

function loadStructureText(url) {
  if (url.endsWith(".gz")) {
    return fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Could not load compressed PDB file: ${url}`);
        }
        return response.arrayBuffer();
      })
      .then(buffer => {
        const compressed = new Uint8Array(buffer);
        const decompressed = pako.ungzip(compressed, { to: "string" });
        return decompressed;
      });
  }

  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Could not load PDB file: ${url}`);
      }
      return response.text();
    });
}

function clearStyle() {
  viewer.setStyle({}, {});
}

function setCartoon() {
  if (!viewer) return;

  clearStyle();

  viewer.setStyle({}, {
    cartoon: {
      color: "spectrum"
    }
  });

  viewer.zoomTo();
  viewer.render();
}

function setStick() {
  if (!viewer) return;

  clearStyle();

  viewer.setStyle({}, {
    stick: {
      radius: 0.18
    }
  });

  viewer.zoomTo();
  viewer.render();
}

function setSphere() {
  if (!viewer) return;

  clearStyle();

  viewer.setStyle({}, {
    sphere: {
      scale: 0.25
    }
  });

  viewer.zoomTo();
  viewer.render();
}

function setLine() {
  if (!viewer) return;

  clearStyle();

  viewer.setStyle({}, {
    line: {}
  });

  viewer.zoomTo();
  viewer.render();
}

function resetView() {
  if (!viewer) return;

  viewer.zoomTo();
  viewer.render();
}

initializeViewer();