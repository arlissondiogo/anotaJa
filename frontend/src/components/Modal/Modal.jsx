import './Modal.css'

export default function Modal({ children, onClose, borderColor }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card"
        style={borderColor ? { border: `2px solid ${borderColor}` } : {}}
        onClick={e => e.stopPropagation()}
      >
        {onClose && (
          <button className="modal-close" onClick={onClose} aria-label="Fechar">✕</button>
        )}
        {children}
      </div>
    </div>
  )
}
