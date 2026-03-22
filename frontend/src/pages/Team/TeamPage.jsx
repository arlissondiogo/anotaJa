import { useState, useEffect } from "react";
import { getEmployees, createEmployee, deleteEmployee } from "../../services/api";
import Modal from "../../components/Modal/Modal";
import "./TeamPage.css";

const ROLE_LABEL = { OWNER: "Dono", MANAGER: "Gerente", RECEPTION: "Recepção" };
const ROLE_COLOR = { OWNER: "#e05a3a", MANAGER: "#7c6af5", RECEPTION: "#3ab5e0" };

export default function TeamPage() {
  const [employees, setEmployees] = useState([]);
  const [addModal, setAddModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "RECEPTION" });

  const update = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const load = async () => {
    try {
      const data = await getEmployees();
      setEmployees(data);
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async () => {
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) return;
    setLoading(true);
    try {
      await createEmployee(form);
      setAddModal(false);
      setForm({ name: "", email: "", password: "", role: "RECEPTION" });
      load();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await deleteEmployee(deleteConfirm.id);
      setDeleteConfirm(null);
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="team-page">
      <div className="team-header">
        <h2 className="team-title">Equipe</h2>
        <button className="btn btn--primary btn--md" onClick={() => setAddModal(true)}>
          + Adicionar
        </button>
      </div>

      <div className="team-list">
        {employees.length === 0 && (
          <p className="team-empty">Nenhum funcionário cadastrado.</p>
        )}
        {employees.map((emp) => (
          <div key={emp.id} className="team-card">
            <div className="team-card__avatar">
              {emp.name?.charAt(0).toUpperCase()}
            </div>
            <div className="team-card__info">
              <span className="team-card__name">{emp.name}</span>
              <span className="team-card__email">{emp.email}</span>
            </div>
            <span
              className="team-card__role"
              style={{
                background: (ROLE_COLOR[emp.role] ?? "#999") + "22",
                color: ROLE_COLOR[emp.role] ?? "#999",
              }}
            >
              {ROLE_LABEL[emp.role] ?? emp.role}
            </span>
            <button className="team-card__delete" title="Remover" onClick={() => setDeleteConfirm(emp)}>
              🗑
            </button>
          </div>
        ))}
      </div>

      {addModal && (
        <Modal onClose={() => setAddModal(false)}>
          <p className="modal-title">Novo Funcionário</p>
          <input className="modal-input" placeholder="Nome" value={form.name} onChange={update("name")} autoFocus />
          <input className="modal-input" placeholder="Email" type="email" value={form.email} onChange={update("email")} style={{ marginTop: 10 }} />
          <input className="modal-input" placeholder="Senha" type="password" value={form.password} onChange={update("password")} style={{ marginTop: 10 }} />
          <label className="modal-label" style={{ marginTop: 10 }}>Nível de acesso</label>
          <select className="modal-input" value={form.role} onChange={update("role")}>
            <option value="RECEPTION">Recepção</option>
            <option value="MANAGER">Gerente</option>
          </select>
          <div className="modal-actions">
            <button className="btn btn--gray btn--md" onClick={() => setAddModal(false)}>Cancelar</button>
            <button className="btn btn--primary btn--md" onClick={handleCreate} disabled={loading}>{loading ? "..." : "Criar"}</button>
          </div>
        </Modal>
      )}

      {deleteConfirm && (
        <Modal onClose={() => setDeleteConfirm(null)}>
          <p className="modal-title">Remover {deleteConfirm.name}?</p>
          <p className="modal-subtitle">Esta ação não pode ser desfeita.</p>
          <div className="modal-actions">
            <button className="btn btn--gray btn--md" onClick={() => setDeleteConfirm(null)}>Cancelar</button>
            <button className="btn btn--danger btn--md" onClick={handleDelete}>Remover</button>
          </div>
        </Modal>
      )}
    </div>
  );
}