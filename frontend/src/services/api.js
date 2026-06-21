const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.MODE === 'production' ? '/api' : `http://${window.location.hostname}:5000/api`);

export const fetchProducts = async () => {
  const response = await fetch(`${API_URL}/products`);
  if (!response.ok) throw new Error('Failed to fetch products');
  return response.json();
};

export const fetchProductById = async (id) => {
  const response = await fetch(`${API_URL}/products/${id}`);
  if (!response.ok) throw new Error('Failed to fetch product');
  return response.json();
};

export const checkout = async (orderData) => {
  const response = await fetch(`${API_URL}/orders/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData),
  });
  if (!response.ok) throw new Error('Checkout failed');
  return response.json();
};

export const fetchOrderById = async (id) => {
  const response = await fetch(`${API_URL}/orders/${id}`);
  if (!response.ok) throw new Error('Failed to fetch order');
  return response.json();
};

// Admin Endpoints

export const fetchOrders = async () => {
  const response = await fetch(`${API_URL}/orders`);
  if (!response.ok) throw new Error('Failed to fetch orders');
  return response.json();
};

export const updateOrderStatus = async (id, status) => {
  const response = await fetch(`${API_URL}/orders/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) throw new Error('Failed to update order status');
  return response.json();
};

export const createProduct = async (productData) => {
  const response = await fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData),
  });
  if (!response.ok) throw new Error('Failed to create product');
  return response.json();
};

export const updateProduct = async (id, productData) => {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData),
  });
  if (!response.ok) throw new Error('Failed to update product');
  return response.json();
};

export const deleteProduct = async (id) => {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete product');
  return response.json();
};

export const deleteAllOrders = async () => {
  const response = await fetch(`${API_URL}/orders`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete orders');
  return response.json();
};
