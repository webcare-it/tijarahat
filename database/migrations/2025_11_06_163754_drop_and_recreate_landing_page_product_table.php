<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class DropAndRecreateLandingPageProductTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::dropIfExists('landing_page_product');
        
        Schema::create('landing_page_product', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('landing_page_id');
            $table->unsignedBigInteger('product_id');
            $table->timestamps();
            
            // Add foreign key constraints
            $table->foreign('landing_page_id')->references('id')->on('landing_pages')->onDelete('cascade');
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
            
            // Ensure a product can only be attached to a landing page once
            $table->unique(['landing_page_id', 'product_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('landing_page_product');
        
        Schema::create('landing_page_product', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('landing_page_id');
            $table->unsignedInteger('product_id');
            $table->timestamps();
            
            // Add foreign key constraints
            $table->foreign('landing_page_id')->references('id')->on('landing_pages')->onDelete('cascade');
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
            
            // Ensure a product can only be attached to a landing page once
            $table->unique(['landing_page_id', 'product_id']);
        });
    }
}