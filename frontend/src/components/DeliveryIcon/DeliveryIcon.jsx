import "./DeliveryIcon.css";

export default function DeliveryIcon({ status, clientName, number, onClick }) {
  const isOccupied = status === "IN_PROGRESS" || status === "DELIVERY";

  return (
    <div
      className="delivery-icon"
      onClick={onClick}
      title={clientName || `Delivery ${number}`}
    >
      <svg
        className={`delivery-icon__svg ${isOccupied ? "delivery-icon__svg--occupied" : ""}`}
        width="72"
        height="72"
        viewBox="0 0 80 80"
      >
        <rect x="16" y="30" width="48" height="22" rx="6" fill="#C8956A" />

        <path
          d="M28 30 Q40 18 52 30"
          stroke="#A06840"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />

        <circle cx="22" cy="54" r="7" fill="#A06840" />
        <circle cx="22" cy="54" r="3" fill="#E8C547" />

        <circle cx="58" cy="54" r="7" fill="#A06840" />
        <circle cx="58" cy="54" r="3" fill="#E8C547" />

        {isOccupied && (
          <>
            <line
              x1="26"
              y1="33"
              x2="54"
              y2="49"
              stroke="#E05A3A"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <line
              x1="54"
              y1="33"
              x2="26"
              y2="49"
              stroke="#E05A3A"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </>
        )}
        <circle cx="40" cy="14" r="9" fill="#E8C547" />
        <line
          x1="40"
          y1="9"
          x2="40"
          y2="19"
          stroke="#fff"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <line
          x1="35"
          y1="14"
          x2="45"
          y2="14"
          stroke="#fff"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>

      <div className="delivery-icon__label">
        {clientName ? (
          <>
            <span className="delivery-icon__client">{clientName}</span>
            <span className="delivery-icon__number">Delivery {number}</span>
          </>
        ) : (
          <span className="delivery-icon__number">Delivery {number}</span>
        )}
      </div>
    </div>
  );
}
