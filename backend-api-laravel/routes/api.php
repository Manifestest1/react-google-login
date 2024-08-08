<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Laravel\Socialite\Facades\Socialite;


use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\UsershowController ;
use App\Http\Controllers\Api\GoogleController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
//front section api 
Route::post('/register_user', [GoogleController::class, 'registerUser']);
Route::post('check_user', [GoogleController::class, 'checkUser']);
Route::get('/edit/{id}', [GoogleController::class, 'edit']);
Route::post('/update/{id}', [GoogleController::class, 'update']);
Route::post('/logout/{id}',[GoogleController::class,'logout']);


//simple login without google logins
Route::post('/login_user',[GoogleController::class,'login']);
Route::post('/register',[GoogleController::class,'ragister']);
Route::post('forgot-password', [GoogleController::class, 'forgot_password']);
Route::post('reset-password', [GoogleController::class, 'reset']);


//admin section api
Route::get('/showuser',[UsershowController::class,'showuser']);
Route::get('/edit/{id}',[UsershowController::class,'edit']);
Route::post('/update/{id}',[UsershowController::class,'update']);
Route::get('/delete/{id}',[UsershowController::class,'delete']);

Route::post('/login',[UserController::class,'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [UserController::class, 'logout']);
});

// Route::post('/change-password', [UserController::class, 'changePassword'])->middleware('auth:sanctum');
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/change-password', [UserController::class, 'changePassword']);
});

// Route::post('/logout/{id}',[GoogleController::class,'logout']);