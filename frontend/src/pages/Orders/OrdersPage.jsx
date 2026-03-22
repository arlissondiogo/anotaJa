import { useState, useEffect, useCallback } from "react";
import Modal from "../../components/Modal/Modal";
import {
  getOrdersRecentes,
  getOrdersCancelados,
  getOrdersFinalizados,
} from "../../services/api";
import "./OrdersPage.css";
import "../../components/Modal/Modal.css";

const FILTER_CONFIG = {
  recent:   { label: "Pedidos Recentes",    fetch: getOrdersRecentes },
  canceled: { label: "Pedidos Cancelados",  fetch: getOrdersCancelados },
  finished: { label: "Pedidos Finalizados", fetch: getOrdersFinalizados },
};

const statusColor = (order) => {
  if (order?.canceled) return "#E05A3A";
  if (order?.paid)     return "#4CAF50";
  return "#E8C547";
};

const statusLabel = (order) => {
  if (order?.canceled) return "Cancelado";
  if (order?.paid)     return "Pago";
  return "Em aberto";
};

export default function OrdersPage({ filter }) {
  const [orders, setOrders] = useState([]);
  const [selected, setSelected] = useState(null);
  const config = FILTER_CONFIG[filter];

  const load = useCallback(async () => {
    try {
      const data = await config.fetch();
      setOrders(data);
    } catch (err) {
      console.error(err.message);
    }
  }, [filter]);

  useEffect(() => {
    load();
  }, [load]);

  return (
      <div className="orders-page">
        <h2 className="orders-title">{config.label}</h2>

        <div className="orders-grid">
          {orders.map((order) => (
              <div
                  key={order.id}
                  className="order-card"
                  style={{ borderColor: statusColor(order) }}
                  onClick={() => setSelected(order)}
              >
                <span className="order-card__icon">📋</span>
                <p className="order-card__id">#{order.id?.slice(-4)}</p>
                <p className="order-card__client">{order.clientName}</p>
                <span
                    className="order-card__status"
                    style={{ color: statusColor(order) }}
                >
              {statusLabel(order)}
            </span>
                <p className="order-card__total">
                  R$ {order.total?.toFixed(2)}
                </p>
              </div>
          ))}
          {orders.length === 0 && (
              <p className="orders-empty">Nenhum pedido encontrado.</p>
          )}
        </div>

        {selected && (
            <Modal onClose={() => setSelected(null)}>
              <p className="modal-title">
                Pedido #{selected.id?.slice(-4)}
              </p>
              <p className="modal-subtitle">Cliente: {selected.clientName}</p>

              <div className="order-items">
                {selected.items?.map((item, i) => (
                    <div key={i} className="order-item">
                      <span className="order-item__name">{item.name}</span>
                      <span className="order-item__qty">x{item.quantity}</span>
                      <span className="order-item__price">
                  R$ {(item.price * item.quantity).toFixed(2)}
                </span>
                    </div>
                ))}
                <div className="order-total">
                  Total: R$ {selected.total?.toFixed(2)}
                </div>
              </div>

              <div
                  className="order-status-badge"
                  style={{
                    background: statusColor(selected) + "22",
                    color: statusColor(selected),
                    padding: "6px 14px",
                    borderRadius: "20px",
                    fontWeight: 800,
                    fontSize: 13,
                    display: "inline-block",
                    marginTop: 12,
                  }}
              >
                {statusLabel(selected)}
              </div>
            </Modal>
        )}
      </div>
  );
}