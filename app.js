var firebaseConfig = {
 apiKey: "AIzaSyDd8vDYrTN5vJDq1354fSqIc1Xng2-40nQ",
  authDomain: "ananmanan-store-cc2d3.firebaseapp.com",
  projectId: "ananmanan-store-cc2d3",
};

firebase.initializeApp(firebaseConfig);

var auth = firebase.auth();
var db = firebase.firestore();

const products=[
 {id:1,name:"Black Sneaker",price:120,img:"https://images.unsplash.com/photo-1606813909255-c9f29aaacfd2"},
 {id:2,name:"White Classic",price:140,img:"https://images.unsplash.com/photo-1600185365483-26d7a4cc7519"},
 {id:3,name:"Street Runner",price:110,img:"https://images.unsplash.com/photo-1528701800489-20be0c8c3f59"}
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
 `;
});

function toggleCart(){cartBox.classList.toggle("open")}

function addToCart(id){
 const p=products.find(x=>x.id===id);
 cart.push(p);
 renderCart();
}

function renderCart(){
 document.getElementById("cart-items").innerHTML="";
 let total=0;
 cart.forEach(p=>{
  total+=p.price;
  document.getElementById("cart-items").innerHTML+=`<p>${p.name} - $${p.price}</p>`;
 });
 document.getElementById("total").innerText=total;
 document.getElementById("cart-count").innerText=cart.length;
}

function openCheckout(){document.getElementById("checkoutPage").style.display="flex"}
function closeCheckout(){document.getElementById("checkoutPage").style.display="none"}

function placeOrder(){}
 const order={
  name:name.value,
  email:email.value,
  phone:phone.value,
  address:address.value,
  payment:paymentMethod.value,
  items:cart,
  total:cart.reduce((s,p)=>s+p.price,0),
  time:new Date().toLocaleString()
 };

 if(order.payment==="ONLINE"){
   window.open("PASTE_YOUR_PAYMENT_LINK_HERE");
 }

function placeOrder(){

  if(!auth.currentUser){
    alert("Please login before placing order.");
    return;
  }

  const order={
    uid: auth.currentUser.uid,
    name:name.value,
    email:email.value,
    phone:phone.value,
    address:address.value,
    payment:paymentMethod.value,
    items:cart,
    total:cart.reduce((s,p)=>s+p.price,0),
    time:new Date().toLocaleString(),
    status:"Pending"
  };

  db.collection("orders").add(order)
  .then(()=>{
      console.log("Order saved");
      showReceipt(order);
      cart=[];
      renderCart();
      closeCheckout();
  })
  .catch(err=>{
      alert("Order error: " + err.message);
  });

  if(order.payment==="ONLINE"){
     window.open("PASTE_YOUR_PAYMENT_LINK_HERE");
  }
}


function showReceipt(order){
 receipt.style.display="block";
 receipt.innerHTML=`
 <h3>ANANMANAN RECEIPT</h3>
 <p>Name: ${order.name}</p>
 <p>Email: ${order.email}</p>
 <p>Total: $${order.total}</p>
 <p>Payment: ${order.payment}</p>
 <button onclick='downloadReceipt(${JSON.stringify(order)})'>Download PDF</button>
 `;
}
function downloadReceipt(order){
 const { jsPDF } = window.jspdf;
 const doc = new jsPDF();

 doc.text("ANANMANAN RECEIPT", 20, 20);
 doc.text("Name: " + order.name, 20, 40);
 doc.text("Email: " + order.email, 20, 50);
 doc.text("Total: $" + order.total, 20, 60);
 doc.text("Payment: " + order.payment, 20, 70);

 doc.save("ananmanan-receipt.pdf");
}


function loginWithGoogle(){
 var provider=new firebase.auth.GoogleAuthProvider();
 auth.signInWithPopup(provider)
  .then(res=>userEmail.innerText=res.user.email)
  .catch(err=>alert(err.message));
}
