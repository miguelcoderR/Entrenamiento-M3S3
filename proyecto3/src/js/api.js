const BASE_URL = "http://localhost:3000/products";


export async function getProducts() {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error("Error fetching products");
  return res.json();
}

export async function createProduct(product) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  if (!res.ok) throw new Error("Error creating product");
  return res.json();
}

export async function updateProduct(id, updates) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error("Error updating product");
  return res.json();
}

export async function deleteProduct(id) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Error deleting product");
  return true;
}