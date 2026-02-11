const BASE_URL = "https://api.rawg.io/api";

function getApiKey() {
  const key = import.meta.env.VITE_RAWG_API_KEY;
  if (!key) throw new Error("Falta VITE_RAWG_API_KEY en el .env");
  return key;
}

async function request(path, params = {}) {
  const key = getApiKey();

  const url = new URL(`${BASE_URL}${path}`);
  url.searchParams.set("key", key);

  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") {
      url.searchParams.set(k, String(v));
    }
  });

  const res = await fetch(url.toString());
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`RAWG error ${res.status}: ${text || res.statusText}`);
  }
  return res.json();
}

/* HOME: carrusel populares */
export function getPopularGames({ page = 1, pageSize = 12 } = {}) {
  return request("/games", {
    ordering: "-rating",
    page,
    page_size: pageSize,
  });
}

/* HOME: slider top metacritic */
export function getTopMetacriticGames({ page = 1, pageSize = 8 } = {}) {
  return request("/games", {
    ordering: "-metacritic",
    page,
    page_size: pageSize,
    dates: "1995-01-01,2025-12-31",
  });
}

/* (si lo usas) búsqueda simple */
export function searchGames({ query, page = 1, pageSize = 20 } = {}) {
  return request("/games", {
    search: query,
    page,
    page_size: pageSize,
  });
}

/* detalle */
export function getGameDetails(id) {
  return request(`/games/${id}`);
}

/* -------------------------------------------------------
   /GAMES: listado paginado + filtros
   page_size recomendado: 40
   ordering: "-rating" | "-metacritic" | "-added" | "-released" | "name" ...
   genres: slug (ej: "action", "rpg")
   platforms: id (ej: "4" para PC)
   dates: "YYYY-MM-DD,YYYY-MM-DD"
   metacritic: "80,100"
------------------------------------------------------- */
export function getGamesList({
  page = 1,
  pageSize = 40,
  search = "",
  ordering = "",
  genres = "",
  platforms = "",
  tags = "",
  publishers = "",
  dates = "",
  metacritic = "",
} = {}) {
  return request("/games", {
    page,
    page_size: pageSize,
    search,
    ordering,
    genres,
    platforms,
    tags,
    publishers,
    dates,
    metacritic,
  });
}

/* para poblar filtros */
export function getGenres({ page = 1, pageSize = 40 } = {}) {
  return request("/genres", {
    page,
    page_size: pageSize,
  });
}

export function getPlatforms({ page = 1, pageSize = 40 } = {}) {
  return request("/platforms", {
    page,
    page_size: pageSize,
  });
}

export function getPublishersList({ page = 1, pageSize = 20, search = "" } = {}) {
  return request("/publishers", {
    page,
    page_size: pageSize,
    search,
  });
}

export function getPublisherDetails(id) {
  return request(`/publishers/${id}`);
}
