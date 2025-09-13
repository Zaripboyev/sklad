import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(cors());

const PORT = 5000;

// ❗ Tokeningizni shu yerga qo‘yasiz
const TOKEN = "6ff309d38d10ab91d571867e4bdb9b87f5cb427e";
const API_BASE = "https://api.moysklad.ru/api/remap/1.2";

// 📋 Buyurtmalarni olish
app.get("/api/orders", async (req, res) => {
  try {
    const response = await axios.get(`${API_BASE}/entity/customerorder`, {
      headers: { Authorization: `Bearer ${TOKEN}` },
    });

    let orders = response.data.rows.map((order) => ({
      id: order.id,
      customer: order.agent?.name || "Noma'lum mijoz",
      phone: order.agent?.phone || "-",
      created: order.moment,
      sum: order.sum / 100, // MoySklad tiyinlarda qaytaradi
      items: (order.positions?.rows || []).map((p) => ({
        name: p.assortment?.name || "Noma'lum tovar",
        qty: p.quantity,
        price: p.price / 100,
      })),
    }));

    // 🔑 Yaratilgan sanasi bo‘yicha saralash (oxirgi buyurtmalar tepada)
    orders.sort((a, b) => new Date(b.created) - new Date(a.created));

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🚚 Buyurtmani jo‘natilgan qilish
app.post("/api/orders/:id/ship", async (req, res) => {
  try {
    const orderId = req.params.id;

    // Organization va Store olish (faqat 1 marta chaqirish kerak bo‘ladi)
    const orgs = await axios.get(`${API_BASE}/entity/organization`, {
      headers: { Authorization: `Bearer ${TOKEN}` },
    });
    const stores = await axios.get(`${API_BASE}/entity/store`, {
      headers: { Authorization: `Bearer ${TOKEN}` },
    });

    const ORG_ID = orgs.data.rows[0].id;
    const STORE_ID = stores.data.rows[0].id;

    // Buyurtmadan otgruzka yaratish
    await axios.post(
      `${API_BASE}/entity/demand`,
      {
        organization: { meta: { href: `${API_BASE}/entity/organization/${ORG_ID}`, type: "organization" } },
        store: { meta: { href: `${API_BASE}/entity/store/${STORE_ID}`, type: "store" } },
        customerOrder: { meta: { href: `${API_BASE}/entity/customerorder/${orderId}`, type: "customerorder" } },
      },
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`✅ Server http://localhost:${PORT} da ishlayapti`));
