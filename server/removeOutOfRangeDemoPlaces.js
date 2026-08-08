require('dotenv').config();
const mongoose = require('mongoose');
const Place = require('./models/Place');

const placeNames = [
  'Kudumbigala Monastery',
  'Arugam Bay Beach',
  'Magul Maha Viharaya',
  'Kumana National Park',
  'Okanda Devalaya',
  'Lahugala Kitulana National Park',
  'Panama Village',
  'Pottuvil Lagoon',
  'Yala East National Park',
  'Thirukkovil Temple'
];

async function removePlaces() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/triplocal');
  const result = await Place.deleteMany({ name: { $in: placeNames } });
  console.log(`${result.deletedCount} out-of-range demo places deleted.`);
  await mongoose.disconnect();
}

removePlaces().catch(async (error) => {
  console.error('Unable to remove demo places:', error.message);
  await mongoose.disconnect();
  process.exit(1);
});
