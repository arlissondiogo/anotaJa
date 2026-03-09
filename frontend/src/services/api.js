const BASE_URL = "http://localhost:8080";

const getToken = () => localStorage.getItem("token");

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

export async function login(email, password) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Email ou senha incorretos");
  return res.json();
}

export async function registerUser(data) {
  const res = await fetch(`${BASE_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erro ao criar conta. Email já em uso?");
  return res.json();
}

export async function getTables() {
  const res = await fetch(`${BASE_URL}/tables`, { headers: authHeaders() });
  if (!res.ok) throw new Error("Erro ao buscar mesas");
  return res.json();
}

export async function createTable(number) {
  const res = await fetch(`${BASE_URL}/tables`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ number }),
  });
  if (!res.ok) throw new Error("Erro ao criar mesa");
  return res.json();
}

export async function openTable(id, clientName) {
  const res = await fetch(
    `${BASE_URL}/tables/${id}/open?clientName=${encodeURIComponent(clientName)}`,
    {
      method: "POST",
      headers: authHeaders(),
    },
  );
  if (!res.ok) throw new Error("Erro ao abrir mesa");
  return res.json();
}

export async function closeTable(id) {
  const res = await fetch(`${BASE_URL}/tables/${id}/close`, {
    method: "POST",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Erro ao fechar mesa");
  return res.json();
}

export async function deleteTable(id) {
  const res = await fetch(`${BASE_URL}/tables/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Erro ao excluir mesa");
}

export async function getProducts() {
  const res = await fetch(`${BASE_URL}/products`, { headers: authHeaders() });
  if (!res.ok) throw new Error("Erro ao buscar produtos");
  return res.json();
}

export async function createProduct(data) {
  const res = await fetch(`${BASE_URL}/products`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erro ao criar produto");
  return res.json();
}

export async function updateProduct(id, data) {
  const res = await fetch(`${BASE_URL}/products/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erro ao atualizar produto");
  return res.json();
}

export async function deleteProduct(id) {
  const res = await fetch(`${BASE_URL}/products/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Erro ao excluir produto");
}

export async function getOrderByTable(tableId) {
  const res = await fetch(`${BASE_URL}/orders/table/${tableId}`, {
    headers: authHeaders(),
  });

  const text = await res.text();
  console.log("status:", res.status, "body:", text); // 👈

  if (!res.ok) return null;
  if (!text) return null;

  return JSON.parse(text);
}

export async function createOrder(data) {
  const res = await fetch(`${BASE_URL}/orders`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erro ao criar pedido");
  return res.json();
}

export async function updateOrder(id, data) {
  const res = await fetch(`${BASE_URL}/orders/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erro ao editar pedido");
  return res.json();
}

export async function payOrder(id) {
  const res = await fetch(`${BASE_URL}/orders/${id}/pay`, {
    method: "POST",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Erro ao pagar pedido");
  return res.json();
}

export async function cancelOrder(id) {
  const res = await fetch(`${BASE_URL}/orders/${id}/cancel`, {
    method: "POST",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Erro ao cancelar pedido");
  return res.json();
}
export async function openDelivery(id, clientName) {
  const res = await fetch(
    `${BASE_URL}/tables/${id}/open-delivery?clientName=${encodeURIComponent(clientName)}`,
    {
      method: "POST",
      headers: authHeaders(),
    },
  );
  if (!res.ok) throw new Error("Erro ao abrir delivery");
  return res.json();
}
