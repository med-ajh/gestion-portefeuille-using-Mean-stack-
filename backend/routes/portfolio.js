// backend/routes/portfolio.js

const express = require('express');
const Portfolio = require('../models/Portfolio');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Middleware pour authentifier les requêtes
const authenticate = (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    return res.status(401).send('Authorization header is missing');
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    const decoded = jwt.verify(token, 'secret_key');
    req.userId = decoded.id;
    next();
  } catch (error) {
    res.status(401).send('Unauthorized');
  }
};

// Ajouter un actif
router.post('/add', authenticate, async (req, res) => {
  const { asset, quantity, value } = req.body;
  try {
    const portfolio = new Portfolio({ userId: req.userId, asset, quantity, value });
    await portfolio.save();
    res.status(201).send(portfolio);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Récupérer le portefeuille d'un utilisateur
router.get('/', authenticate, async (req, res) => {
  try {
    const portfolio = await Portfolio.find({ userId: req.userId });
    res.json(portfolio);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
