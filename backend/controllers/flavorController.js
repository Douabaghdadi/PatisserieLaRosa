const Flavor = require('../models/Flavor');

// Obtenir tous les goûts
exports.getAllFlavors = async (req, res) => {
  try {
    const flavors = await Flavor.find().sort({ name: 1 });
    res.json(flavors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtenir un goût par ID
exports.getFlavorById = async (req, res) => {
  try {
    const flavor = await Flavor.findById(req.params.id);
    if (!flavor) {
      return res.status(404).json({ message: 'Goût non trouvé' });
    }
    res.json(flavor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Créer un nouveau goût
exports.createFlavor = async (req, res) => {
  try {
    const flavor = new Flavor(req.body);
    const newFlavor = await flavor.save();
    res.status(201).json(newFlavor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Mettre à jour un goût
exports.updateFlavor = async (req, res) => {
  try {
    const flavor = await Flavor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!flavor) {
      return res.status(404).json({ message: 'Goût non trouvé' });
    }
    res.json(flavor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Supprimer un goût
exports.deleteFlavor = async (req, res) => {
  try {
    const flavor = await Flavor.findByIdAndDelete(req.params.id);
    if (!flavor) {
      return res.status(404).json({ message: 'Goût non trouvé' });
    }
    res.json({ message: 'Goût supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
