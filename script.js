const cart = {};
const countEl = document.getElementById("cart-count");
const itemsEl = document.getElementById("cart-items");
const totalEl = document.getElementById("cart-total");
const drawer = document.getElementById("cart-drawer");
const toast = document.getElementById("toast");
let toastTimer;

document.getElementById("year").textContent = new Date().getFullYear();

function money(value) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);
}
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}
function openCart() {
  document.body.classList.add("cart-open");
  drawer.setAttribute("aria-hidden", "false");
}
function closeCart() {
  document.body.classList.remove("cart-open");
  drawer.setAttribute("aria-hidden", "true");
}
function addItem(name, price) {
  if (!cart[name]) cart[name] = { price, quantity: 0 };
  cart[name].quantity += 1;
  renderCart();
  showToast(`${name} added to your cart`);
}
function changeQuantity(name, amount) {
  if (!cart[name]) return;
  cart[name].quantity += amount;
  if (cart[name].quantity <= 0) delete cart[name];
  renderCart();
}
function renderCart() {
  const entries = Object.entries(cart);
  const count = entries.reduce((sum, [, item]) => sum + item.quantity, 0);
  const total = entries.reduce((sum, [, item]) => sum + item.price * item.quantity, 0);
  countEl.textContent = count;
  totalEl.textContent = money(total);
  if (!entries.length) {
    itemsEl.innerHTML = '<p class="empty-cart">Your cart is waiting for something delicious.</p>';
    return;
  }
  itemsEl.innerHTML = entries.map(([name, item]) => `
    <div class="cart-item">
      <div><strong>${name}</strong><small>${money(item.price)} each</small></div>
      <div class="cart-item-actions">
        <button type="button" aria-label="Remove one ${name}" data-action="minus" data-name="${name}">−</button>
        <span>${item.quantity}</span>
        <button type="button" aria-label="Add one ${name}" data-action="plus" data-name="${name}">+</button>
      </div>
    </div>`).join("");
}
document.querySelectorAll(".add-button").forEach(button => {
  button.addEventListener("click", () => addItem(button.dataset.name, Number(button.dataset.price)));
});
document.getElementById("cart-toggle").addEventListener("click", openCart);
document.getElementById("cart-close").addEventListener("click", closeCart);
document.getElementById("cart-backdrop").addEventListener("click", closeCart);
itemsEl.addEventListener("click", event => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  changeQuantity(button.dataset.name, button.dataset.action === "plus" ? 1 : -1);
});
document.getElementById("checkout-button").addEventListener("click", () => {
  showToast("Checkout will be enabled after secure payment setup.");
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeCart();
});
