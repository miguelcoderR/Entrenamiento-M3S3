// Base URL for all product-related API requests

const BASE_URL = "http://localhost:3000/products";


export async function getProducts() {
  // Perform GET request to retrieve the full list of products

  const res = await fetch(BASE_URL);
  // If the response is not in the 200–299 range, throw an error
  if (!res.ok) throw new Error("Error fetching products");
  // Parse and return the JSON response body

  return res.json();
}

export async function createProduct(product) {
  // Perform POST request to create a new product

  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // Serialize the product object into a JSON string

    body: JSON.stringify(product),
  });
  // Throw an error if the creation fails

  if (!res.ok) throw new Error("Error creating product");
  
  // Return the newly created product object

  return res.json();
}

export async function updateProduct(id, updates) {
  // Perform PUT request to update an existing product by ID

  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    // Serialize only the fields that need updating

    body: JSON.stringify(updates),
  });
  // Throw an error if the update fails

  if (!res.ok) throw new Error("Error updating product");
  // Return the updated product object

  return res.json();
}

export async function deleteProduct(id) {
  // Perform DELETE request to remove a product by ID

  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
  // Throw an error if the deletion fails

  if (!res.ok) throw new Error("Error deleting product");
  // Return true on successful deletion

  return true;
}