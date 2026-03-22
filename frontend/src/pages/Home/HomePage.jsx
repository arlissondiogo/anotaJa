import { useState, useEffect, useCallback } from "react";
import TableIcon from "../../components/TableIcon/TableIcon";
import DeliveryIcon from "../../components/DeliveryIcon/DeliveryIcon";
import Modal from "../../components/Modal/Modal";
import {
  getTables,
  createTable,
  openTable,
  openDelivery,
  closeTable,
  deleteTable,
  getProducts,
  getOrderByTable,
  createOrder,
  updateOrder,
  payOrder,
  cancelOrder,
  mergeTables,
} from "../../services/api";

import "./HomePage.css";
import "../../components/ProductCard/ProductCard.css";
import "../../components/Modal/Modal.css";

const DELIVERY_STATUS_LABELS = {
  WAITING: "⏳ Aguardando",
  OUT_FOR_DELIVERY: "🛵 Saiu pra entrega",
  DELIVERED: "✅ Entregue",
};

export default function HomePage({ activeTab, setActiveTab }) {
  const [tables, setTables] = useState([]);
  const [products, setProducts] = useState([]);

  const [openTableModal, setOpenTableModal] = useState(null);
  const [addTableModal, setAddTableModal] = useState(false);
  const [addDeliveryModal, setAddDeliveryModal] = useState(false);
  const [orderModal, setOrderModal] = useState(null);
  const [menuModal, setMenuModal] = useState(null);
  const [editModal, setEditModal] = useState(null);
  const [feedbackModal, setFeedbackModal] = useState(null);
  const [cancelConfirm, setCancelConfirm] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [mergeModal, setMergeModal] = useState(false);
  const [mergeSource, setMergeSource] = useState("");
  const [mergeTarget, setMergeTarget] = useState("");

  // Delivery extra fields
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryPhone, setDeliveryPhone] = useState("");
  const [deliveryFee, setDeliveryFee] = useState("");
  const [deliveryNotes, setDeliveryNotes] = useState("");
  const [deliveryStatus, setDeliveryStatus] = useState("WAITING");
  // For editing delivery status/info in order modal
  const [deliveryStatusEdit, setDeliveryStatusEdit] = useState("WAITING");

  const [clientName, setClientName] = useState("");
  const [deliveryClientName, setDeliveryClientName] = useState("");
  const [newTableNum, setNewTableNum] = useState("");
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadAll = useCallback(async () => {
    const [t, p] = await Promise.all([getTables(), getProducts()]);
    setTables(t);
    setProducts(p);
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  const filtered = tables.filter((t) => t.status === activeTab);

  const handleOpenTable = async () => {
    if (!clientName.trim() || !openTableModal) return;
    setLoading(true);
    try {
      await openTable(openTableModal.id, clientName);
      setOpenTableModal(null);
      setClientName("");
      setActiveTab("IN_PROGRESS");
      loadAll();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTable = async () => {
    const num = parseInt(newTableNum);
    if (!num) return;
    const tableExists = tables.some((t) => t.number === num);
    if (tableExists) {
      alert("Já existe uma mesa com esse número.");
      return;
    }
    setLoading(true);
    try {
      await createTable(num);
      setAddTableModal(false);
      setNewTableNum("");
      loadAll();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetDeliveryFields = () => {
    setDeliveryClientName("");
    setDeliveryAddress("");
    setDeliveryPhone("");
    setDeliveryFee("");
    setDeliveryNotes("");
    setDeliveryStatus("WAITING");
  };

  const handleAddDelivery = async () => {
    if (!deliveryClientName.trim()) return;
    setLoading(true);
    try {
      const num = Date.now() % 100000;
      const newTable = await createTable(num);
      await openDelivery(newTable.id, deliveryClientName, {
        address: deliveryAddress,
        phone: deliveryPhone,
        fee: deliveryFee ? parseFloat(deliveryFee) : 0,
        notes: deliveryNotes,
        deliveryStatus: deliveryStatus,
      });
      setAddDeliveryModal(false);
      resetDeliveryFields();
      setActiveTab("DELIVERY");
      loadAll();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTableClick = async (table) => {
    if (table.status === "AVAILABLE") {
      setOpenTableModal(table);
      return;
    }
    try {
      const order = await getOrderByTable(table.id);
      // Pre-fill delivery status edit if it's a delivery
      if (table.status === "DELIVERY") {
        setDeliveryStatusEdit(table.deliveryStatus || "WAITING");
      }
      setOrderModal({ order, table });
    } catch (err) {
      alert(err.message);
    }
  };

  const handlePay = async (orderId, table) => {
    setLoading(true);
    try {
      await payOrder(orderId);
      await closeTable(table.id);
      setOrderModal(null);
      setFeedbackModal("pago");
      setTimeout(() => {
        setFeedbackModal(null);
        setActiveTab("AVAILABLE");
        loadAll();
      }, 2000);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFreeTable = async (tableId) => {
    setLoading(true);
    try {
      await closeTable(tableId);
      setOrderModal(null);
      setActiveTab("AVAILABLE");
      loadAll();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelConfirmed = async () => {
    if (!cancelConfirm) return;
    setLoading(true);
    try {
      await cancelOrder(cancelConfirm);
      setCancelConfirm(null);
      setOrderModal(null);
      setFeedbackModal("cancelado");
      setTimeout(() => {
        setFeedbackModal(null);
        setActiveTab("AVAILABLE");
        loadAll();
      }, 2000);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirmed = async () => {
    if (!deleteConfirm) return;
    try {
      await deleteTable(deleteConfirm.id);
    } catch (err) {
      alert(err.message);
    }
    setDeleteConfirm(null);
    setOrderModal(null);
    loadAll();
  };

  const handleMergeTables = async () => {
    if (!mergeSource || !mergeTarget) return;
    setLoading(true);
    try {
      await mergeTables(mergeSource, mergeTarget);
      setMergeModal(false);
      setMergeSource("");
      setMergeTarget("");
      setFeedbackModal("mesclado");
      setTimeout(() => {
        setFeedbackModal(null);
        loadAll();
      }, 2000);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDeliveryStatus = async () => {
    if (!orderModal) return;
    setLoading(true);
    try {
      await updateOrder(orderModal.order?.id, {
        items: orderModal.order?.items,
        total: orderModal.order?.total,
        deliveryStatus: deliveryStatusEdit,
      });
      setOrderModal((prev) => ({
        ...prev,
        table: { ...prev.table, deliveryStatus: deliveryStatusEdit },
      }));
      setFeedbackModal("status");
      setTimeout(() => setFeedbackModal(null), 2000);
      loadAll();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.product.id === product.id);
      if (existing) {
        return prev.map((c) =>
            c.product.id === product.id ? { ...c, qty: c.qty + 1 } : c
        );
      }
      return [...prev, { product, qty: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.product.id === productId);
      if (!existing) return prev;
      if (existing.qty === 1) return prev.filter((c) => c.product.id !== productId);
      return prev.map((c) =>
          c.product.id === productId ? { ...c, qty: c.qty - 1 } : c
      );
    });
  };

  const cartQty = (pid) => cart.find((c) => c.product.id === pid)?.qty || 0;
  const cartTotal = cart.reduce((s, c) => s + c.product.price * c.qty, 0);
  const cartCount = cart.reduce((s, c) => s + c.qty, 0);

  const handleSubmitOrder = async () => {
    if (!cart.length || !menuModal) return;
    setLoading(true);
    try {
      const items = cart.map((c) => ({
        productId: c.product.id,
        name: c.product.name,
        price: c.product.price,
        quantity: c.qty,
      }));
      await createOrder({
        tableId: menuModal.id,
        clientName: menuModal.clientName,
        items,
        total: cartTotal,
      });
      setMenuModal(null);
      setCart([]);
      setFeedbackModal("pedido");
      setTimeout(() => {
        setFeedbackModal(null);
        loadAll();
      }, 2000);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEdit = (order, table) => {
    const preCart = order.items.map((item) => {
      const product = products.find((p) => p.id === item.productId) || {
        id: item.productId,
        name: item.name,
        price: item.price,
      };
      return { product, qty: item.quantity };
    });
    setCart(preCart);
    setEditModal({ order, table });
    setOrderModal(null);
  };

  const handleSaveEdit = async () => {
    if (!cart.length || !editModal) return;
    setLoading(true);
    try {
      const items = cart.map((c) => ({
        productId: c.product.id,
        name: c.product.name,
        price: c.product.price,
        quantity: c.qty,
      }));
      await updateOrder(editModal.order.id, { items, total: cartTotal });
      setEditModal(null);
      setCart([]);
      setFeedbackModal("editado");
      setTimeout(() => {
        setFeedbackModal(null);
        loadAll();
      }, 2000);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isDelivery = (table) => table.status === "DELIVERY";

  return (
      <div className="home-page">
        <div className="tables-grid">
          {filtered.map((table) => (
              <div key={table.id} className="table-wrapper">
                {isDelivery(table) ? (
                    <DeliveryIcon
                        status={table.status}
                        clientName={table.clientName}
                        number={table.number}
                        onClick={() => handleTableClick(table)}
                    />
                ) : (
                    <TableIcon
                        status={table.status}
                        clientName={table.clientName}
                        number={table.number}
                        onClick={() => handleTableClick(table)}
                    />
                )}
                {table.status === "AVAILABLE" && (
                    <button
                        className="delete-table-btn"
                        title="Excluir mesa"
                        onClick={(e) => { e.stopPropagation(); setDeleteConfirm(table); }}
                    >
                      🗑
                    </button>
                )}
              </div>
          ))}
          {filtered.length === 0 && (
              <p className="tables-empty">Nenhuma mesa nesta categoria.</p>
          )}
        </div>

        <div className="tables-badge">
          {filtered.length}/{tables.length} mesas
        </div>

        <button className="add-delivery-fab" onClick={() => setAddDeliveryModal(true)} title="Novo delivery">
          🛵
        </button>

        <button className="merge-table-fab" onClick={() => setMergeModal(true)} title="Mesclar mesas">
          ⇄
        </button>

        <button className="add-table-fab" onClick={() => setAddTableModal(true)} title="Adicionar mesa">
          +
        </button>

        {/* Modal: Adicionar Mesa */}
        {addTableModal && (
            <Modal onClose={() => { setAddTableModal(false); setNewTableNum(""); }}>
              <p className="modal-title">Adicionar Mesa</p>
              <p className="modal-subtitle">Informe o número da mesa</p>
              <input
                  className="modal-input"
                  placeholder="Número da mesa"
                  type="number"
                  value={newTableNum}
                  onChange={(e) => setNewTableNum(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddTable()}
                  autoFocus
              />
              <div className="modal-actions">
                <button className="btn btn--gray btn--md" onClick={() => { setAddTableModal(false); setNewTableNum(""); }}>Cancelar</button>
                <button className="btn btn--primary btn--md" onClick={handleAddTable} disabled={loading}>{loading ? "..." : "Adicionar"}</button>
              </div>
            </Modal>
        )}

        
        {addDeliveryModal && (
            <Modal onClose={() => { setAddDeliveryModal(false); resetDeliveryFields(); }}>
              <p className="modal-title">🛵 Novo Delivery</p>
              <p className="modal-subtitle">Preencha os dados do pedido</p>

              <label className="modal-label">Nome do cliente *</label>
              <input
                  className="modal-input"
                  placeholder="Nome do cliente"
                  value={deliveryClientName}
                  onChange={(e) => setDeliveryClientName(e.target.value)}
                  autoFocus
              />

              <label className="modal-label" style={{ marginTop: 10 }}>Telefone</label>
              <input
                  className="modal-input"
                  placeholder="(00) 00000-0000"
                  type="tel"
                  value={deliveryPhone}
                  onChange={(e) => setDeliveryPhone(e.target.value)}
              />

              <label className="modal-label" style={{ marginTop: 10 }}>Endereço de entrega</label>
              <input
                  className="modal-input"
                  placeholder="Rua, número, bairro..."
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
              />

              <label className="modal-label" style={{ marginTop: 10 }}>Taxa de entrega (R$)</label>
              <input
                  className="modal-input"
                  placeholder="0,00"
                  type="number"
                  min="0"
                  step="0.01"
                  value={deliveryFee}
                  onChange={(e) => setDeliveryFee(e.target.value)}
              />

              <label className="modal-label" style={{ marginTop: 10 }}>Status do delivery</label>
              <div className="delivery-status-group">
                {Object.entries(DELIVERY_STATUS_LABELS).map(([key, label]) => (
                    <button
                        key={key}
                        type="button"
                        className={`delivery-status-btn${deliveryStatus === key ? " delivery-status-btn--active" : ""}`}
                        onClick={() => setDeliveryStatus(key)}
                    >
                      {label}
                    </button>
                ))}
              </div>

              <label className="modal-label" style={{ marginTop: 10 }}>Observações</label>
              <textarea
                  className="modal-input modal-textarea"
                  placeholder="Sem cebola, alergia a amendoim..."
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  rows={3}
              />

              <div className="modal-actions">
                <button className="btn btn--gray btn--md" onClick={() => { setAddDeliveryModal(false); resetDeliveryFields(); }}>Cancelar</button>
                <button className="btn btn--primary btn--md" onClick={handleAddDelivery} disabled={loading}>{loading ? "..." : "Criar delivery"}</button>
              </div>
            </Modal>
        )}

        
        {openTableModal && (
            <Modal onClose={() => { setOpenTableModal(null); setClientName(""); }}>
              <p className="modal-title">Abrir Mesa {openTableModal.number}</p>
              <p className="modal-subtitle">Informe o nome do cliente</p>
              <input
                  className="modal-input"
                  placeholder="Nome do cliente"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleOpenTable()}
                  autoFocus
              />
              <div className="modal-actions">
                <button className="btn btn--gray btn--md" onClick={() => setOpenTableModal(null)}>Cancelar</button>
                <button className="btn btn--primary btn--md" onClick={handleOpenTable} disabled={loading}>{loading ? "..." : "Abrir mesa"}</button>
              </div>
            </Modal>
        )}

        {/* Modal: Mesclar Mesas */}
        {mergeModal && (
            <Modal onClose={() => { setMergeModal(false); setMergeSource(""); setMergeTarget(""); }}>
              <p className="modal-title">⇄ Mesclar Mesas</p>
              <p className="modal-subtitle">Os pedidos da mesa origem serão movidos para a mesa destino.</p>

              <label className="modal-label">Mesa origem</label>
              <select
                  className="modal-input"
                  value={mergeSource}
                  onChange={(e) => setMergeSource(e.target.value)}
              >
                <option value="">Selecione...</option>
                {tables
                    .filter((t) => t.status === "IN_PROGRESS")
                    .map((t) => (
                        <option key={t.id} value={t.id}>
                          Mesa {t.number} — {t.clientName}
                        </option>
                    ))}
              </select>

              <label className="modal-label" style={{ marginTop: 10 }}>Mesa destino</label>
              <select
                  className="modal-input"
                  value={mergeTarget}
                  onChange={(e) => setMergeTarget(e.target.value)}
              >
                <option value="">Selecione...</option>
                {tables
                    .filter((t) => t.status === "IN_PROGRESS" && t.id !== mergeSource)
                    .map((t) => (
                        <option key={t.id} value={t.id}>
                          Mesa {t.number} — {t.clientName}
                        </option>
                    ))}
              </select>

              <div className="modal-actions">
                <button className="btn btn--gray btn--md" onClick={() => { setMergeModal(false); setMergeSource(""); setMergeTarget(""); }}>Cancelar</button>
                <button
                    className="btn btn--primary btn--md"
                    onClick={handleMergeTables}
                    disabled={loading || !mergeSource || !mergeTarget}
                >
                  {loading ? "..." : "Mesclar"}
                </button>
              </div>
            </Modal>
        )}

 
        {orderModal && (
            <Modal onClose={() => setOrderModal(null)}>
              <p className="modal-title">
                {isDelivery(orderModal.table) ? "🛵 Delivery" : `Mesa ${orderModal.table.number}`}
              </p>
              <p className="modal-subtitle">Cliente: {orderModal.table.clientName}</p>

              {/* Delivery info block */}
              {isDelivery(orderModal.table) && (
                  <div className="delivery-info-block">
                    {orderModal.table.phone && (
                        <div className="delivery-info-row">
                          <span className="delivery-info-label">📞 Telefone</span>
                          <span className="delivery-info-value">{orderModal.table.phone}</span>
                        </div>
                    )}
                    {orderModal.table.address && (
                        <div className="delivery-info-row">
                          <span className="delivery-info-label">📍 Endereço</span>
                          <span className="delivery-info-value">{orderModal.table.address}</span>
                        </div>
                    )}
                    {orderModal.table.fee > 0 && (
                        <div className="delivery-info-row">
                          <span className="delivery-info-label">💰 Taxa</span>
                          <span className="delivery-info-value">R$ {parseFloat(orderModal.table.fee).toFixed(2)}</span>
                        </div>
                    )}
                    {orderModal.table.notes && (
                        <div className="delivery-info-row">
                          <span className="delivery-info-label">📝 Obs.</span>
                          <span className="delivery-info-value">{orderModal.table.notes}</span>
                        </div>
                    )}

                    {/* Status editor */}
                    <div className="delivery-status-editor">
                      <span className="delivery-info-label" style={{ marginBottom: 6, display: "block" }}>Status do delivery</span>
                      <div className="delivery-status-group">
                        {Object.entries(DELIVERY_STATUS_LABELS).map(([key, label]) => (
                            <button
                                key={key}
                                type="button"
                                className={`delivery-status-btn${deliveryStatusEdit === key ? " delivery-status-btn--active" : ""}`}
                                onClick={() => setDeliveryStatusEdit(key)}
                            >
                              {label}
                            </button>
                        ))}
                      </div>
                      {deliveryStatusEdit !== (orderModal.table.deliveryStatus || "WAITING") && (
                          <button
                              className="btn btn--primary btn--sm delivery-status-save"
                              onClick={handleUpdateDeliveryStatus}
                              disabled={loading}
                          >
                            {loading ? "..." : "Salvar status"}
                          </button>
                      )}
                    </div>
                  </div>
              )}

              {orderModal.order && orderModal.order.items?.length > 0 && (
                  <div className="order-items">
                    {orderModal.order.items.map((item, i) => (
                        <div key={i} className="order-item">
                          <span className="order-item__name">{item.name}</span>
                          <span className="order-item__qty">x{item.quantity}</span>
                          <span className="order-item__price">R$ {(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    ))}
                    <div className="order-total">
                      <span>Subtotal</span>
                      <span>R$ {orderModal.order.total?.toFixed(2)}</span>
                    </div>
                    {isDelivery(orderModal.table) && orderModal.table.fee > 0 && (
                        <div className="order-total order-total--fee">
                          <span>Taxa de entrega</span>
                          <span>R$ {parseFloat(orderModal.table.fee).toFixed(2)}</span>
                        </div>
                    )}
                    {isDelivery(orderModal.table) && orderModal.table.fee > 0 && (
                        <div className="order-total order-total--grand">
                          <span>Total geral</span>
                          <span>R$ {(orderModal.order.total + parseFloat(orderModal.table.fee || 0)).toFixed(2)}</span>
                        </div>
                    )}
                  </div>
              )}

              <div className="modal-actions">
                {!orderModal.order && (
                    <>
                      <button className="btn btn--gray btn--md" onClick={() => handleFreeTable(orderModal.table.id)}>
                        {isDelivery(orderModal.table) ? "Cancelar delivery" : "Liberar mesa"}
                      </button>
                      <button className="btn btn--primary btn--md" onClick={() => { setMenuModal(orderModal.table); setOrderModal(null); setCart([]); }}>
                        Fazer pedido
                      </button>
                    </>
                )}
                {orderModal.order && (
                    <>
                      <button className="btn btn--gray btn--md" onClick={() => handleOpenEdit(orderModal.order, orderModal.table)}>Editar pedido</button>
                      <button className="btn btn--danger btn--md" onClick={() => setCancelConfirm(orderModal.order.id)}>Cancelar pedido</button>
                      <button className="btn btn--green btn--md" onClick={() => handlePay(orderModal.order.id, orderModal.table)}>Pagar</button>
                    </>
                )}
              </div>
            </Modal>
        )}


        {menuModal && (
            <Modal onClose={() => { setMenuModal(null); setCart([]); }}>
              <p className="modal-title">
                {isDelivery(menuModal) ? "🛵 Cardápio — Delivery" : `Cardápio — Mesa ${menuModal.number}`}
              </p>
              <p className="modal-subtitle">Cliente: {menuModal.clientName}</p>
              <div className="menu-list">
                {products.map((product) => (
                    <div key={product.id} className="menu-item">
                      <div className="menu-item__info">
                        {product.image && <img className="menu-item__img" src={product.image} alt={product.name} />}
                        <div className="menu-item__text">
                          <span className="menu-item__name">{product.name}</span>
                          <span className="menu-item__price">R$ {product.price?.toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="menu-item__controls">
                        <button className="qty-btn" onClick={() => removeFromCart(product.id)} disabled={cartQty(product.id) === 0}>−</button>
                        <span className="qty-value">{cartQty(product.id)}</span>
                        <button className="qty-btn" onClick={() => addToCart(product)}>+</button>
                      </div>
                    </div>
                ))}
              </div>
              {cartCount > 0 && (
                  <div className="cart-summary">{cartCount} {cartCount === 1 ? "item" : "itens"} · R$ {cartTotal.toFixed(2)}</div>
              )}
              <div className="modal-actions">
                <button className="btn btn--gray btn--md" onClick={() => { setMenuModal(null); setCart([]); }}>Cancelar</button>
                <button className="btn btn--primary btn--md" onClick={handleSubmitOrder} disabled={loading || !cartCount}>{loading ? "..." : "Confirmar pedido"}</button>
              </div>
            </Modal>
        )}

   
        {editModal && (
            <Modal onClose={() => { setEditModal(null); setCart([]); }}>
              <p className="modal-title">
                {isDelivery(editModal.table) ? "🛵 Editar Pedido — Delivery" : `Editar Pedido — Mesa ${editModal.table.number}`}
              </p>
              <p className="modal-subtitle">Cliente: {editModal.table.clientName}</p>
              <div className="menu-list">
                {products.map((product) => (
                    <div key={product.id} className="menu-item">
                      <div className="menu-item__info">
                        {product.image && <img className="menu-item__img" src={product.image} alt={product.name} />}
                        <div className="menu-item__text">
                          <span className="menu-item__name">{product.name}</span>
                          <span className="menu-item__price">R$ {product.price?.toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="menu-item__controls">
                        <button className="qty-btn" onClick={() => removeFromCart(product.id)} disabled={cartQty(product.id) === 0}>−</button>
                        <span className="qty-value">{cartQty(product.id)}</span>
                        <button className="qty-btn" onClick={() => addToCart(product)}>+</button>
                      </div>
                    </div>
                ))}
              </div>
              {cartCount > 0 && (
                  <div className="cart-summary">{cartCount} {cartCount === 1 ? "item" : "itens"} · R$ {cartTotal.toFixed(2)}</div>
              )}
              <div className="modal-actions">
                <button className="btn btn--gray btn--md" onClick={() => { setEditModal(null); setCart([]); }}>Cancelar</button>
                <button className="btn btn--primary btn--md" onClick={handleSaveEdit} disabled={loading || !cartCount}>{loading ? "..." : "Salvar alterações"}</button>
              </div>
            </Modal>
        )}

     
        {cancelConfirm && (
            <Modal onClose={() => setCancelConfirm(null)}>
              <p className="modal-title">Cancelar pedido?</p>
              <div className="modal-actions">
                <button className="btn btn--gray btn--md" onClick={() => setCancelConfirm(null)}>Voltar</button>
                <button className="btn btn--danger btn--md" onClick={handleCancelConfirmed} disabled={loading}>{loading ? "..." : "Confirmar cancelamento"}</button>
              </div>
            </Modal>
        )}

        {/* Modal: Confirmar Exclusão */}
        {deleteConfirm && (
            <Modal onClose={() => setDeleteConfirm(null)}>
              <p className="modal-title">Excluir Mesa {deleteConfirm.number}?</p>
              <div className="modal-actions">
                <button className="btn btn--gray btn--md" onClick={() => setDeleteConfirm(null)}>Voltar</button>
                <button className="btn btn--danger btn--md" onClick={handleDeleteConfirmed}>Excluir mesa</button>
              </div>
            </Modal>
        )}

      
        {feedbackModal && (
            <Modal>
              <div className="feedback-modal">
            <span className="feedback-modal__icon">
              {feedbackModal === "cancelado" ? "❌"
                  : feedbackModal === "pago" ? "✅"
                      : feedbackModal === "editado" ? "✏️"
                          : feedbackModal === "mesclado" ? "🔀"
                              : feedbackModal === "status" ? "🛵"
                                  : "🎉"}
            </span>
                <p className="modal-title">
                  {feedbackModal === "cancelado" ? "Pedido cancelado!"
                      : feedbackModal === "pago" ? "Pagamento realizado!"
                          : feedbackModal === "editado" ? "Pedido atualizado!"
                              : feedbackModal === "mesclado" ? "Mesas mescladas!"
                                  : feedbackModal === "status" ? "Status atualizado!"
                                      : "Pedido criado!"}
                </p>
                <button className="btn btn--green btn--md" onClick={() => setFeedbackModal(null)}>Confirmar</button>
              </div>
            </Modal>
        )}
      </div>
  );
}