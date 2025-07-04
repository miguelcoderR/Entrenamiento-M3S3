//import "../css/style.css";

import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct as apiDelete,
} from "./api.js";

// 🔽 Grab DOM elements for form and product list container

const form = document.getElementById("product-form");
const results = document.getElementById("results");

// 🔽 Setup event listeners: submit form + load products when page loads

form.addEventListener("submit", handleAdd);
document.addEventListener("DOMContentLoaded", loadProducts);

// 🔄 Fetch products from server and render them

async function loadProducts() {
  try {
    const products = await getProducts();
    render(products);
  } catch (err) {
    console.error(err);
  }
}

// 🖼️ Render all products as visual cards + connect action buttons

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

  // 🔗 Attach edit and delete event listeners to each button


  results.querySelectorAll(".edit-btn").forEach((btn) =>
    btn.addEventListener("click", handleEdit)
  );
  results.querySelectorAll(".delete-btn").forEach((btn) =>
    btn.addEventListener("click", handleDelete)
  );
}

// ➕ Handle product creation: validate form and avoid duplicates

async function handleAdd(e) {
  e.preventDefault();
  const name = form.name.value.trim();
  const price = parseFloat(form.price.value);
  const quantity = parseInt(form.quantity.value);

   // 🧠 Basic input validation


  if (!name || isNaN(price) || isNaN(quantity) || price < 0 || quantity < 0) {
    return alert("Por favor, completa correctamente todos los campos.");
  }

  try {
    const products = await getProducts();
   
    // 🚫 Prevent duplicate product names (case insensitive)

   
    if (products.some((p) => p.name.toLowerCase() === name.toLowerCase())) {
      return alert("This product already exists. Duplicates are not allowed.");
    }
    await createProduct({ name, price, quantity }); // 📨 Send new product
 
    form.reset(); // 🧽 Clear form fields

    loadProducts();// 🔄 Refresh product list

  } catch (err) {
    console.error(err);
  }
}

// ✏️ Handle inline editing of a product


async function handleEdit(e) {
  const id = e.target.dataset.id;
  try {
    const products = await getProducts();
    const p = products.find((prod) => prod.id == id);
    
    // 🗨️ Prompt user for new values

    
    const newName = prompt("New name:", p.name);
    const newPrice = parseFloat(prompt("New price:", p.price));
    const newQuantity = parseInt(prompt("New quantity:", p.quantity));

    // 🧠 Validate edited values


    if (
      !newName ||
      isNaN(newPrice) ||
      newPrice < 0 ||
      isNaN(newQuantity) ||
      newQuantity < 0
    ) {
      return alert("Invalid values.");
    }

    // 🚫 Check for name conflict with other products


    if (
      products.some(
        (prod) =>
          prod.name.toLowerCase() === newName.toLowerCase() && prod.id != id
      )
    ) {
      return alert("There is already a product with that name.");
    }

    // 🔁 Update product with new values


    await updateProduct(id, {
      name: newName,
      price: newPrice,
      quantity: newQuantity,
    });
    loadProducts(); // 🔄 Re-render list

  } catch (err) {
    console.error(err);
  }
}

// 🗑️ Handle deletion of a product by ID


async function handleDelete(e) {
  const id = e.target.dataset.id;
  // ⚠️ Confirm before deleting

  if (!confirm("¿Are you sure you want to delete this product?")) return;

  try {
    await apiDelete(id); // 🧹 Send DELETE to server

    loadProducts(); // 🔄 Refresh product list

  } catch (err) {
    console.error(err);
  }
}