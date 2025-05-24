<?php

use Illuminate\Support\Facades\Route;
use App\Services\BlockchainService;

Route::get('/', function () {
    return view('welcome');
});
