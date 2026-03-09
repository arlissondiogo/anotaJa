import './ProductCard.css'

export default function ProductCard({ product, quantity, onAdd, onEdit, onDelete }) {
  return (
    <div className="product-card">
      <div className="product-card__img-wrap">
        {product.image
          ? <img src={product.image} alt={product.name} className="product-card__img" onError={e => { e.target.style.display='none' }} />
          : <span className="product-card__img-placeholder">🍽️</span>
        }
      </div>
      <div className="product-card__info">
        <p className="product-card__name">{product.name}</p>
        {product.description && <p className="product-card__desc">{product.description}</p>}
        <p className="product-card__price">R$ {product.price?.toFixed(2)}</p>
      </div>
      <div className="product-card__actions">
        {quantity > 0 && (
          <span className="product-card__qty">{quantity}</span>
        )}
        {onAdd && (
          <button className="btn btn--primary btn--sm" onClick={() => onAdd(product)}>
            Adicionar
          </button>
        )}
        {onEdit && (
          <button className="btn btn--outline btn--sm" onClick={() => onEdit(product)}>
            Editar
          </button>
        )}
        {onDelete && (
          <button className="btn btn--danger btn--sm" onClick={() => onDelete(product.id)}>
            Excluir
          </button>
        )}
      </div>
    </div>
  )
}
