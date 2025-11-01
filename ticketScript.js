document.addEventListener("DOMContentLoaded", () => {
  // ===============================
  // ✅ HEADER MENU TOGGLE (MOBILE)
  // ===============================
  const menuBtn = document.getElementById("menu-btn");
  const headerRight = document.querySelector(".header-right");

  if (menuBtn && headerRight) {
    menuBtn.addEventListener("click", () => {
      headerRight.classList.toggle("active");
    });
  }

  // ===============================
  // ✅ NAVIGATION ACTIVE STATE
  // ===============================
  const navLinks = document.querySelectorAll(".main-nav ul li a");
  const sections = document.querySelectorAll(".content-section");

  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      navLinks.forEach(l => l.classList.remove("active"));
      link.classList.add("active");

      sections.forEach(sec => sec.classList.remove("active"));

      const text = link.textContent.trim();
      if (text.includes("دخول القرية")) {
        document.getElementById("entry-section")?.classList.add("active");
      } 
      else if (text.includes("الفعاليات الترفيهية")) {
        document.getElementById("entertainment-section")?.classList.add("active");
      }
      else if (text.includes("أعد التعبئة")) {
        document.getElementById("recharge-section")?.classList.add("active");
      }
    });
  });

  // ===============================
  // 🎟️ TICKET COUNTER + CART UPDATE
  // ===============================
  const cartCountEl = document.getElementById("cart-count");
  let savedCounts = JSON.parse(localStorage.getItem("ticketCounts")) || {};
  let ticketData = JSON.parse(localStorage.getItem("ticketData")) || {};

  // Update header cart icon
  function updateCartCount() {
    const total = Object.values(savedCounts).reduce((a, b) => a + b, 0);
    if (cartCountEl) cartCountEl.textContent = total;
    localStorage.setItem("ticketCount", total);
  }

  // ===============================
  // 🎟️ INITIALIZE EACH TICKET CARD
  // ===============================
  document.querySelectorAll(".ticket-card").forEach((card, index) => {
    const plus = card.querySelector(".plus");
    const minus = card.querySelector(".minus");
    const countEl = card.querySelector(".count");
    const priceEl = card.querySelector(".ticket-price strong");
    const switchEl = card.querySelector(".switch input");

    const ticketId = `ticket-${index}`;
    const ticketName = card.querySelector("h4")?.textContent.trim() || `تذكرة ${index+1}`;

    let count = savedCounts[ticketId] || 0;
    countEl.textContent = count;

    let price = switchEl?.checked ? 25 : 30;
    if (priceEl) priceEl.textContent = price;

    // Save initial ticket data
    ticketData[ticketId] = { name: ticketName, price, count };
    localStorage.setItem("ticketData", JSON.stringify(ticketData));

    // Update header
    updateCartCount();

    // Increment
    plus?.addEventListener("click", () => {
      count++;
      countEl.textContent = count;
      savedCounts[ticketId] = count;

      ticketData[ticketId].count = count;
      localStorage.setItem("ticketCounts", JSON.stringify(savedCounts));
      localStorage.setItem("ticketData", JSON.stringify(ticketData));
      updateCartCount();
    });

    // Decrement
    minus?.addEventListener("click", () => {
      if (count > 0) count--;
      countEl.textContent = count;
      savedCounts[ticketId] = count;

      ticketData[ticketId].count = count;
      localStorage.setItem("ticketCounts", JSON.stringify(savedCounts));
      localStorage.setItem("ticketData", JSON.stringify(ticketData));
      updateCartCount();
    });

    // Handle toggle (price change)
    switchEl?.addEventListener("change", () => {
      price = switchEl.checked ? 25 : 30;
      if (priceEl) priceEl.textContent = price;
      ticketData[ticketId].price = price;
      localStorage.setItem("ticketData", JSON.stringify(ticketData));
    });
  });
});

const continueBtn = document.querySelector(".continue-btn");

if (continueBtn) {
  continueBtn.addEventListener("click", () => {
    window.location.href = "payment.html";
  });
}

// ============================
// 🟢 BUY BUTTON FUNCTIONALITY
// ============================
document.addEventListener("DOMContentLoaded", () => {
  const buyButtons = document.querySelectorAll(".wonder-card .buy-btn");

  buyButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const card = button.closest(".wonder-card");
      if (!card) return;

      // 🧾 Get the price (extract number)
      const priceText = card.querySelector(".price")?.textContent || "0";
      const priceMatch = priceText.match(/(\d+(?:\.\d+)?)/);
      const price = priceMatch ? parseFloat(priceMatch[1]) : 0;

      // 🏷️ Get description text (like "نقطة متعددة الاستخدام ...")
      const desc = card.querySelector("p:not(.price)")?.textContent?.trim() || "نقطة متعددة الاستخدام";

      // 💾 Save data in localStorage
      localStorage.setItem(
        "selectedWonderCard",
        JSON.stringify({
          desc: desc,
          price: price
        })
      );

      // 🔁 Navigate to payment page
      window.location.href = "payment.html";
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const buyButtons = document.querySelectorAll(".buy-btn");
  const cartContainer = document.querySelector(".cart-items"); // existing cart container

  if (!cartContainer || !buyButtons.length) return;

  buyButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".wonder-card");
      if (!card) return;

      // Safely get price and description
      const priceEl = card.querySelector(".price");
      const descEl = card.querySelector("p:not(.price)");

      if (!priceEl || !descEl) {
        console.warn("⚠️ Missing price or description in this card:", card);
        return;
      }

      // Extract numeric price safely
      const priceText = priceEl.textContent.replace(/[^\d.]/g, "").trim();
      const price = parseFloat(priceText) || 0;
      const description = descEl.textContent.trim();

      // ✅ Hide the first static cart item (ticket)
      const defaultItem = cartContainer.querySelector(".cart-item:first-child");
      if (defaultItem) defaultItem.classList.add("hidden");

      // ✅ Remove any previously added wonder card to avoid duplicates
      const existingWonder = cartContainer.querySelector(".cart-item.wonder-item");
      if (existingWonder) existingWonder.remove();

      // ✅ Create new wonder item (no counter)
      const newItem = document.createElement("div");
      newItem.classList.add("cart-item", "active", "wonder-item");
      newItem.innerHTML = `
        <div class="item-info">
          <h4>${description}</h4>
          <p>${price} <img src="images/dirham.png" alt="Dirham" class="dirham-icon"></p>
        </div>
        <div class="item-price">
          <span class="item-price-value">${price}</span>
          <img src="images/dirham.png" alt="Dirham" class="dirham-icon">
        </div>
      `;

      // ✅ Append to cart
      cartContainer.appendChild(newItem);

      // ✅ Save to localStorage (for payment page)
      localStorage.setItem("selectedWonderCard", JSON.stringify({ description, price }));

      // ✅ Redirect to payment page
      window.location.href = "payment.html";
    });
  });
});
