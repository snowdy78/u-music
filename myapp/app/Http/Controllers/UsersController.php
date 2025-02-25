<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserResource;

class UsersController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response(UserResource::collection(User::all()))->header('Content-Type', 'application/json');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request)
    {
        $request['password'] = sha1($request['password']);
        return response(UserResource::make(User::create($request->all())))->header('Content-Type', 'application/json');
    }
    function login() {
        return response(UserResource::make(
            User::where('login', request('name'))
                ->orWhere('email', request('name'))
                ->where('password', sha1(request('password'))
            )->first()
        ))->header('Content-Type', 'application/json');
    }
    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        return response(UserResource::make($user))->header('Content-Type', 'application/json');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        $user->update($request->all());
        return response(UserResource::make($user))->header('Content-Type', 'application/json');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        $user->delete();
        return response()->json([])->header('Content-Type', 'application/json');
    }
}
