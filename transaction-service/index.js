const express = require('express')
const app = express()
const PORT = 3008
const { ethers } = require('ethers');
const fs = require('fs');
const cors = require('cors');
const { default: axios } = require('axios');

require('dotenv').config()

// Tambah log global error
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection:', reason);
});

console.log('🚀 Starting server...');

// Validasi ENV
if (!process.env.RPC_URL || !process.env.CONTRACT_ADDRESS) {
  console.error('❌ RPC_URL dan CONTRACT_ADDRESS wajib diatur di .env');
  process.exit(1);
}

console.log('📦 Loading ABI...');
let abi;
try {
  abi = JSON.parse(fs.readFileSync('./abi/Escrow.json', 'utf8'));
  console.log('✅ ABI loaded successfully');
} catch (err) {
  console.error('❌ Gagal membaca ABI:', err.message);
  process.exit(1);
}

console.log('🔗 Connecting to RPC...');
let provider;
try {
  provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  console.log('✅ Provider connected');
} catch (err) {
  console.error('❌ Gagal connect ke RPC:', err.message);
  process.exit(1);
}

console.log('🔐 Initializing contract...');
let contract;
try {
  contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, abi, provider);
  console.log('✅ Contract loaded');
} catch (err) {
  console.error('❌ Gagal load contract:', err.message);
  process.exit(1);
}

// Endpoint
app.get('/getAllDonations', async (req, res) => {
  try {
      console.log('📥 Calling getAllDonations()...');

      const donations = await contract.getAllDonations();
      // 1. Dapatkan nilai tukar ETH ke IDR
      const maticRateRes = await axios.get('https://indodax.com/api/ticker/POLIDR');

      const currentPriceMatic = maticRateRes?.data?.ticker?.last || 0;
      console.log('💱 Matic to IDR:', currentPriceMatic);

      const campaignMap = {
          1: 'Mandiri',
          2: 'Cendekia',
          3: 'Sejahtera',
          4: 'Lestari',
          5: 'Harmoni',
          6: 'Peduli',
      };

      const formattedDonations = donations.map(donation => {
          const date = new Date(Number(donation[2]) * 1000);
          const ethAmount = Number(ethers.formatEther(donation[1]));
          return {
              donor: donation[0],
              amount: ethAmount, // ETH
              amountIdr: ethAmount * currentPriceMatic, // IDR
              timestamp: date.toISOString(),
              listCampaigns: donation[3].map(id => campaignMap[Number(id)] || `Unknown (${id.toString()})`),
              status: donation[4].toString()
          };
      });

      console.log('📤 Donations fetched:', formattedDonations.length);
      res.json(formattedDonations);
  } catch (error) {
      console.error('❌ Error fetching donations:', error);
      res.status(500).json({ error: 'Failed to fetch donations', details: error.message });
  }
});

// Jalankan server
app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`)
})

app.use(cors({
    origin: 'http://localhost:8000'
}));