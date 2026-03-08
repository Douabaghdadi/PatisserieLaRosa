const Product = require('../models/Product');

exports.getAllProducts = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      
      // Récupérer tous les produits avec leurs relations
      const allProducts = await Product.find()
        .populate('category')
        .populate('subcategories')
        .populate('flavors');
      
      // Filtrer côté application pour chercher dans tous les champs
      const filteredProducts = allProducts.filter(product => {
        return (
          searchRegex.test(product.name) ||
          searchRegex.test(product.description) ||
          (product.category && searchRegex.test(product.category.name)) ||
          (product.subcategories && product.subcategories.some(sub => searchRegex.test(sub.name))) ||
          (product.flavors && product.flavors.some(flavor => searchRegex.test(flavor.name)))
        );
      });
      
      return res.json(filteredProducts);
    }
    
    const products = await Product.find(query)
      .populate('category')
      .populate('subcategories')
      .populate('flavors');
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category').populate('subcategories').populate('flavors');
    if (!product) return res.status(404).json({ error: 'Produit non trouvé' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const Subcategory = require('../models/Subcategory');
    let subcategoryIds = req.body.subcategories;
    if (typeof subcategoryIds === 'string') {
      subcategoryIds = JSON.parse(subcategoryIds);
    }
    subcategoryIds = Array.isArray(subcategoryIds) ? subcategoryIds : [subcategoryIds];
    
    let flavorIds = req.body.flavors;
    if (flavorIds && typeof flavorIds === 'string') {
      flavorIds = JSON.parse(flavorIds);
    }
    flavorIds = flavorIds && Array.isArray(flavorIds) ? flavorIds : (flavorIds ? [flavorIds] : []);
    
    const firstSubcategory = await Subcategory.findById(subcategoryIds[0]);
    
    const productData = {
      ...req.body,
      subcategories: subcategoryIds,
      flavors: flavorIds,
      category: firstSubcategory.category,
      image: req.file ? `http://localhost:5000/uploads/${req.file.filename}` : req.body.image
    };
    const product = new Product(productData);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const Subcategory = require('../models/Subcategory');
    let subcategoryIds = req.body.subcategories;
    if (typeof subcategoryIds === 'string') {
      subcategoryIds = JSON.parse(subcategoryIds);
    }
    subcategoryIds = Array.isArray(subcategoryIds) ? subcategoryIds : [subcategoryIds];
    
    let flavorIds = req.body.flavors;
    if (flavorIds && typeof flavorIds === 'string') {
      flavorIds = JSON.parse(flavorIds);
    }
    flavorIds = flavorIds && Array.isArray(flavorIds) ? flavorIds : (flavorIds ? [flavorIds] : []);
    
    const firstSubcategory = await Subcategory.findById(subcategoryIds[0]);
    
    const updateData = {
      ...req.body,
      subcategories: subcategoryIds,
      flavors: flavorIds,
      category: firstSubcategory.category,
      image: req.file ? `http://localhost:5000/uploads/${req.file.filename}` : req.body.image
    };
    const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ error: 'Produit non trouvé' });
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: 'Produit non trouvé' });
    res.json({ message: 'Produit supprimé' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
