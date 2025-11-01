// -------------------------
// MOBILE MENU
// -------------------------
const menuBtn = document.getElementById("menu-btn");
menuBtn.addEventListener("click", () => {
  
});

// -------------------------
// TICKET COUNTER LOGIC
// -------------------------
const plusBtn = document.querySelector(".plus");
const minusBtn = document.querySelector(".minus");
const countDisplay = document.querySelector(".ticket-count");
const addToCartBtn = document.getElementById("add-to-cart");
const cartCount = document.getElementById("cart-count");
const ticketPriceLabel = document.querySelector(".ticket-price");

let count = 0;
let cartTotal = 0;
let ticketPrice = 30; // default price

plusBtn.addEventListener("click", () => {
  count++;
  countDisplay.textContent = count;
});

minusBtn.addEventListener("click", () => {
  if (count > 0) {
    count--;
    countDisplay.textContent = count;
  }
});

addToCartBtn.addEventListener("click", () => {
  if (count === 0) {
    alert("الرجاء اختيار عدد التذاكر أولاً");
    return;
  }

  cartTotal += count;
  cartCount.textContent = cartTotal;
  showSuccessAlert(`${count} تذكرة تمت إضافتها إلى السلة ✅`);
  count = 0;
  countDisplay.textContent = count;
});

// -------------------------
// CART POPUP LOGIC
// -------------------------
const cartBtn = document.getElementById("cart-btn");
const cartPopup = document.getElementById("cart-popup");
const closeCart = document.getElementById("close-cart");
const popupCount = document.getElementById("popup-count");
const popupTotal = document.getElementById("popup-total");
const popupPlus = document.querySelector(".cart-controls .plus");
const popupMinus = document.querySelector(".cart-controls .minus");
const cartTicketPriceLabel = document.querySelector(".cart-ticket-price");

let popupTickets = 0;

// Open cart popup only if count > 0
cartBtn.addEventListener("click", () => {
  if (cartTotal === 0) {
    alert("سلتك فارغة. أضف تذاكر أولاً.");
    return;
  }

  popupTickets = cartTotal;
  popupCount.textContent = popupTickets;
popupTotal.innerHTML = `${popupTickets * ticketPrice} <img src="images/dirham.png" alt="Dirham" class="dirham-icon">`;
cartTicketPriceLabel.innerHTML = `${ticketPrice} <img src="images/dirham.png" alt="Dirham" class="dirham-icon">`;


  cartPopup.classList.remove("hidden");
});

// Close popup
closeCart.addEventListener("click", () => {
  cartPopup.classList.add("hidden");
});

// Increment inside popup
popupPlus.addEventListener("click", () => {
  popupTickets++;
  popupCount.textContent = popupTickets;
  popupTotal.innerHTML = `${popupTickets * ticketPrice} <img src="images/dirham.png" alt="Dirham" class="dirham-icon">`;

});

// Decrement inside popup
popupMinus.addEventListener("click", () => {
  if (popupTickets > 1) {
    popupTickets--;
    popupCount.textContent = popupTickets;
    popupTotal.innerHTML = `${popupTickets * ticketPrice} <img src="images/dirham.png" alt="Dirham" class="dirham-icon">`;

  }
});

// -------------------------
// WEEKDAY SWITCH LOGIC (Main + Popup)
// -------------------------
const weekdaySwitch = document.getElementById("weekday-switch");
const weekdaySwitchCart = document.getElementById("weekday-switch-cart");

function updateTicketPrice(isWeekday) {
  ticketPrice = isWeekday ? 25 : 30;
  ticketPriceLabel.innerHTML = `${ticketPrice} <img src="images/dirham.png" alt="Dirham" class="dirham-icon">`;

  cartTicketPriceLabel.innerHTML = `${ticketPrice} <img src="images/dirham.png" alt="Dirham" class="dirham-icon">`;
popupTotal.innerHTML = `${popupTickets * ticketPrice} <img src="images/dirham.png" alt="Dirham" class="dirham-icon">`;

}

// Main switch
weekdaySwitch.addEventListener("change", () => {
  const isWeekday = weekdaySwitch.checked;
  weekdaySwitchCart.checked = isWeekday; // sync both
  updateTicketPrice(isWeekday);
});

// Popup switch
weekdaySwitchCart.addEventListener("change", () => {
  const isWeekday = weekdaySwitchCart.checked;
  weekdaySwitch.checked = isWeekday; // sync both
  updateTicketPrice(isWeekday);
});




const container = document.querySelector(".slider-container");
const next = document.querySelector(".slider-btn.next");
const prev = document.querySelector(".slider-btn.prev");

function scrollNext() {
  container.scrollBy({
    left: container.clientWidth,
    behavior: "smooth",
  });
}

function scrollPrev() {
  container.scrollBy({
    left: -container.clientWidth,
    behavior: "smooth",
  });
}

next.addEventListener("click", scrollNext);
prev.addEventListener("click", scrollPrev);

// =============================
// 🔁 Auto-slide alternately
// =============================
let direction = "next";

function scrollLoop() {
  let count = 0;

  // Run every 3 seconds
  const interval = setInterval(() => {
    if (count < 3) {
      // First 3 times → scroll next
      scrollPrev();
    } else if (count < 6) {
      // Next 3 times → scroll prev
      scrollNext()
      
    } else {
      // Stop after 6 total runs (3 next + 3 prev)
      clearInterval(interval);
    }

    count++;
  }, 3000);
}


// Start the infinite loop
scrollLoop();

  // Function to add 1 ticket to the cart and go to payment page
  function goToPaymentAndAddTicket() {
    // ✅ Add 1 ticket to cart in localStorage (or replace if exists)
    let currentTickets = parseInt(localStorage.getItem('ticketCount') || '0');
    localStorage.setItem('ticketCount', currentTickets + 1);

    // ✅ Navigate to payment page
    window.location.href = 'payment.html';
  }

  // ✅ Checkout button
  const checkoutBtn = document.querySelector('.checkout');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', goToPaymentAndAddTicket);
  }

  // ✅ Event slides
  document.querySelectorAll('.events-slider .slide').forEach(slide => {
    slide.style.cursor = 'pointer';
    slide.addEventListener('click', goToPaymentAndAddTicket);
  });

  // ✅ Category cards
  document.querySelectorAll('.categories-bar .category-card').forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', goToPaymentAndAddTicket);
  });

  // ✅ Weekly adventure button
  const weeklyBtn = document.querySelector('.weekly-btn');
  if (weeklyBtn) {
    weeklyBtn.addEventListener('click', (e) => {
      e.preventDefault();
      goToPaymentAndAddTicket();
    });
  }


  document.addEventListener("DOMContentLoaded", () => {
  const ticketsBtn = document.querySelector(".btn-orange");
  if (ticketsBtn) {
    ticketsBtn.addEventListener("click", () => {
      window.location.href = "tickets.html";
    });
  }
});

function showSuccessAlert(message) {
  // Remove any existing alert
  const oldAlert = document.querySelector(".success-alert");
  if (oldAlert) oldAlert.remove();

  // Create alert element
  const alert = document.createElement("div");
  alert.className = "success-alert";
  alert.textContent = message;
  document.body.appendChild(alert);

  // Animate in
  setTimeout(() => alert.classList.add("show"), 50);

  // Auto-hide after 2.5s
  setTimeout(() => {
    alert.classList.remove("show");
    setTimeout(() => alert.remove(), 400);
  }, 2500);
}
