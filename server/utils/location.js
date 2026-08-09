const ALLOWED_MAP_HOSTS = new Set([
  'google.com',
  'www.google.com',
  'maps.google.com',
  'maps.app.goo.gl',
  'goo.gl',
  'openstreetmap.org',
  'www.openstreetmap.org'
]);

const isValidCoordinate = (latitude, longitude) => (
  Number.isFinite(latitude) && latitude >= -90 && latitude <= 90 &&
  Number.isFinite(longitude) && longitude >= -180 && longitude <= 180
);

const validateMapUrl = (value) => {
  if (!value) return true;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && ALLOWED_MAP_HOSTS.has(url.hostname.toLowerCase());
  } catch (_) {
    return false;
  }
};

const extractCoordinates = (value) => {
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
    if (isValidCoordinate(latitude, longitude)) return { latitude, longitude };
  }
  return null;
};

module.exports = { extractCoordinates, isValidCoordinate, validateMapUrl };
