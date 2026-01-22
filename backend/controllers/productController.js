// Product controller functions
exports.getAllProducts = async (req, res) => {
  try {
    // TODO: Fetch from database
    res.json({ products: [] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, quantity, price, minQuantity,  discount, image, category, description } = req.body;
    // TODO: Save to database
    res.status(201).json({ message: 'Product created' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    // TODO: Update in database
    res.json({ message: 'Product updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    // TODO: Delete from database
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
