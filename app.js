const PASSWORDS = {
  rohr16: "b2b",
  estri7: "b2c"
};

const STORAGE_KEY = "ndfPriceTier";

document.addEventListener("DOMContentLoaded", initPage);

function initPage() {
  setupAccessForm();
  setupChangeAccessButton();

  const priceTier = getPriceTier();

  if (priceTier) {
    hideAccessOverlay();
    ladePreise();
  } else {
    showAccessOverlay();
  }
}

function setupAccessForm() {
  const form = document.getElementById("access-form");
  const passwordInput = document.getElementById("access-password");
  const errorEl = document.getElementById("access-error");

  if (!form || !passwordInput) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const password = passwordInput.value.trim();
    const tier = PASSWORDS[password];

    if (!tier) {
      if (errorEl) {
        errorEl.textContent = "Passwort ungültig. Bitte erneut versuchen.";
      }
      passwordInput.focus();
      passwordInput.select();
      return;
    }

    localStorage.setItem(STORAGE_KEY, tier);

    if (errorEl) {
      errorEl.textContent = "";
    }

    hideAccessOverlay();
    await ladePreise();
    springeZuHashFallsVorhanden();
  });
}

function setupChangeAccessButton() {
  const btn = document.getElementById("change-access-btn");
  if (!btn) return;

  btn.addEventListener("click", () => {
    localStorage.removeItem(STORAGE_KEY);
    leerePreisanzeige();
    showAccessOverlay();
  });
}

function getPriceTier() {
  return localStorage.getItem(STORAGE_KEY);
}

function getPreisDatei() {
  const tier = getPriceTier();

  if (tier === "b2b") return "preise-b2b.csv";
  if (tier === "b2c") return "preise-b2c.csv";

  return null;
}

async function ladePreise() {
  const csvDatei = getPreisDatei();

  if (!csvDatei) {
    showAccessOverlay();
    return;
  }

  try {
    const response = await fetch(`${csvDatei}?v=${Date.now()}`);

    if (!response.ok) {
      throw new Error(`${csvDatei} konnte nicht geladen werden.`);
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

function leerePreisanzeige() {
  document.querySelectorAll("[data-price-id]").forEach((element) => {
    element.textContent = "gesperrt";
  });

  document.querySelectorAll("[data-unit-id]").forEach((element) => {
    element.textContent = "-";
  });

  const el = document.getElementById("last-update");
  if (el) {
    el.textContent = "Bitte Passwort eingeben";
  }
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

  const tier = getPriceTier();
  const label = tier === "b2b" ? "B2B" : tier === "b2c" ? "B2C" : "";

  el.textContent = `Preisliste ${label} · Stand: ${datum}, ${zeit}`;
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

function showAccessOverlay() {
  const overlay = document.getElementById("access-overlay");
  const passwordInput = document.getElementById("access-password");
  const errorEl = document.getElementById("access-error");

  if (overlay) {
    overlay.classList.add("is-visible");
  }

  if (errorEl) {
    errorEl.textContent = "";
  }

  if (passwordInput) {
    passwordInput.value = "";
    setTimeout(() => passwordInput.focus(), 50);
  }

  document.body.classList.add("overlay-open");
}

function hideAccessOverlay() {
  const overlay = document.getElementById("access-overlay");

  if (overlay) {
    overlay.classList.remove("is-visible");
  }

  document.body.classList.remove("overlay-open");
}

function springeZuHashFallsVorhanden() {
  if (!window.location.hash) return;

  const ziel = document.querySelector(window.location.hash);
  if (!ziel) return;

  setTimeout(() => {
    ziel.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 150);
}