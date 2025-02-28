<?php

namespace App\Http\Controllers;

use App\Models\Instrument;
use App\Http\Requests\StoreInstrumentRequest;
use App\Http\Requests\UpdateInstrumentRequest;
use App\Http\Resources\InstrumentResource;

class InstrumentsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $instruments = Instrument::all();
        return response()->json($instruments->toArray());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreInstrumentRequest $request)
    {
        return InstrumentResource::make(Instrument::create($request->all()));
    }
    /**
     * Display the specified resource.
     */
    public function show(Instrument $instrument)
    {
        return InstrumentResource::make($instrument);
    }

    public function chunk(int $chunk_start, int $chunk_end, bool $reversed = false) 
    {
        $instruments = Instrument::all();
        if ($reversed)
        {
            $instruments = $instruments->sortByDesc('id');
        }
        else 
        {
            $instruments = $instruments->sortBy('id');
        }
        $instruments = $instruments->skip($chunk_start)->take($chunk_end);
        return response()->json(InstrumentResource::collection($instruments));
    }
    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateInstrumentRequest $request, Instrument $instrument)
    {
        $instrument->update($request->all());
        return InstrumentResource::make($instrument);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Instrument $instrument)
    {
        $instrument->delete();
        return request()->json([]);
    }
}
