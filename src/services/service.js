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

/* RAWG API ENDPOINTS */
export const getPopularGames = ({ page = 1, pageSize = 12 } = {}) => {
    return request("/games", {
        ordering: "-rating",
        page,
        page_size: pageSize,
    });
};

export const getTopMetacriticGames = ({ page = 1, pageSize = 8 } = {}) => {
    return request("/games", {
        ordering: "-metacritic",
        page,
        page_size: pageSize,
        dates: "1995-01-01,2025-12-31",
    });
};

export const searchGames = ({ query, page = 1, pageSize = 20 } = {}) => {
    return request("/games", {
        search: query,
        page,
        page_size: pageSize,
    });
};

export const getGameDetails = (id) => {
    return request(`/games/${id}`);
};

export const getGamesList = ({
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
} = {}) => {
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
};

export const getGenres = ({ page = 1, pageSize = 40 } = {}) => {
    return request("/genres", {
        page,
        page_size: pageSize,
    });
};

export const getPlatforms = ({ page = 1, pageSize = 40 } = {}) => {
    return request("/platforms", {
        page,
        page_size: pageSize,
    });
};

export const getPublishersList = ({ page = 1, pageSize = 20, search = "" } = {}) => {
    return request("/publishers", {
        page,
        page_size: pageSize,
        search,
    });
};

export const getPublisherDetails = (id) => {
    return request(`/publishers/${id}`);
};

/* EVENTS SIMULATED API */
export const events = [
    {
        id: 1,
        title: "Mundial de E-sports 2026",
        location: "Seúl, Corea del Sur",
        date: "15 de Marzo, 2026",
        image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1000",
    },
    {
        id: 2,
        title: "Indie Dev Games Jam",
        location: "Barcelona, España",
        date: "22 de Abril, 2026",
        image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=1000",
    },
    {
        id: 3,
        title: "Summer Game Fest 2026",
        location: "Los Ángeles, California",
        date: "10 de Junio, 2026",
        image: "https://images.unsplash.com/photo-1514306191717-452ec28c7814?auto=format&fit=crop&q=80&w=1000",
    },
    {
        id: 4,
        title: "Gamescom Europe",
        location: "Colonia, Alemania",
        date: "24 de Agosto, 2026",
        image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=1000",
    },
    {
        id: 5,
        title: "Tokyo Game Show",
        location: "Chiba, Japón",
        date: "21 de Septiembre, 2026",
        image: "https://images.unsplash.com/photo-1566577134770-3d85bb3a9cc4?auto=format&fit=crop&q=80&w=1000",
    },
    {
        id: 6,
        title: "The Game Awards 2026",
        location: "Las Vegas, Nevada",
        date: "12 de Diciembre, 2026",
        image: "https://images.unsplash.com/photo-1478147427282-58a87a120781?auto=format&fit=crop&q=80&w=1000",
    },
];

export const fetchEvents = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(events);
        }, 500);
    });
};
