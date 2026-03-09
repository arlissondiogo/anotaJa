import { useState, useEffect } from "react";
import ProductCard from "../../components/ProductCard/ProductCard";
import Modal from "../../components/Modal/Modal";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../services/api";
import "./ProductsPage.css";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
  });
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const update = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () =>
        setForm((prev) => ({ ...prev, image: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form, price: parseFloat(form.price) };
      if (modal.product) {
        await updateProduct(modal.product.id, payload);
      } else {
        await createProduct(payload);
      }
      await loadProducts();
      setModal(null);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      await loadProducts();
      setDeleteConfirm(null);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="products-page">
      <div className="products-header">
        <h2 className="products-title">🍔 Cardápio Digital</h2>
        <button
          className="btn btn--primary btn--md"
          onClick={() => {
            setForm({ name: "", description: "", price: "", image: "" });
            setModal({ product: null });
          }}
        >
          + Adicionar comida
        </button>
      </div>

      <div className="products-list">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onEdit={(p) => {
              setForm({
                name: p.name,
                description: p.description,
                price: String(p.price),
                image: p.image,
              });
              setModal({ product: p });
            }}
            onDelete={() => setDeleteConfirm(product.id)}
          />
        ))}
      </div>

      {modal && (
        <Modal onClose={() => setModal(null)}>
          <p className="modal-title">
            {modal.product ? "Editar" : "Nova"} Comida
          </p>
          <form className="product-form" onSubmit={handleSave}>
            <input
              className="modal-input"
              placeholder="Nome"
              value={form.name}
              onChange={update("name")}
              required
            />
            <input
              className="modal-input"
              placeholder="Descrição"
              value={form.description}
              onChange={update("description")}
            />
            <input
              className="modal-input"
              type="number"
              step="0.01"
              placeholder="Preço"
              value={form.price}
              onChange={update("price")}
              required
            />

            <label className="file-input-label">
              <span>
                {form.image ? "📸 Trocar Foto" : "📁 Selecionar do PC"}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden-file-input"
              />
            </label>

            {form.image && (
              <div className="product-form__preview">
                <img
                  src={form.image}
                  alt="Preview"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
              </div>
            )}

            <div className="modal-actions">
              <button
                type="button"
                className="btn btn--gray btn--md"
                onClick={() => setModal(null)}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn--primary btn--md"
                disabled={loading}
              >
                {loading ? "..." : "Confirmar"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {deleteConfirm && (
        <Modal onClose={() => setDeleteConfirm(null)}>
          <p className="modal-title">Tem certeza?</p>
          <div className="modal-actions">
            <button
              className="btn btn--gray btn--md"
              onClick={() => setDeleteConfirm(null)}
            >
              Não
            </button>
            <button
              className="btn btn--danger btn--md"
              onClick={() => handleDelete(deleteConfirm)}
            >
              Sim, excluir
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
