<?php

use Illuminate\Support\Facades\Route;

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

Route::get('/', 'DataBaseController@index');

Route::apiResource('instruments', 'InstrumentsController');

Route::apiResource('users', 'UsersController');

Route::apiResource('orders', 'OrdersController');

Route::apiResource('images', 'ImagesController');
