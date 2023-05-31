const mongoose = require('mongoose');

const vehicleDetailsSchema = mongoose.Schema(
  {
    licensePlate: {
      type: String,
      required: true,
      unique: [true, "Vehicle only have one Vehicle's Details"],
    },
    vehicleType: {
      type: String,
      required: [true, "Please select vehicle's type"],
    },
    manufacturer: {
      type: String,
      required: [true, "Please select vehicle's manufacturer"],
    },
    model: {
      type: String,
      required: [true, "Please select vehicle's model"],
    },
    yearOfManufacturer: {
      type: String,
      required: [true, 'Please choose year of manufacturer'],
    },
    fuelType: {
      type: String,
      required: [true, 'Please select fuel type'],
    },
    transmission: {
      type: String,
      required: [true, "Please select vehicle's transmission"],
    },
    images: {
      type: Array,
    },
  },
  {
    timestamp: true,
  }
);

module.exports = mongoose.model('VehicleDetails', vehicleDetailsSchema);
