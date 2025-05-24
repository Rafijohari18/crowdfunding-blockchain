# Monorepo Crowdfunding Blockchain

Monorepo ini berisi beberapa aplikasi yang saling terintegrasi untuk membangun sistem crowdfunding berbasis blockchain. Terdiri dari tiga bagian utama:

- **crowdfunding-api**: Backend utama berbasis Laravel (PHP) untuk manajemen data dan API digunakan sebagai Api Gateway.
- **crowdfunding-multichannel**: Frontend React untuk antarmuka pengguna crowdfunding.
- **transaction-service**: Service Node.js untuk integrasi blockchain (smart contract) dan konversi data donasi.

---

## Struktur Direktori

```
.
├── crowdfunding-api/           # Backend Api Gateway Laravel (PHP)
├── crowdfunding-multichannel/  # Frontend React (Vite)
├── transaction-service/        # Service Node.js untuk blockchain
```

---

## Deskripsi Tiap Package

### 1. crowdfunding-api

- **Framework**: Laravel (PHP)
- **Fungsi**: Menyediakan API utama, autentikasi, manajemen data user, campaign, dan donasi.
- **Setup**:
  - `composer install`
  - `cp .env.example .env` lalu atur konfigurasi database
  - `php artisan migrate`
  - `php artisan serve`
- **Fitur**:
  - API RESTful untuk campaign & donasi
  - Otentikasi (Sanctum)
  - Queue, migration, dan fitur Laravel lainnya

### 2. crowdfunding-multichannel

- **Framework**: React + Vite
- **Fungsi**: Antarmuka pengguna untuk donasi, melihat campaign, dan integrasi dengan blockchain.
- **Setup**:
  - `npm install`
  - `npm run dev`
- **Fitur**:
  - UI modern dengan TailwindCSS & DaisyUI
  - Integrasi Web3 (ethers.js, @usedapp/core)
  - Routing dengan React Router

### 3. transaction-service

- **Framework**: Node.js (Express)
- **Fungsi**: Service untuk mengambil data donasi dari smart contract blockchain, mengonversi nilai ke IDR, dan menyediakan endpoint API.
- **Setup**:
  - `npm install`
  - Atur file `.env` dengan variabel `RPC_URL` dan `CONTRACT_ADDRESS`
  - `npm run dev`
- **Fitur**:
  - Endpoint `/getAllDonations` untuk mengambil data donasi dari smart contract
  - Konversi nilai MATIC ke IDR (menggunakan API Indodax)
  - Mapping campaign dan status donasi

---

## Cara Kerja Integrasi

1. **Frontend** (crowdfunding-multichannel) berinteraksi dengan user dan menampilkan data campaign/donasi.
2. **Backend** (crowdfunding-api) sebagai Api Gateway, mengelola data utama, autentikasi, dan API tradisional.
3. **Transaction Service** mengambil data dari blockchain (smart contract), mengonversi, dan mengirim ke frontend/backend.

---

## Requirement

- Node.js 18+
- PHP 8.2+
- Composer
- MySQL/PostgreSQL (untuk Laravel)
- RPC endpoint Polygon (untuk blockchain)
---