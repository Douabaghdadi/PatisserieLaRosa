const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

exports.getDashboardStats = async (req, res) => {
  try {
    // Récupérer toutes les données
    const orders = await Order.find().populate('user', 'name email');
    const products = await Product.find();
    const users = await User.find();

    // Calculer les statistiques
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Revenus
    const totalRevenue = orders
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, o) => sum + o.totalAmount, 0);

    const dailyRevenue = orders
      .filter(o => o.status !== 'cancelled' && new Date(o.createdAt) >= oneDayAgo)
      .reduce((sum, o) => sum + o.totalAmount, 0);

    const weeklyRevenue = orders
      .filter(o => o.status !== 'cancelled' && new Date(o.createdAt) >= oneWeekAgo)
      .reduce((sum, o) => sum + o.totalAmount, 0);

    const monthlyRevenue = orders
      .filter(o => o.status !== 'cancelled' && new Date(o.createdAt) >= oneMonthAgo)
      .reduce((sum, o) => sum + o.totalAmount, 0);

    const previousWeekRevenue = orders
      .filter(o => o.status !== 'cancelled' && new Date(o.createdAt) >= twoWeeksAgo && new Date(o.createdAt) < oneWeekAgo)
      .reduce((sum, o) => sum + o.totalAmount, 0);

    const revenueGrowth = previousWeekRevenue > 0 
      ? ((weeklyRevenue - previousWeekRevenue) / previousWeekRevenue) * 100 
      : 100;

    // Commandes
    const totalOrders = orders.length;
    const dailyOrders = orders.filter(o => new Date(o.createdAt) >= oneDayAgo).length;
    const weeklyOrders = orders.filter(o => new Date(o.createdAt) >= oneWeekAgo).length;
    const monthlyOrders = orders.filter(o => new Date(o.createdAt) >= oneMonthAgo).length;
    const previousWeekOrders = orders.filter(o => new Date(o.createdAt) >= twoWeeksAgo && new Date(o.createdAt) < oneWeekAgo).length;
    const ordersGrowth = previousWeekOrders > 0 
      ? ((weeklyOrders - previousWeekOrders) / previousWeekOrders) * 100 
      : 100;

    // Produits
    const totalProducts = products.length;
    const lowStockProducts = products.filter(p => p.stock < 10).length;

    // Utilisateurs
    const totalUsers = users.length;
    const newUsers = users.filter(u => new Date(u.createdAt) >= oneWeekAgo).length;

    // Commandes en attente
    const pendingOrders = orders.filter(o => o.status === 'pending').length;

    // Commandes récentes (5 dernières)
    const recentOrders = orders
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);

    // Statistiques par statut
    const ordersByStatus = {
      pending: orders.filter(o => o.status === 'pending').length,
      confirmed: orders.filter(o => o.status === 'confirmed').length,
      shipped: orders.filter(o => o.status === 'shipped').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length
    };

    res.json({
      totalRevenue,
      dailyRevenue,
      weeklyRevenue,
      monthlyRevenue,
      revenueGrowth,
      totalOrders,
      dailyOrders,
      weeklyOrders,
      monthlyOrders,
      ordersGrowth,
      totalProducts,
      lowStockProducts,
      totalUsers,
      newUsers,
      pendingOrders,
      recentOrders,
      ordersByStatus
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
