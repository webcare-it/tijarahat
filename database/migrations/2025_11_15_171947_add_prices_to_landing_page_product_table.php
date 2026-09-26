<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddPricesToLandingPageProductTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('landing_page_product', function (Blueprint $table) {
            $table->decimal('regular_price', 10, 2)->nullable()->after('product_id');
            $table->decimal('discount_price', 10, 2)->nullable()->after('regular_price');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('landing_page_product', function (Blueprint $table) {
            $table->dropColumn(['regular_price', 'discount_price']);
        });
    }
}