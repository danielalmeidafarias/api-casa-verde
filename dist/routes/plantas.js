"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importStar(require("express"));
const client_1 = require("@prisma/client");
const plantas = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
plantas.use(express_1.default.json());
plantas.route('/plantas')
    .get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const todasPlantas = yield prisma.planta.findMany();
    res.json(todasPlantas);
}))
    .post((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const planta = req.body;
    yield prisma.planta.create({
        data: {
            name: planta.name,
            image: planta.image,
            price: planta.price,
            onSale: planta.onSale
        }
    }).then(() => {
        res.sendStatus(201);
    }).catch((e) => {
        res.send(e);
        console.error(e);
    });
}));
plantas.route('/plantas/:id')
    .delete((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const idPlanta = req.params.id;
    yield prisma.planta.delete({
        where: {
            id: Number(idPlanta)
        }
    }).then(() => {
        res.sendStatus(202);
    }).catch((e) => {
        res.send(e);
    });
}))
    .put((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const idPlanta = req.params.id;
    const plantaAtualizada = req.body;
    yield prisma.planta.update({
        where: {
            id: Number(idPlanta)
        },
        data: {
            name: plantaAtualizada.name,
            image: plantaAtualizada.image,
            onSale: plantaAtualizada.onSale,
            price: plantaAtualizada.price
        }
    }).then(() => {
        res.sendStatus(200);
    }).catch((e) => {
        res.send(e);
    });
}));
exports.default = plantas;
