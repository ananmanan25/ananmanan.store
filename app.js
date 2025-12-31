import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDd8vDYrTN5vJDq1354fSqIc1Xng2-40nQ",
  authDomain: "ananmanan-store-cc2d3.firebaseapp.com",
  projectId: "ananmanan-store-cc2d3",
  storageBucket: "ananmanan-store-cc2d3.firebasestorage.app",
  messagingSenderId: "10923491414",
  appId: "1:10923491414:web:a9dc65f35cf4fb0af73bf7",
  measurementId: "G-M3MHCXXRHP"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const products = [
  { id:1, name:"Luxury Jacket", price:120 },
  { id:2, name:"Premium Shirt", price:80 },
  { id:3, name:"Designer Jeans", price:100 }
];

let cart = [];

const productBox = document.getElementById("products");

products.forEach(p => {
  const d = document.createElement("div");
  d.className = "card";
  d.innerHTML = `
    <h3>${p.name}</h3>
    <p>$${p.price}</p>
    <button onclick="addToCart(${p.id})">Add</button>
  `;
  productBox.appendChild(d);
});

window.addToCart = id => {
  cart.push(products.find(p => p.id === id));
  renderCart();
};

function renderCart() {
  const c = document.getElementById("cart");
  c.innerHTML = "";
  cart.forEach(i => c.innerHTML += `${i.name} - $${i.price}<br>`);
}

window.submitOrder = async method => {
  const order = {
    name: name.value,
    email: email.value,
    phone: phone.value,
    address: address.value,
    items: cart,
    payment: method,
    time: new Date().toISOString()
  };

  await addDoc(collection(db, "orders"), order);
  alert("Order sent. Receipt will arrive by email.");
  cart = [];
  renderCart();
};

window.payCard = () => {
  window.location.href = "https://YOUR-PAYMENT-LINK-HERE";
};
