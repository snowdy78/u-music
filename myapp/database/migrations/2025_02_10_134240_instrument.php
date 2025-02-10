<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('instruments', function (Blueprint $table) {
            $table->id();
            $table->text('model_name');
            $table->enum('category', ['Guitar', 'Bass', 'Piano', 'Drums', 'Ukulele', 'Synth', 'Trumpet']);
            $table->integer('price');
            $table->integer('in_stock');
            $table->integer('img_id')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('instruments');
    }
};
