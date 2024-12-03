// models/Permission.js
const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },  // e.g., "read", "write", "delete"
  description: { type: String }  // Optional description of the permission
});

const Permission = mongoose.model('Permission', permissionSchema);

module.exports = Permission;
