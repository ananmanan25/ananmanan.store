const firebaseConfig = {
 apiKey: "AIzaSyDd8vDYrTN5vJDq1354fSqIc1Xng2-40nQ",
  authDomain: "ananmanan-store-cc2d3.firebaseapp.com",
  projectId: "ananmanan-store-cc2d3",
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
const products = [
 {id:1,name:"Black Luxury Sneaker",price:120,img:"https://images.unsplash.com/photo-1606813909255-c9f29aaacfd2"},
 {id:2,name:"White Classic Shoe",price:140,img:"https://images.unsplash.com/photo-1600185365483-26d7a4cc7519"},
 {id:3,name:"Street Runner",price:110,img:"https://images.unsplash.com/photo-1528701800489-20be0c8c3f59"},
];

const productBox=document.getElementById("products");
const cartBox=document.getElementById("cart");
let cart=[];

products.forEach(p=>{
 productBox.innerHTML+=`
  <div class="product">
   <img src="${p.img}">
   <h3>${p.name}</h3>
   <p>$${p.price}</p>
   <button onclick="addToCart(${p.id})">Add to Cart</button>
  </div>
 `
})

function toggleCart(){cartBox.classList.toggle("open")}

function addToCart(id){
 const p=products.find(x=>x.id===id)
 cart.push(p)
 renderCart()
}

function renderCart(){
 document.getElementById("cart-items").innerHTML=""
 let total=0
 cart.forEach(p=>{
  total+=p.price
  document.getElementById("cart-items").innerHTML+=`
   <p>${p.name} - $${p.price}</p>
  `
 })
 document.getElementById("total").innerText=total
 document.getElementById("cart-count").innerText=cart.length
}

function checkout(){
 alert("Checkout coming in Phase 2")
}
function openCheckout(){
 document.getElementById("checkoutPage").style.display="flex"
}

function closeCheckout(){
 document.getElementById("checkoutPage").style.display="none"
}

function placeOrder(){
 const order={
  name:document.getElementById("name").value,
  email:document.getElementById("email").value,
  phone:document.getElementById("phone").value,
  address:document.getElementById("address").value,
  payment:document.getElementById("paymentMethod").value,
  items:cart,
  total:cart.reduce((s,p)=>s+p.price,0),
  time:new Date().toLocaleString()
 }

 if(order.payment==="ONLINE"){
   window.open("PASTE_YOUR_PAYMENT_LINK_HERE")
 }

 showReceipt(order)
 cart=[]
 renderCart()
 closeCheckout()
}

function showReceipt(order){
 const r=document.getElementById("receipt")
 r.style.display="block"
 r.innerHTML=`
  <h3>Order Received</h3>
  <p><b>${order.name}</b></p>
  <p>Total: $${order.total}</p>
  <p>Payment: ${order.payment}</p>
  <p>${order.time}</p>
 `
}
function loginWithGoogle(){
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider);
}

function loginWithApple(){
  const provider = new firebase.auth.OAuthProvider('apple.com');
  auth.signInWithPopup(provider);
}

auth.onAuthStateChanged(user=>{
  if(user){
    db.collection("customers").doc(user.uid).set({
      name:user.displayName,
      email:user.email,
      photo:user.photoURL
    },{merge:true});
  }
});
db.collection("orders").add({
  customer: auth.currentUser.uid,
  data: order,
  status: "Pending",
  created: firebase.firestore.FieldValue.serverTimestamp()
});
