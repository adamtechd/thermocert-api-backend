// thermocert-api/models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: { // NOVO: Adicionado campo email
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isAdmin: { 
        type: Boolean,
        default: false
    },
    permissions: { // NOVO: Estrutura de permissões modulares
        canEdit: { type: Boolean, default: false },
        canGeneratePdf: { type: Boolean, default: false },
        canGenerateDocx: { type: Boolean, default: false },
        canGenerateExcel: { type: Boolean, default: false },
        canAccessAdmin: { type: Boolean, default: false },
        isTestMode: { type: Boolean, default: true } 
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', UserSchema);