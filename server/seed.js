require('dotenv').config();
const mongoose = require('mongoose');
const Place = require('./models/Place');

const samplePlaces = [
  require('./data/sainthamaruthuBeach'),
  require('./data/grandMosqueSainthamaruthu'),
  require('./data/sriSubdraramayaTemple'),
  require('./data/southEasternUniversity'),
  require('./data/oluvilLighthouse'),
  require('./data/chadayanthalava'),
  require('./data/painthaaru'),
  require('./data/oluvilHarbour'),
  require('./data/maruthamunaiBeach'),
  require('./data/kadatkaraiPalli'),
  require('./data/deegawapiRajaMahaVihara'),
  require('./data/elephantParkKaliodai')
];

async function seedPlaces() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/triplocal');
  await Place.deleteMany({});
  const places = await Place.insertMany(samplePlaces);
  console.log(`${places.length} verified places inserted successfully.`);
  await mongoose.disconnect();
}

seedPlaces().catch(async (error) => {
  console.error('Unable to seed places:', error.message);
  await mongoose.disconnect();
  process.exit(1);
});
