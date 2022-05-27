const mongoose = require('mongoose');
const { Schema } = mongoose;

const SceneSchema = new Schema({
  title:  String,
  createdAt: { type: Date, default: Date.now },
  active: { type: Boolean, default: true },
});

const Scene = mongoose.model('Scene', SceneSchema);

module.exports = {
    Scene
}
