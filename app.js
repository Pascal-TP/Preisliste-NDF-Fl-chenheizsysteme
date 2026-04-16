async function ladePreise() {
  try {
    const response = await fetch("preise.csv?v=" + Date.now());

    if (!response.ok) {
      throw new Error("preise.csv konnte nicht geladen werden.");
    }

    const csvText = await response.text();
    const daten = parseCSV(csvText);

    renderPreise(daten);
    setzeLetztesUpdate();
  } catch (error) {
    console.error("Fehler beim Laden der Preise:", error);
    zeigeLadefehler();
  }
}

function parseCSV(csvText) {
  const zeilen = csvText
    .trim()
    .split(/\r?\n/)
    .filter((zeile) => zeile.trim() !== "");

  const datenZeilen = zeilen.slice(1);
  const daten = {};

  for (const zeile of datenZeilen) {
    const teile = zeile.split(";");

    if (teile.length < 4) continue;

    const id = teile[0].trim();
    const bezeichnung = teile[1].trim();
    const preis = teile[2].trim();
    const einheit = teile[3].trim();

    daten[id] = { bezeichnung, preis, einheit };
  }

  return daten;
}

function renderPreise(daten) {
  document.querySelectorAll("[data-price-id]").forEach((element) => {
    const id = element.dataset.priceId;
    if (daten[id]) {
      element.textContent = daten[id].preis + " €";
    } else {
      element.textContent = "nicht gepflegt";
    }
  });

  document.querySelectorAll("[data-unit-id]").forEach((element) => {
    const id = element.dataset.unitId;
    if (daten[id]) {
      element.textContent = daten[id].einheit;
    } else {
      element.textContent = "-";
    }
  });
}

function setzeLetztesUpdate() {
  const el = document.getElementById("last-update");
  const jetzt = new Date();

  const datum = jetzt.toLocaleDateString("de-DE");
  const zeit = jetzt.toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit"
  });

  el.textContent = `Stand: ${datum}, ${zeit}`;
}

function zeigeLadefehler() {
  document.querySelectorAll("[data-price-id]").forEach((element) => {
    element.textContent = "Fehler";
  });

  document.querySelectorAll("[data-unit-id]").forEach((element) => {
    element.textContent = "Fehler";
  });

  const el = document.getElementById("last-update");
  if (el) {
    el.textContent = "Preise konnten nicht geladen werden";
  }
}

document.addEventListener("DOMContentLoaded", ladePreise);

async function ladePreise() {
  try {
    const response = await fetch("preise.csv?v=" + Date.now());

    if (!response.ok) {
      throw new Error("preise.csv konnte nicht geladen werden.");
    }

    const csvText = await response.text();
    const daten = parseCSV(csvText);

    renderPreise(daten);
    setzeLetztesUpdate();
  } catch (error) {
    console.error("Fehler beim Laden der Preise:", error);
    zeigeLadefehler();
  }
}

function parseCSV(csvText) {
  const zeilen = csvText
    .trim()
    .split(/\r?\n/)
    .filter((zeile) => zeile.trim() !== "");

  const datenZeilen = zeilen.slice(1);
  const daten = {};

  for (const zeile of datenZeilen) {
    const teile = zeile.split(";");

    if (teile.length < 4) continue;

    const id = teile[0].trim();
    const bezeichnung = teile[1].trim();
    const preis = teile[2].trim();
    const einheit = teile[3].trim();

    daten[id] = { bezeichnung, preis, einheit };
  }

  return daten;
}

function renderPreise(daten) {
  document.querySelectorAll("[data-price-id]").forEach((element) => {
    const id = element.dataset.priceId;
    element.textContent = daten[id] ? `${daten[id].preis} €` : "auf Anfrage";
  });

  document.querySelectorAll("[data-unit-id]").forEach((element) => {
    const id = element.dataset.unitId;
    element.textContent = daten[id] ? daten[id].einheit : "-";
  });
}

function setzeLetztesUpdate() {
  const el = document.getElementById("last-update");
  if (!el) return;

  const jetzt = new Date();

  const datum = jetzt.toLocaleDateString("de-DE");
  const zeit = jetzt.toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit"
  });

  el.textContent = `Stand: ${datum}, ${zeit}`;
}

function zeigeLadefehler() {
  document.querySelectorAll("[data-price-id]").forEach((element) => {
    element.textContent = "Fehler";
  });

  document.querySelectorAll("[data-unit-id]").forEach((element) => {
    element.textContent = "Fehler";
  });

  const el = document.getElementById("last-update");
  if (el) {
    el.textContent = "Preise konnten nicht geladen werden";
  }
}

document.addEventListener("DOMContentLoaded", ladePreise);