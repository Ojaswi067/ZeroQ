const scanBtn = document.getElementById("scanBtn");
const invoiceCard = document.getElementById("invoiceCard");
const welcomeMsg = document.getElementById("welcomeMsg");
const invoiceId = document.getElementById("invoiceId");
const itemsList = document.getElementById("itemsList");
const totalAmount = document.getElementById("totalAmount");
const payBtn = document.getElementById("payBtn");
const registrationModal = document.getElementById("registrationModal");
const saveUserBtn = document.getElementById("saveUserBtn");
const addItemBtn = document.getElementById("addItemBtn");
const viewTransactionsBtn = document.getElementById("viewTransactionsBtn");
const checkBalanceBtn = document.getElementById("checkBalanceBtn");

// Predefined prices
const itemPrices = {
  "Milk": 60,
  "Bread": 40,
  "Bananas": 30,
  "Eggs": 50,
  "Butter": 80,
  "Cheese": 120,
  "Apples": 70,
  "Oranges": 60
};

// Registration modal check
if (!localStorage.getItem('zeroq_user')) {
  registrationModal.style.display = "flex";
}

saveUserBtn.addEventListener("click", () => {
  const user = {
    name: document.getElementById("userName").value || "Customer",
    email: document.getElementById("userEmail").value,
    upi: document.getElementById("userUPI").value,
    credits: parseInt(document.getElementById("userCredits").value) || 0,
    language: document.getElementById("userLanguage").value,
    transactions: []
  };
  localStorage.setItem('zeroq_user', JSON.stringify(user));
  registrationModal.style.display = "none";
  alert("Details saved. Enjoy ZeroQ!");
});

let invoiceData = {
  id: "INV-ZQ2048",
  items: [
    { name: "Milk", price: 60 },
    { name: "Bread", price: 40 },
    { name: "Bananas", price: 30 }
  ]
};

function updateInvoice() {
  const user = JSON.parse(localStorage.getItem('zeroq_user'));
  welcomeMsg.textContent = `👋 Welcome, ${user.name}`;
  invoiceId.textContent = `🧾 Invoice: ${invoiceData.id}`;
  itemsList.innerHTML = "";
  let total = 0;
  invoiceData.items.forEach((item, idx) => {
    total += item.price;
    const div = document.createElement("div");
    div.className = "invoice-item";
    div.innerHTML = `
      <span>${item.name} - ₹${item.price}</span>
      <button onclick="removeItem(${idx})">❌</button>
    `;
    itemsList.appendChild(div);
  });
  totalAmount.textContent = `Total: ₹${total}`;
}

window.removeItem = function(index) {
  invoiceData.items.splice(index, 1);
  updateInvoice();
};

addItemBtn.addEventListener("click", () => {
  const itemName = prompt("Enter item name:");
  if (itemName) {
    const formattedName = itemName.charAt(0).toUpperCase() + itemName.slice(1).toLowerCase();
    const price = itemPrices[formattedName];
    if (price) {
      invoiceData.items.push({ name: formattedName, price });
      updateInvoice();
    } else {
      alert(`Price not found for "${formattedName}". Please add it to the itemPrices list.`);
    }
  } else {
    alert("Invalid item name.");
  }
});

scanBtn.addEventListener("click", () => {
  scanBtn.disabled = true;
  scanBtn.textContent = "🔍 Scanning...";
  setTimeout(() => {
    updateInvoice();
    invoiceCard.style.display = "block";
    scanBtn.disabled = false;
    scanBtn.textContent = "🚀 Scan Face to Checkout";
  }, 1500);
});

payBtn.addEventListener("click", () => {
  const user = JSON.parse(localStorage.getItem('zeroq_user'));
  let total = invoiceData.items.reduce((sum, item) => sum + item.price, 0);
  if (user.credits >= total) {
    user.credits -= total;
    user.transactions.push({
      id: invoiceData.id,
      items: [...invoiceData.items],
      total: total,
      date: new Date().toLocaleString()
    });
    localStorage.setItem('zeroq_user', JSON.stringify(user));
    invoiceCard.style.display = "none";
    alert(`✅ Payment Successful! ₹${total} deducted from your wallet.`);
  } else {
    alert("❌ Insufficient wallet balance. Please recharge your wallet to proceed.");
  }
});

viewTransactionsBtn.addEventListener("click", () => {
  const user = JSON.parse(localStorage.getItem('zeroq_user'));
  if (user.transactions && user.transactions.length > 0) {
    let message = "📜 Previous Transactions:\\n";
    user.transactions.forEach((tx, idx) => {
      message += `#${idx + 1} - ${tx.id} - ₹${tx.total} on ${tx.date}\\n`;
    });
    alert(message);
  } else {
    alert("No previous transactions found.");
  }
});

checkBalanceBtn.addEventListener("click", () => {
  const user = JSON.parse(localStorage.getItem('zeroq_user'));
  alert(`💰 Wallet Balance: ₹${user.credits}`);
});
