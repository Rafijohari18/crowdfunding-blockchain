<?php

namespace App\Libraries;

use Illuminate\Support\Facades\App;
use Illuminate\Http\Request;
class Helper
{
	/**
	 * Get the API response structure.
	 *
	 * @param  array $response
	 *
	 * @return
	 */
	public static function apiResponse($response, $headers = [])
	{
		$http_code = isset($response['http_code']) ? $response['http_code'] : 200;
		$response_data = isset($response['data']) ? $response['data'] : null;
		$response_message = isset($response['message']) ? $response['message'] : '';
		$extra_data = isset($response['extra_data']) ? $response['extra_data'] : '';

		$request = App::make(Request::class);
		$request_id = $request->request_id;

		$response = [
			'data' => $response_data,
			'message' => $response_message,
			'http_code' => $http_code,
			'request_id' => $request_id,
		];

		if ($extra_data) {
			$response['extra_data'] = $extra_data;
		}

		return response()->json($response, $http_code, $headers);
	}
}
