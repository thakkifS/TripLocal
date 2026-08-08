require('dotenv').config();
const mongoose = require('mongoose');
const Place = require('./models/Place');
const mosque = require('./data/kadatkaraiPalli');

async function addPlace() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/triplocal');

  const place = await Place.findOneAndUpdate(
    { name: mosque.name },
    mosque,
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );

  console.log(`${place.name} added or updated successfully (${place.distanceFromHome} km from home).`);
  await mongoose.disconnect();
}

addPlace().catch(async (error) => {
  console.error('Unable to add Kadatkarai Palli:', error.message);
  await mongoose.disconnect();
  process.exit(1);
});
