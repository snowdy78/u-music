<?php

namespace App\Http\Controllers;

use App\Models\Image;
use App\Http\Requests\StoreImageRequest;
use App\Http\Requests\UpdateImageRequest;
use App\Http\Resources\ImageResource;

class ImagesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json([])->header('Content-Type', 'application/json');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreImageRequest $request)
    {
        $data = addslashes(file_get_contents($request->file('image_file')));
        $name = $request->file('image_file')->getClientOriginalName();
        $type = $request->file('image_file')->getClientMimeType();
        $image = new Image();
        $image->fill([
            'name' => $name,
            'type' => $type,
            'blob' => $data
        ]);
        $image->save();
        return response(ImageResource::make($image))->header('Content-Type', 'application/json');
    }

    /**
     * Display the specified resource.
     */
    public function show(Image $image)
    {
        return response(ImageResource::make($image))->header('Content-Type', 'application/json');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateImageRequest $request, Image $image)
    {
        $data = addslashes(file_get_contents($request->file('image_file')));
        $name = $request->file('image_file')->getClientOriginalName();
        $type = $request->file('image_file')->getClientMimeType();
        $image->update([
            'name' => $name,
            'type' => $type,
            'blob' => $data
        ]);
        $image->save();
        return response(ImageResource::make($image))->header('Content-Type', 'application/json');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Image $image)
    {
        $image->delete();
        return response(request()->json([]))->header('Content-Type', 'application/json');
    }
}
