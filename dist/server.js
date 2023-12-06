"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const plantas_1 = __importDefault(require("./routes/plantas"));
const promo_1 = __importDefault(require("./routes/promo"));
const cors = require('cors');
const app = (0, express_1.default)();
app.use(cors());
app.use('/api', plantas_1.default);
app.use('/api', promo_1.default);
app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000/api');
});
