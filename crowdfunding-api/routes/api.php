<?php

use App\Http\Controllers\Api\TransactionController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::prefix('transactions')->group(function () {
    Route::get('/get-all', [TransactionController::class, 'getAllTransactions']);
    Route::get('/get-statistics', [TransactionController::class, 'getAllStatistic']);
});