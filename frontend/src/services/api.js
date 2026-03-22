const BASE_URL = "http://localhost:8080";

const getToken = () => sessionStorage.getItem("token");

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

export function getRole() {
  const token = getToken();
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role;
  } catch {
    return null;
  }
}

export function getUserInfo() {
  const token = getToken();
  if (!token) return null;
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

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

export async function getMe() {
  const res = await fetch(`${BASE_URL}/users/me`, { headers: authHeaders() });
  if (!res.ok) throw new Error("Erro ao buscar perfil");
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
      { method: "POST", headers: authHeaders() }
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

export async function mergeTables(sourceTableId, targetTableId) {
  const res = await fetch(`${BASE_URL}/tables/merge`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ sourceTableId, targetTableId }),
  });
  if (!res.ok) throw new Error("Erro ao mesclar mesas");
}

export async function openDelivery(id, clientName, { address, phone, fee, notes, deliveryStatus } = {}) {
  const res = await fetch(
      `${BASE_URL}/tables/${id}/open-delivery?clientName=${encodeURIComponent(clientName)}`,
      {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ address, phone, fee, notes, deliveryStatus }),
      }
  );
  if (!res.ok) throw new Error("Erro ao abrir delivery");
  return res.json();
}

export async function updateDeliveryStatus(id, deliveryStatus) {
  const res = await fetch(
      `${BASE_URL}/tables/${id}/delivery-status?deliveryStatus=${encodeURIComponent(deliveryStatus)}`,
      {
        method: "PATCH",
        headers: authHeaders(),
      }
  );
  if (!res.ok) throw new Error("Erro ao atualizar status do delivery");
  return res.json();
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
  if (!res.ok) return null;
  if (!text) return null;
  return JSON.parse(text);
}

export async function getOrdersRecentes() {
  const res = await fetch(`${BASE_URL}/orders/recentes`, { headers: authHeaders() });
  if (!res.ok) throw new Error("Erro ao buscar pedidos recentes");
  return res.json();
}

export async function getOrdersCancelados() {
  const res = await fetch(`${BASE_URL}/orders/cancelados`, { headers: authHeaders() });
  if (!res.ok) throw new Error("Erro ao buscar pedidos cancelados");
  return res.json();
}

export async function getOrdersFinalizados() {
  const res = await fetch(`${BASE_URL}/orders/finalizados`, { headers: authHeaders() });
  if (!res.ok) throw new Error("Erro ao buscar pedidos finalizados");
  return res.json();
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

export async function getEmployees() {
  const res = await fetch(`${BASE_URL}/employees`, { headers: authHeaders() });
  if (!res.ok) throw new Error("Erro ao buscar funcionários");
  return res.json();
}

export async function createEmployee(data) {
  const res = await fetch(`${BASE_URL}/employees`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erro ao criar funcionário");
  return res.json();
}

export async function deleteEmployee(id) {
  const res = await fetch(`${BASE_URL}/employees/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Erro ao remover funcionário");
}