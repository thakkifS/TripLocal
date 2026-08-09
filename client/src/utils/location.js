const ALLOWED_MAP_HOSTS = new Set([
  'google.com', 'www.google.com', 'maps.google.com', 'maps.app.goo.gl',
  'goo.gl', 'openstreetmap.org', 'www.openstreetmap.org'
]);

export const validateMapUrl = (value) => {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && ALLOWED_MAP_HOSTS.has(url.hostname.toLowerCase());
  } catch (_) {
    return false;
  }
};

export const extractCoordinates = (value) => {
  if (!validateMapUrl(value)) return null;
  const url = new URL(value);
  const candidates = [
    value.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/),
    url.searchParams.get('q')?.match(/^(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)$/),
    url.searchParams.get('query')?.match(/^(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)$/),
    url.searchParams.get('ll')?.match(/^(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)$/)
  ].filter(Boolean);
  if (url.searchParams.has('mlat') && url.searchParams.has('mlon')) {
    candidates.push([null, url.searchParams.get('mlat'), url.searchParams.get('mlon')]);
  }
  for (const match of candidates) {
    const latitude = Number(match[1]);
    const longitude = Number(match[2]);
    if (latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180) {
      return { latitude, longitude };
    }
  }
  return null;
};
