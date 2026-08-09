const HOME_LOCATION = Object.freeze({
  name: 'New Mosque Road, Sainthamaruthu 32300',
  latitude: 7.3901859,
  longitude: 81.8426372
});

const calculateRoadDistance = async (destination) => {
  const baseUrl = (process.env.OSRM_BASE_URL || 'https://router.project-osrm.org').replace(/\/$/, '');
  const coordinates = `${HOME_LOCATION.longitude},${HOME_LOCATION.latitude};${destination.longitude},${destination.latitude}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(`${baseUrl}/route/v1/driving/${coordinates}?overview=false&alternatives=false&steps=false`, {
      signal: controller.signal,
      headers: { 'User-Agent': 'TripLocal/1.0' }
    });
    if (!response.ok) throw new Error(`Routing service returned ${response.status}`);
    const result = await response.json();
    const route = result.routes?.[0];
    if (result.code !== 'Ok' || !route || !Number.isFinite(route.distance)) {
      throw new Error('No driving route was found');
    }
    return {
      distanceKm: Math.round((route.distance / 1000) * 10) / 10,
      durationMinutes: Math.max(1, Math.round(route.duration / 60))
    };
  } catch (error) {
    const serviceError = new Error(error.name === 'AbortError'
      ? 'Road-distance calculation timed out'
      : `Unable to calculate road distance: ${error.message}`);
    serviceError.statusCode = 502;
    throw serviceError;
  } finally {
    clearTimeout(timeout);
  }
};

module.exports = { calculateRoadDistance, HOME_LOCATION };
