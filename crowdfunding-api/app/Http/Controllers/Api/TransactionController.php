<?php

namespace App\Http\Controllers\Api;

use App\Constants\HttpStatus;
use App\Constants\Message;
use App\Http\Controllers\Controller;
use App\Interfaces\Http\Services\TransactionServiceInterface;
use App\Libraries\Helper;
use Illuminate\Http\Request;

class TransactionController extends Controller
{


    protected TransactionServiceInterface $transactionService;

    public function __construct(TransactionServiceInterface $transactionService)
    {
        $this->transactionService = $transactionService;
    }
    
    /**
     * Get All Transactions.
     *
     * @param Request $request The incoming request instance.
     * @return \Illuminate\Http\JsonResponse The API response containing the fetched data or an error message.
     */
    public function getAllTransactions()
    {
        $response = [
            'data' => null,
            'message' => '',
            'http_code' => HttpStatus::OK,
        ];

        try {
            $data = $this->transactionService->getAllTransactions();

            if (!$data) {
                $response['http_code'] = HttpStatus::NOT_FOUND;
                $response['message'] = Message::DATA_NOT_FOUND;
            } else {
                $response['data'] = $data;
                $response['message'] = Message::SUCCESS_RETRIEVED_DATA;
            }
        } catch (\Exception $e) {
            $response['http_code'] = HttpStatus::INTERNAL_SERVER_ERROR;
            $response['message'] = Message::FAILED_GET_DATA;
        }

        return Helper::apiResponse($response);
    }

    /**
     * Get All Statistics Transactions.
     *
     * @param Request $request The incoming request instance.
     * @return \Illuminate\Http\JsonResponse The API response containing the fetched data or an error message.
     */
    public function getAllStatistic()
    {
        $response = [
            'data' => null,
            'message' => '',
            'http_code' => HttpStatus::OK,
        ];

        try {
            $data = $this->transactionService->getAllStatistic();

            if (!$data) {
                $response['http_code'] = HttpStatus::NOT_FOUND;
                $response['message'] = Message::DATA_NOT_FOUND;
            } else {
                $response['data'] = $data;
                $response['message'] = Message::SUCCESS_RETRIEVED_DATA;
            }
        } catch (\Exception $e) {
            $response['http_code'] = HttpStatus::INTERNAL_SERVER_ERROR;
            $response['message'] = Message::FAILED_GET_DATA;
        }

        return Helper::apiResponse($response);
    }
}
