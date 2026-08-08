require('dotenv').config();
const mongoose = require('mongoose');
const Place = require('./models/Place');
const beach = require('./data/maruthamunaiBeach');

async function addPlace() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/triplocal');

  const place = await Place.findOneAndUpdate(
    { name: beach.name },
    beach,
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );

  console.log(`${place.name} added or updated successfully (${place.distanceFromHome} km from home).`);
  await mongoose.disconnect();
}

addPlace().catch(async (error) => {
  console.error('Unable to add Maruthamunai Beach:', error.message);
  await mongoose.disconnect();
  process.exit(1);
});
