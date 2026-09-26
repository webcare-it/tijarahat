<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class CreateLandingPageProductTableV3 extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Drop the table if it exists
        DB::statement('DROP TABLE IF EXISTS landing_page_product');
        
        // Create the table with the correct structure
        DB::statement('CREATE TABLE landing_page_product (
            id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
            landing_page_id BIGINT UNSIGNED NOT NULL,
            product_id INT NOT NULL,
            created_at TIMESTAMP NULL,
            updated_at TIMESTAMP NULL,
            FOREIGN KEY (landing_page_id) REFERENCES landing_pages(id) ON DELETE CASCADE,
            FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
            UNIQUE KEY unique_landing_page_product (landing_page_id, product_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('landing_page_product');
    }
}