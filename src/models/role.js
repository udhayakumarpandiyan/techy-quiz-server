// models/Role.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const roleSchema = new Schema({
  name: { type: String, required: true, unique: true }, // e.g., "admin", "user"
  permissions: [{ type: Schema.Types.ObjectId, ref: 'Permission' }]  // Array of Permission IDs
});

const Role = mongoose.model('Role', roleSchema);

module.exports = Role;
