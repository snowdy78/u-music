<?php

namespace App\Http\Controllers;

use Illuminate\Routing\Controller as BaseController;
use App\Models\User;

class DataBaseController extends BaseController
{
    public function index()
    {
        $user = User::find(1);
        dd($user->login);
    }
}
