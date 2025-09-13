const API_URL = "http://localhost:5000/api";

// 📋 Buyurtmalarni yuklash
async function loadOrders() {
  const tbody = document.getElementById("orders-body");
  tbody.innerHTML = "<tr><td colspan='7'>⏳ Yuklanmoqda...</td></tr>";

  try {
    const res = await fetch(`${API_URL}/orders`);
    const data = await res.json();

    if (!data.length) {
      tbody.innerHTML = "<tr><td colspan='7'>❌ Buyurtmalar topilmadi</td></tr>";
      return;
    }

    tbody.innerHTML = "";
    data.forEach((order, i) => {
      const items = order.items
        .map(p => `${p.name} (${p.qty} x ${p.price} so'm)`)
        .join("<br>");

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${i + 1}</td>
        <td>${order.customer}</td>
        <td>${order.phone}</td>
        <td>${new Date(order.created).toLocaleString()}</td>
        <td>${items}</td>
        <td>${order.sum.toLocaleString()}</td>
        <td>
          <button onclick="shipOrder('${order.id}')">Jo‘natildi</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan='7'>❌ Xato: ${err.message}</td></tr>`;
  }
}

// 🚚 Buyurtmani jo‘natilgan qilish
async function shipOrder(orderId) {
  if (!confirm("Ushbu buyurtmani jo‘natilgan deb belgilaysizmi?")) return;

  try {
    const res = await fetch(`${API_URL}/orders/${orderId}/ship`, {
      method: "POST",
    });
    const data = await res.json();

    if (data.success) {
      alert("✅ Buyurtma jo'natildi!");
      loadOrders();
    } else {
      alert("❌ Xato: " + (data.error || "Noma'lum"));
    }
  } catch (err) {
    alert("❌ Xatolik: " + err.message);
  }
}

// Sahifa ochilganda buyurtmalarni yuklash
loadOrders();