"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import Link from "next/link";
import { API_URL, getImageUrl } from '@/lib/api';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const [subcategories, setSubcategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [flavors, setFlavors] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    discount: "0",
    stock: "",
    subcategories: [] as string[],
    flavors: [] as string[],
    brand: "",
    image: ""
  });

  useEffect(() => {
    fetch(`${API_URL}/categories`)
      .then(r => r.json())
      .then(data => setCategories(data));
    fetch(`${API_URL}/subcategories`)
      .then(r => r.json())
      .then(data => setSubcategories(data));
    fetch(`${API_URL}/brands`)
      .then(r => r.json())
      .then(data => setBrands(data));
    fetch(`${API_URL}/flavors`)
      .then(r => r.json())
      .then(data => setFlavors(data));

    fetch(`${API_URL}/products/${params.id}`)
      .then(r => r.json())
      .then(data => setFormData({
        name: data.name,
        description: data.description,
        price: data.price,
        discount: data.discount || 0,
        stock: data.stock,
        subcategories: data.subcategories?.map((s: any) => s._id) || [],
        flavors: data.flavors?.map((f: any) => f._id) || [],
        brand: data.brand?._id || "",
        image: data.image
      }));
  }, [params.id]);

  const groupedSubcategories = categories.map((cat: any) => ({
    category: cat,
    subcats: subcategories.filter((sub: any) => sub.category?._id === cat._id)
  })).filter((group: any) => group.subcats.length > 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch(`${API_URL}/products/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });
    router.push("/admin/products");
  };

  return (
    <div className="container-scroller">
      <Navbar />
      <div className="container-fluid page-body-wrapper">
        <Sidebar />
        <div className="main-panel">
          <div className="content-wrapper">
            <div className="page-header">
              <h3 className="page-title">Modifier le produit</h3>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item"><Link href="/admin">Dashboard</Link></li>
                  <li className="breadcrumb-item"><Link href="/admin/products">Produits</Link></li>
                  <li className="breadcrumb-item active">Modifier</li>
                </ol>
              </nav>
            </div>
            <div className="row">
              <div className="col-12 grid-margin stretch-card">
                <div className="card">
                  <div className="card-body">
                    <form onSubmit={handleSubmit}>
                      <div className="form-group">
                        <label>Nom</label>
                        <input type="text" className="form-control" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                      </div>
                      <div className="form-group">
                        <label>Description</label>
                        <textarea className="form-control" rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required></textarea>
                      </div>
                      <div className="form-group">
                        <label className="d-flex justify-content-between align-items-center">
                          <span>Sous-catégories</span>
                          <span className="badge badge-primary">{formData.subcategories.length} sélectionnée(s)</span>
                        </label>
                        <div className="border rounded p-3 bg-light" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                          {groupedSubcategories.map((group: any) => (
                            <div key={group.category._id} className="mb-3">
                              <div className="d-flex align-items-center mb-2 pb-2 border-bottom">
                                <i className="mdi mdi-folder text-primary me-2"></i>
                                <strong className="text-primary">{group.category.name}</strong>
                              </div>
                              <div className="ms-3">
                                {group.subcats.map((sub: any) => (
                                  <div key={sub._id} className="form-check mb-2">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      id={`sub-${sub._id}`}
                                      value={sub._id}
                                      checked={formData.subcategories.includes(sub._id)}
                                      onChange={(e) => {
                                        const newSubcategories = e.target.checked
                                          ? [...formData.subcategories, sub._id]
                                          : formData.subcategories.filter(id => id !== sub._id);
                                        setFormData({...formData, subcategories: newSubcategories});
                                      }}
                                    />
                                    <label className="form-check-label" htmlFor={`sub-${sub._id}`}>
                                      {sub.name}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                        {formData.subcategories.length === 0 && (
                          <small className="text-danger">Veuillez sélectionner au moins une sous-catégorie</small>
                        )}
                      </div>
                      <div className="form-group">
                        <label className="d-flex justify-content-between align-items-center">
                          <span><i className="mdi mdi-palette me-2"></i>Goûts</span>
                          <span className="badge badge-info">{formData.flavors.length} sélectionné(s)</span>
                        </label>
                        <div className="border rounded p-3 bg-light" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                          {flavors.length > 0 ? (
                            <div className="row">
                              {flavors.map((flavor: any) => (
                                <div key={flavor._id} className="col-md-6 col-lg-4">
                                  <div className="form-check mb-2">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      id={`flavor-${flavor._id}`}
                                      value={flavor._id}
                                      checked={formData.flavors.includes(flavor._id)}
                                      onChange={(e) => {
                                        const newFlavors = e.target.checked
                                          ? [...formData.flavors, flavor._id]
                                          : formData.flavors.filter(id => id !== flavor._id);
                                        setFormData({...formData, flavors: newFlavors});
                                      }}
                                    />
                                    <label className="form-check-label" htmlFor={`flavor-${flavor._id}`}>
                                      {flavor.name}
                                    </label>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-muted mb-0">Aucun goût disponible</p>
                          )}
                        </div>
                        <small className="text-muted">Sélectionnez les goûts disponibles pour ce produit (optionnel)</small>
                      </div>
                      <div className="form-group">
                        <label>Marque</label>
                        <select className="form-control" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})}>
                          <option value="">Sélectionner une marque (optionnel)</option>
                          {brands.map((brand: any) => (
                            <option key={brand._id} value={brand._id}>{brand.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Prix (TND)</label>
                        <input type="number" step="0.01" className="form-control" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
                      </div>
                      <div className="form-group">
                        <label>Réduction (%)</label>
                        <input type="number" min="0" max="100" className="form-control" value={formData.discount} onChange={e => setFormData({...formData, discount: e.target.value})} />
                        <small className="text-muted">Entrez 0 pour aucune réduction</small>
                      </div>
                      <div className="form-group">
                        <label>Stock</label>
                        <input type="number" className="form-control" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} required />
                      </div>
                      <div className="form-group">
                        <label>URL Image</label>
                        <input type="text" className="form-control" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} required />
                      </div>
                      <button type="submit" className="btn btn-primary me-2">Enregistrer</button>
                      <Link href="/admin/products" className="btn btn-light">Annuler</Link>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
