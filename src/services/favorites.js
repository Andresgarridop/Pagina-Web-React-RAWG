const KEY = "gamefinder_favorites";

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    const data = raw ? JSON.parse(raw) : [];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function write(list) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function getFavorites() {
  return read();
}

export function isFavorite(id) {
  const list = read();
  return list.includes(Number(id));
}

export function addFavorite(id) {
  const list = read();
  const num = Number(id);
  if (!list.includes(num)) {
    list.push(num);
    write(list);
  }
  return list;
}

export function removeFavorite(id) {
  const list = read().filter((x) => x !== Number(id));
  write(list);
  return list;
}

export function toggleFavorite(id) {
  const num = Number(id);
  const list = read();
  const exists = list.includes(num);

  if (exists) {
    write(list.filter((x) => x !== num));
    return false;
  }

  list.push(num);
  write(list);
  return true;
}
