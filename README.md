# 📦 Sklad Backend

Bu loyiha **MoySklad API** bilan ishlash uchun backend.

## ⚙️ O‘rnatish
```bash
git clone <repo-url>
cd sklad-backend
npm install
```

## 🔑 Sozlash
`.env` fayl yarating va quyidagilarni yozing:
```env
MOYSKLAD_TOKEN=your_api_token_here
ORG_ID=your_org_id_here
STORE_ID=your_store_id_here
PORT=5000
```

## 🚀 Ishga tushirish
```bash
npm run dev   # nodemon bilan
npm start     # oddiy node bilan
```

## 📡 API
### `POST /api/order/ship`
Buyurtmani **jo‘natilgan** qilish.

**Body:**
```json
{
  "orderId": "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
}
```

**Response:**
```json
{
  "success": true,
  "data": { ... }
}
```