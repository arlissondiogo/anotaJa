import { useState, useEffect, useCallback } from "react";
import Modal from "../../components/Modal/Modal";
import { getTables, getOrderByTable } from "../../services/api";
import "./OrdersPage.css";
import "../../components/Modal/Modal.css";

const FILTER_CONFIG = {
  recent: {
    label: "Pedidos Recentes",
    test: (o) => o && !o.paid && !o.canceled,
  },
  canceled: { label: "Pedidos Cancelados", test: (o) => o && o.canceled },
  finished: { label: "Pedidos Finalizados", test: (o) => o && o.paid },
};

export default function OrdersPage({ filter }) {
  const [entries, setEntries] = useState([]);
  const [selected, setSelected] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  const config = FILTER_CONFIG[filter];

  const load = useCallback(async () => {
    const tables = await getTables();
    const occupied = tables.filter((t) => t.status !== "AVAILABLE");
    const results = await Promise.all(
      occupied.map(async (t) => {
        const order = await getOrderByTable(t.id);
        return { order, table: t };
      }),
    );
    setEntries(results.filter((e) => config.test(e.order)));
  }, [filter, config]);

  useEffect(() => {
    load();
  }, [load]);

  const statusColor = (order) => {
    if (order?.canceled) return "#E05A3A";
    if (order?.paid) return "#4CAF50";
    return "#E8C547";
  };

  const statusLabel = (order) => {
    if (order?.canceled) return "Cancelado";
    if (order?.paid) return "Pago";
    return "Em aberto";
  };

  return (
    <div className="orders-page">
      <h2 className="orders-title">{config.label}</h2>

      <div className="orders-grid">
        {entries.map(({ order, table }) => (
          <div
            key={table.id}
            className="order-card"
            style={{ borderColor: statusColor(order) }}
            onClick={() => setSelected({ order, table })}
          >
            <span className="order-card__icon">📋</span>
            <p className="order-card__id">#{order?.id?.slice(-3)}</p>
            <p className="order-card__client">{table.clientName}</p>
            <p className="order-card__mesa">Mesa {table.number}</p>
            <span
              className="order-card__status"
              style={{ color: statusColor(order) }}
            >
              {statusLabel(order)}
            </span>
          </div>
        ))}
        {entries.length === 0 && (
          <p className="orders-empty">Nenhum pedido encontrado.</p>
        )}
      </div>

      {selected && (
        <Modal onClose={() => setSelected(null)} borderColor="#5CA8E0">
          <p className="modal-title">
            Pedido #{selected.order?.id?.slice(-3)} —{" "}
            {selected.table.clientName}
          </p>
          <p className="modal-subtitle">Mesa {selected.table.number}</p>

          <div className="order-items">
            {selected.order?.items?.map((item, i) => (
              <div key={i} className="order-item">
                <span>
                  {item.productName} ({item.quantity} un)
                </span>
                <span>R$ {(item.unitPrice * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="order-total">
              <span>Total</span>
              <span>R$ {selected.order?.total?.toFixed(2)}</span>
            </div>
          </div>

          <div
            className="order-status-badge"
            style={{
              background: statusColor(selected.order) + "22",
              color: statusColor(selected.order),
            }}
          >
            {statusLabel(selected.order)}
          </div>
        </Modal>
      )}
    </div>
  );
}
