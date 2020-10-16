"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Repository = void 0;
const dotenv_1 = require("dotenv");
dotenv_1.config();
const repository_1 = __importDefault(require("./repository"));
exports.Repository = repository_1.default;
