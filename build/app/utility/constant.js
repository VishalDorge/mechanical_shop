"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.statusesData = exports.rolesData = exports.adminData = exports.statuses = exports.roles = void 0;
exports.roles = {
    ADMIN: "6440345a219c5d62b92480ad",
    OWNER: "6440346b219c5d62b92480ae"
};
exports.statuses = {
    PENDING: "6444a6a3046d33346d534c4a",
    VERIFIED: "6444a6b3046d33346d534c4b",
    REJECTED: "6444a6c6046d33346d534c4c"
};
exports.adminData = {
    name: "admin",
    email: "admin@gmail.com",
    password: "12345"
};
exports.rolesData = [
    {
        _id: "6440345a219c5d62b92480ad",
        name: "admin"
    },
    {
        _id: "6440346b219c5d62b92480ae",
        name: "owner"
    }
];
exports.statusesData = [
    {
        _id: "6444a6a3046d33346d534c4a",
        name: "pending"
    },
    {
        _id: "6444a6b3046d33346d534c4b",
        name: "verified"
    },
    {
        _id: "6444a6c6046d33346d534c4c",
        name: "rejected"
    }
];
