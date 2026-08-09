import { validateMapUrl } from './location';

const CATEGORIES = ['Religious', 'Nature', 'Heritage', 'Cultural', 'Historical', 'Adventure'];
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

export const validatePlaceForm = (formData, images, existingImageCount = 0) => {
  if (!formData.name.trim()) return 'Place name is required.';
  if (formData.name.trim().length > 120) return 'Place name must not exceed 120 characters.';
  if (!formData.description.trim()) return 'Description is required.';
  if (!CATEGORIES.includes(formData.category)) return 'Select a valid category.';
  if (!formData.address.trim()) return 'Address is required.';
  if (formData.locationUrl && !validateMapUrl(formData.locationUrl)) {
    return 'Location link must be a valid HTTPS Google Maps or OpenStreetMap URL.';
  }

  const latitude = Number(formData.latitude);
  const longitude = Number(formData.longitude);
  const distance = Number(formData.distanceFromHome);
  const duration = Number(formData.estimatedVisitDuration);
  if (formData.latitude === '' || !Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
    return 'Latitude must be a number between -90 and 90.';
  }
  if (formData.longitude === '' || !Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
    return 'Longitude must be a number between -180 and 180.';
  }
  if (formData.distanceFromHome === '' || !Number.isFinite(distance) || distance < 0 || distance > 25) {
    return 'Calculate a road distance between 0 and 25 km before saving.';
  }
  if (!Number.isInteger(duration) || duration < 1 || duration > 1440) {
    return 'Estimated visit duration must be a whole number between 1 and 1440 minutes.';
  }

  const selectedImages = Array.from(images || []);
  if (existingImageCount + selectedImages.length > 5) return 'A place can have no more than 5 images.';
  for (const image of selectedImages) {
    if (!ALLOWED_IMAGE_TYPES.includes(image.type)) return `${image.name} must be a JPG, PNG, or GIF image.`;
    if (image.size > 5000000) return `${image.name} must be 5 MB or smaller.`;
  }
  return null;
};
