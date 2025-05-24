<?php

namespace App\Http\Services;

use App\Interfaces\Http\Services\TransactionServiceInterface;
use Illuminate\Support\Facades\Http;

class TransactionService implements TransactionServiceInterface
{
    /**
     * Call function getAllTransactions()
     */
    public function getAllTransactions()
    {
        $response = Http::get(env('TRANSACTION_SERVICE_API', 'http://localhost:3008').'/getAllDonations');
        if ($response->successful()) {
            return $response->json();
        }
    
        throw new \Exception('Gagal mengambil data dari Service Web3: ' . $response->body());
    }

    /**
     * Call function getAllTransactions()
     */
    public function getAllStatistic()
    {
        $response = Http::get(env('TRANSACTION_SERVICE_API', 'http://localhost:3008').'/getAllDonations');
    
        if ($response->successful()) {
            return $response->json();
        }
    
        throw new \Exception('Gagal mengambil data dari Service Web3: ' . $response->body());
    }
    
}
