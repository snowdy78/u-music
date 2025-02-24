<?php

use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Route;
use App\Models\User;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/
Route::group([
    'middleware' => ['cors'],
], function ($router) {
    Route::apiResource('instruments', 'InstrumentsController');
    
    Route::apiResource('users', 'UsersController');
    Route::get('login-user/{name}/{password}', 'UsersController@login');
    
    Route::apiResource('orders', 'OrdersController');
    
    Route::apiResource('images', 'ImagesController');
});
