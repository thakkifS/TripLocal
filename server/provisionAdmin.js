require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function provisionAdmin() {
  const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD || ADMIN_PASSWORD.length < 8) {
    throw new Error('ADMIN_EMAIL and an ADMIN_PASSWORD of at least 8 characters are required.');
  }

  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/triplocal');

  let admin = await User.findOne({ email: ADMIN_EMAIL.toLowerCase() });
  if (!admin) {
    admin = new User({
      name: ADMIN_NAME || 'TripLocal Administrator',
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      role: 'admin'
    });
  } else {
    admin.name = ADMIN_NAME || admin.name;
    admin.password = ADMIN_PASSWORD;
    admin.role = 'admin';
  }

  await admin.save();
  console.log(`Administrator ${admin.email} provisioned successfully.`);
  await mongoose.disconnect();
}

provisionAdmin().catch(async (error) => {
  console.error('Unable to provision administrator:', error.message);
  await mongoose.disconnect();
  process.exit(1);
});
