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
        Schema::create('orders', function (Blueprint $table) {
            $table->id("orderID");
            $table->foreignId("driverId");

            $table->foreign("driverId")
                ->references("userID")
                ->on("users");
           
            $table->string("orderName" , length:25);
            $table->string("orderAddress" , length:200);
            $table->string("customerName" , length:50);
            $table->string("customerPhone" , length:8);
            $table->decimal('totalPrice', 10, 2)->unsigned();
            $table->decimal('deliveryPrice', 10, 2)->unsigned();
            $table->boolean('status')->default(false); 
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
