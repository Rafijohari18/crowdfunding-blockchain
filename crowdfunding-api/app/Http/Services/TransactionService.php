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
    
        throw new \Exception('Failed get data from service transaction: ' . $response->body());
    }

    /**
     * Call function getAllTransactions()
     */
    public function getAllStatistic()
    {
        $response = Http::get(env('TRANSACTION_SERVICE_API', 'http://localhost:3008') . '/getAllDonations');

        if (!$response->successful()) {
            throw new \Exception('Failed get data from service transaction: ' . $response->body());
        }

        $donations = $response->json();

        // Total Donors
        $uniqueDonors = collect($donations)->pluck('donor')->unique()->count();

        // Total Zis
        $totalZis = collect($donations)->sum('amountIdr');

        // Total Program (Uniq from listCampaigns)
        $allCampaigns = collect($donations)
            ->flatMap(function ($item) {
                return $item['listCampaigns'] ?? [];
            })
            ->unique()
            ->values()
            ->all();

        $totalPrograms = count($allCampaigns);

        return [
            'total_donors' => $uniqueDonors,
            'total_zis' => round($totalZis, 2),
            'total_programs' => $totalPrograms,
            'list_programs' => $allCampaigns,
        ];
    }

}
