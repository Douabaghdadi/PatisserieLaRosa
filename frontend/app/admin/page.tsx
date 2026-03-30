"use client";
import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Link from "next/link";
import "./dashboard.css";
import { API_URL, getImageUrl } from '@/lib/api';

interface Product {
  _id: string;
  name: string;
  stock: number;
}

interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
}

interface DashboardStats {
  totalRevenue: number;
  weeklyRevenue: number;
  revenueGrowth: number;
  totalProducts: number;
  lowStockProducts: number;
  totalUsers: number;
  newUsers: number;
  dailyRevenue: number;
  monthlyRevenue: number;
}

export default function AdminPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    weeklyRevenue: 0,
    revenueGrowth: 0,
    totalProducts: 0,
    lowStockProducts: 0,
    totalUsers: 0,
    newUsers: 0,
    dailyRevenue: 0,
    monthlyRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      // Récupérer toutes les données en parallèle
      const [productsRes, usersRes] = await Promise.all([
        fetch(`${API_URL}/products`, { headers }),
        fetch(`${API_URL}/users`, { headers })
      ]);

      const products: Product[] = await productsRes.json();
      const users: User[] = await usersRes.json();

      // Calculer les statistiques
      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      // Revenus simulés (vous pouvez les remplacer par de vraies données)
      const totalRevenue = 15420.50;
      const dailyRevenue = 245.30;
      const weeklyRevenue = 1850.75;
      const monthlyRevenue = 8920.40;
      const revenueGrowth = 12.5;

      // Produits
      const totalProducts = products.length;
      const lowStockProducts = products.filter((p: Product) => p.stock < 10).length;

      // Utilisateurs
      const totalUsers = users.length;
      const newUsers = users.filter((u: User) => new Date(u.createdAt) >= oneWeekAgo).length;

      setStats({
        totalRevenue,
        weeklyRevenue,
        revenueGrowth,
        totalProducts,
        lowStockProducts,
        totalUsers,
        newUsers,
        dailyRevenue,
        monthlyRevenue
      });
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors du chargement des statistiques:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="container-scroller">
        <Navbar />
        <div className="container-fluid page-body-wrapper">
          <Sidebar />
          <div className="main-panel">
            <div className="content-wrapper">
              <div className="d-flex justify-content-center align-items-center" style={{ height: "80vh" }}>
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Chargement...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-scroller">
      <Navbar />
      <div className="container-fluid page-body-wrapper">
        <Sidebar />
        <div className="main-panel">
          <div className="content-wrapper">
            <div className="page-header">
              <h3 className="page-title">
                <span className="page-title-icon bg-gradient-primary text-white me-2">
                  <i className="mdi mdi-home"></i>
                </span> Dashboard
              </h3>
            </div>
            {/* Statistiques principales */}
            <div className="row">
              <div className="col-md-4 stretch-card grid-margin">
                <div className="card bg-gradient-danger card-img-holder text-white">
                  <div className="card-body">
                    <img src="/admin/images/dashboard/circle.svg" className="card-img-absolute" alt="circle-image" />
                    <h4 className="font-weight-normal mb-3">
                      Ventes Hebdomadaires 
                      <i className="mdi mdi-chart-line mdi-24px float-end"></i>
                    </h4>
                    <h2 className="mb-5">{stats.weeklyRevenue.toFixed(2)} TND</h2>
                    <h6 className="card-text">
                      {stats.revenueGrowth >= 0 ? "+" : ""}{stats.revenueGrowth.toFixed(1)}% vs semaine dernière
                    </h6>
                  </div>
                </div>
              </div>
              <div className="col-md-4 stretch-card grid-margin">
                <div className="card bg-gradient-success card-img-holder text-white">
                  <div className="card-body">
                    <img src="/admin/images/dashboard/circle.svg" className="card-img-absolute" alt="circle-image" />
                    <h4 className="font-weight-normal mb-3">
                      Produits 
                      <i className="mdi mdi-package-variant mdi-24px float-end"></i>
                    </h4>
                    <h2 className="mb-5">{stats.totalProducts}</h2>
                    <h6 className="card-text">
                      {stats.lowStockProducts} produit{stats.lowStockProducts > 1 ? "s" : ""} en rupture
                    </h6>
                  </div>
                </div>
              </div>
              <div className="col-md-4 stretch-card grid-margin">
                <div className="card bg-gradient-warning card-img-holder text-white">
                  <div className="card-body">
                    <img src="/admin/images/dashboard/circle.svg" className="card-img-absolute" alt="circle-image" />
                    <h4 className="font-weight-normal mb-3">
                      Utilisateurs 
                      <i className="mdi mdi-account-multiple mdi-24px float-end"></i>
                    </h4>
                    <h2 className="mb-5">{stats.totalUsers}</h2>
                    <h6 className="card-text">
                      {stats.newUsers} nouveau{stats.newUsers > 1 ? "x" : ""} cette semaine
                    </h6>
                  </div>
                </div>
              </div>
            </div>

            {/* Section Revenus par Période */}
            <div className="row">
              <div className="col-12 grid-margin">
                <div className="card">
                  <div className="card-body">
                    <h4 className="card-title mb-4">
                      <i className="mdi mdi-cash-multiple text-success"></i> Revenus par Période
                    </h4>
                    <div className="row">
                      <div className="col-md-3 mb-3">
                        <div className="revenue-card border-start border-5 border-info p-3 bg-light">
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <p className="text-muted mb-1 small">AUJOURD'HUI</p>
                              <h3 className="mb-0 text-info">{stats.dailyRevenue.toFixed(2)} TND</h3>
                              <small className="text-muted">Ventes du jour</small>
                            </div>
                            <div className="icon-wrapper">
                              <i className="mdi mdi-calendar-today text-info" style={{ fontSize: '32px' }}></i>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-3 mb-3">
                        <div className="revenue-card border-start border-5 border-primary p-3 bg-light">
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <p className="text-muted mb-1 small">CETTE SEMAINE</p>
                              <h3 className="mb-0 text-primary">{stats.weeklyRevenue.toFixed(2)} TND</h3>
                              <small className="text-muted">Ventes hebdomadaires</small>
                            </div>
                            <div className="icon-wrapper">
                              <i className="mdi mdi-calendar-week text-primary" style={{ fontSize: '32px' }}></i>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-3 mb-3">
                        <div className="revenue-card border-start border-5 border-warning p-3 bg-light">
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <p className="text-muted mb-1 small">CE MOIS</p>
                              <h3 className="mb-0 text-warning">{stats.monthlyRevenue.toFixed(2)} TND</h3>
                              <small className="text-muted">Ventes mensuelles</small>
                            </div>
                            <div className="icon-wrapper">
                              <i className="mdi mdi-calendar-month text-warning" style={{ fontSize: '32px' }}></i>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-3 mb-3">
                        <div className="revenue-card border-start border-5 border-success p-3 bg-light">
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <p className="text-muted mb-1 small">TOTAL</p>
                              <h3 className="mb-0 text-success">{stats.totalRevenue.toFixed(2)} TND</h3>
                              <small className="text-muted">Revenus totaux</small>
                            </div>
                            <div className="icon-wrapper">
                              <i className="mdi mdi-cash-multiple text-success" style={{ fontSize: '32px' }}></i>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Statistiques détaillées */}
                    <div className="row mt-4">
                      <div className="col-md-6">
                        <div className="card bg-gradient-info text-white">
                          <div className="card-body">
                            <h5 className="mb-3">
                              <i className="mdi mdi-trending-up"></i> Croissance des Ventes
                            </h5>
                            <div className="row">
                              <div className="col-6">
                                <p className="mb-1 small">Cette semaine</p>
                                <h4>
                                  {stats.revenueGrowth >= 0 ? '+' : ''}{stats.revenueGrowth.toFixed(1)}%
                                  <i className={`mdi mdi-arrow-${stats.revenueGrowth >= 0 ? 'up' : 'down'} ms-2`}></i>
                                </h4>
                              </div>
                              <div className="col-6">
                                <p className="mb-1 small">Tendance</p>
                                <h4>{stats.revenueGrowth >= 0 ? 'Positive' : 'Négative'}</h4>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="card bg-gradient-success text-white">
                          <div className="card-body">
                            <h5 className="mb-3">
                              <i className="mdi mdi-chart-line"></i> Statistiques Produits
                            </h5>
                            <div className="row">
                              <div className="col-6">
                                <p className="mb-1 small">Total Produits</p>
                                <h4>{stats.totalProducts}</h4>
                              </div>
                              <div className="col-6">
                                <p className="mb-1 small">Stock Faible</p>
                                <h4>{stats.lowStockProducts}</h4>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Statistiques secondaires */}
            <div className="row">
              <div className="col-md-6 grid-margin stretch-card">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex align-items-center justify-content-between">
                      <div>
                        <h4 className="card-title mb-2">Revenu Total</h4>
                        <h2 className="text-primary mb-0">{stats.totalRevenue.toFixed(2)} TND</h2>
                      </div>
                      <div className="icon-lg bg-primary-light rounded-circle">
                        <i className="mdi mdi-cash-multiple text-primary mdi-36px"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6 grid-margin stretch-card">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex align-items-center justify-content-between">
                      <div>
                        <h4 className="card-title mb-2">Nouveaux Utilisateurs</h4>
                        <h2 className="text-info mb-0">{stats.newUsers}</h2>
                      </div>
                      <div className="icon-lg bg-info-light rounded-circle">
                        <i className="mdi mdi-account-plus text-info mdi-36px"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <footer className="footer">
            <div className="d-sm-flex justify-content-center justify-content-sm-between">
              <span className="text-muted text-center text-sm-left d-block d-sm-inline-block">Copyright © 2023 Parapharmacie. All rights reserved.</span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
