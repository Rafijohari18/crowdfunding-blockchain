<?php

namespace App\Constants;

class Message
{
    const FAILED_GET_DATA = 'Failed to fetch data';
    const FAILED_CREATE_DATA = 'Failed to create data';
    const FAILED_UPDATE_DATA = 'Failed to update data';
    const FAILED_DELETE_DATA = 'Failed to delete data';
    const FAILED_HANDLE_QUEUE_DATA = 'Failed to handle queue data';

    const SUCCESS_RETRIEVED_DATA = 'Data retrieved successfully';
    const SUCCESS_CREATE_DATA = 'Data created successfully';
    const SUCCESS_UPDATE_DATA = 'Data updated successfully';
    const SUCCESS_DELETE_DATA = 'Data deleted successfully';
    const SUCCESS_HANDLE_QUEUE_DATA = 'Success to handle queue data';

    const DATA_NOT_FOUND = 'Data not found';
    const EXAMPLE_DATA_NOT_FOUND = 'Data Example not found';

    const UNAUTHORIZED_ACCESS = 'Unauthorized access. Please provide a valid token.';
    const VALIDATION_ERROR = 'Failed validation.';
    const FAILED_RETRIEVE_DATA = 'Failed Retrieve Data';
    const INCORRECT_PASSWORD_USERNAME = 'Username atau Password salah';
    const ACCOUNT_NOT_VERIFIED = 'Akun belum diverifikasi';
    const SUCCESS_LOGOUT = 'Anda telah berhasil keluar';

    const ROLE_NOT_FOUND = 'Role not found';
    const PERMISSION_NOT_FOUND = 'Permission not found';
    const SUPER_ADMIN_NOT_UPDATED = 'Super admin role can\'t be updated';
}
