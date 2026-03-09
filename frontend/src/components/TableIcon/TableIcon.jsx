import "./TableIcon.css";

export default function TableIcon({ status, clientName, number, onClick }) {
  const isOccupied = status === "IN_PROGRESS" || status === "DELIVERY";

  return (
    <div
      className="table-icon"
      onClick={onClick}
      title={clientName || `Mesa ${number}`}
    >
      <svg
        className={`table-icon__svg ${isOccupied ? "table-icon__svg--occupied" : ""}`}
        width="72"
        height="72"
        viewBox="0 0 80 80"
      >
        <ellipse cx="40" cy="26" rx="28" ry="10" fill="#C8956A" />
        <rect x="12" y="26" width="56" height="6" fill="#C8956A" rx="2" />
        <line
          x1="22"
          y1="32"
          x2="14"
          y2="60"
          stroke="#A06840"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <line
          x1="58"
          y1="32"
          x2="66"
          y2="60"
          stroke="#A06840"
          strokeWidth="5"
          strokeLinecap="round"
        />
        {isOccupied && (
          <>
            <line
              x1="20"
              y1="42"
              x2="60"
              y2="66"
              stroke="#E05A3A"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <line
              x1="60"
              y1="42"
              x2="20"
              y2="66"
              stroke="#E05A3A"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </>
        )}
        <circle cx="40" cy="12" r="9" fill="#E8C547" />
        <line
          x1="40"
          y1="7"
          x2="40"
          y2="17"
          stroke="#fff"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <line
          x1="35"
          y1="12"
          x2="45"
          y2="12"
          stroke="#fff"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>

      <div className="table-icon__label">
        {clientName ? (
          <>
            <span className="table-icon__client">{clientName}</span>
            <span className="table-icon__number">Mesa {number}</span>
          </>
        ) : (
          <span className="table-icon__number">Mesa {number}</span>
        )}
      </div>
    </div>
  );
}
