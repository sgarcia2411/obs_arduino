const mongoose = require('mongoose');
const { Schema } = mongoose;

const OrderArduinoSchema = new Schema({
  scene_id:  String,
  order:   String,
  createdAt: { type: Date, default: Date.now },
  active: { type: Boolean, default: true },
});

const OrderArduino = mongoose.model('OrderArduino', OrderArduinoSchema);

module.exports = {
    OrderArduino
}
