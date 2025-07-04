import "../css/style.css";

import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct as apiDelete,
} from "./api.js";

const form = document.getElementById("product-form");
const results = document.getElementById("results");

form.addEventListener("submit", handleAdd);
document.addEventListener("DOMContentLoaded", loadProducts);

async function loadProducts() {
  try {
    const products = await getProducts();
    render(products);
  } catch (err) {
    console.error(err);
  }
}

function render(products) {
  results.innerHTML = "<h3>📦 Registered products</h3>";
  products.forEach((p) => {
    const div = document.createElement("div");
    div.className = "product";
    div.innerHTML = `
      <strong>${p.name}</strong><br>
      Price: $${p.price}<br>
      Quantity: ${p.quantity}<br>
      <button data-id="${p.id}" class="edit-btn">✏️ Edit</button>
      <button data-id="${p.id}" class="delete-btn">🗑️ Delete</button>
    `;
    results.append(div);
  });

  // Vinculamos botones
  results.querySelectorAll(".edit-btn").forEach((btn) =>
    btn.addEventListener("click", handleEdit)
  );
  results.querySelectorAll(".delete-btn").forEach((btn) =>
    btn.addEventListener("click", handleDelete)
  );
}

async function handleAdd(e) {
  e.preventDefault();
  const name = form.name.value.trim();
  const price = parseFloat(form.price.value);
  const quantity = parseInt(form.quantity.value);

  if (!name || isNaN(price) || isNaN(quantity) || price < 0 || quantity < 0) {
    return alert("Por favor, completa correctamente todos los campos.");
  }

  try {
    const products = await getProducts();
    if (products.some((p) => p.name.toLowerCase() === name.toLowerCase())) {
      return alert("This product already exists. Duplicates are not allowed.");
    }
    await createProduct({ name, price, quantity });
    form.reset();
    loadProducts();
  } catch (err) {
    console.error(err);
  }
}

async function handleEdit(e) {
  const id = e.target.dataset.id;
  try {
    const products = await getProducts();
    const p = products.find((prod) => prod.id == id);
    const newName = prompt("New name:", p.name);
    const newPrice = parseFloat(prompt("New price:", p.price));
    const newQuantity = parseInt(prompt("New quantity:", p.quantity));

    if (
      !newName ||
      isNaN(newPrice) ||
      newPrice < 0 ||
      isNaN(newQuantity) ||
      newQuantity < 0
    ) {
      return alert("Invalid values.");
    }

    if (
      products.some(
        (prod) =>
          prod.name.toLowerCase() === newName.toLowerCase() && prod.id != id
      )
    ) {
      return alert("There is already a product with that name.");
    }

    await updateProduct(id, {
      name: newName,
      price: newPrice,
      quantity: newQuantity,
    });
    loadProducts();
  } catch (err) {
    console.error(err);
  }
}

async function handleDelete(e) {
  const id = e.target.dataset.id;
  if (!confirm("¿Are you sure you want to delete this product?")) return;

  try {
    await apiDelete(id);
    loadProducts();
  } catch (err) {
    console.error(err);
  }
}