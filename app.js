const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/marketplace_db')
    .then(() => console.log("Connecté à la base Marketplace MongoDB"))
    .catch(err => console.error(err));

//CRÉATION DES MODÈLES

// 1. Modèle pour Categories
const categoriesSchema = new mongoose.Schema({
    nom: { type: String, required: true }
});
const Categories = mongoose.model('Categories', categoriesSchema);

// 2. Modèle pour Product
const productSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    prix: { type: Number, required: true },
    stock: { type: Number, required: true},
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Categories' }
});
const Product = mongoose.model('Product', productSchema);

// 3. Modèle pour User
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true},
    role: { type: String, default: 'client' }
});
const Users = mongoose.model('Users', userSchema);

// 4. Modèle pour Review 
const reviewSchema = new mongoose.Schema({
    commentaire: { type: String, required: true },
    note: { type: Number, required: true, min: 1, max: 5 },
    produit: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    auteur: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' }
});
const Review = mongoose.model('Review', reviewSchema);

//Création des routes

// Méthodes pour les catégories
//Afficher toutes les catégories
app.get('/api/categories', async (req, res) => {
    try {
        const categories = await Categories.find();
        console.log('Catégories trouvées:', categories); // Pour déboguer
        res.json(categories);
    } catch (err) {
        console.error('Erreur:', err);
        res.status(500).json({ message: err.message });
    }
});


//Ajouter une catégorie
app.post('/api/categories', async (req, res) => {
    const categories = new Categories(req.body);
    await categories.save();
    res.status(201).json(categories);
});


// 1 . Gestion du catalogue

// GET product -> Retourne tous les produits avec le détail de leur catégorie
app.get('/api/product', async (req, res) => {
    const product = await Product.find().populate('Categories');
    res.json(product);
});

// POST product -> Ajoute un produit (Vérifier que le prix est positif)
app.post('/api/product', async (req, res) => {
    if (req.body.prix < 0) {
        return res.status(400).json({ message: "prix inférieur à 1" });
    }
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
});


/// 2 . Système d'avis

// POST /api/reviews -> Permet à un utilisateur de laisser une note sur un produit.
app.post('/api/reviews', async (req, res) => {
    if (req.body.note < 1 || req.body.note > 5) {
        return res.status(400).json({ message: "La note doit être entre 1 et 5" });
    }
    const review = new Review(req.body);
    await review.save();
    res.status(201).json(review);
});

// GET /api/reviews/:productId -> Récupère tous les avis d'un produit spécifique avec le nom 

// --- DÉMARRAGE DU SERVEUR ---
app.listen(3000, () => {
    console.log("Serveur démarré sur http://localhost:3000");
});










