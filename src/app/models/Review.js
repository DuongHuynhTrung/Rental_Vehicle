const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema(
  {
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true]
    }
  },
  {
    timestamp: true,
  }
);

module.exports = mongoose.model('Review', reviewSchema);
