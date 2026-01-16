const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/marketplace_db')
    .then(() => console.log("Connecté à la base Marketplace MongoDB"))
    .catch(err => console.error(err));


// création des modèles

    // 1 . Modèle pour Category
const categorySchema = new mongoose.Schema({
    nom: { type: String, required: true }
});
const Category = mongoose.model('Category', categorySchema);

// 2 . Modèle pour Product
const productSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    prix: { type: Number, required: true },
    stock: { type: Number, required: true},
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }
});
const Product = mongoose.model('Product', productSchema);

// 3 . Modèle pour User
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true},
    role: { type: String, default: 'client' }
});
const User = mongoose.model('User', userSchema);

// 4 . Modèle pour Review 
const reviewSchema = new mongoose.Schema({
    commentaire: { type: String, required: true },
    note: { type: Number, required: true, min: 1, max: 5 },
    produit: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    auteur: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});
const Review = mongoose.model('Review', reviewSchema);



// création des méthodes

// 1 . Gestion du catalogue

// GET product -> Retourne tous les produits avec le détail de leur catégorie.
app.get('/api/product', async (req, res) => {
    const product = await Product.find();
    res.json(product);
});

// POST product -> Ajoute un produit (Vérifier que le prix est positif).
app.post('/api/product', async (req, res) => {
    if (req.body.prix < 0) {
    return res.status(400).json({ message: "prix inférieur à 1" });
}
const product = new Product(req.body);
await product.save();
res.status(201).json(product);
});

// --- DÉMARRAGE DU SERVEUR ---
app.listen(3000, () => {
    console.log("Serveur démarré sur http://localhost:3000");
});










