<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddIndexesToProductsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('products', function (Blueprint $table) {
            // Add indexes for commonly queried columns
            $table->index('category_id');
            $table->index('brand_id');
            $table->index('user_id');
            $table->index('added_by');
            $table->index('published');
            $table->index('featured');
            $table->index('todays_deal');
            $table->index('num_of_sale');
            $table->index('rating');
            $table->index('created_at');
            $table->index('updated_at');
            
            // Composite indexes for common query combinations
            $table->index(['category_id', 'published']);
            $table->index(['brand_id', 'published']);
            $table->index(['user_id', 'published']);
            $table->index(['featured', 'published']);
            $table->index(['todays_deal', 'published']);
            $table->index(['category_id', 'featured', 'published']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('products', function (Blueprint $table) {
            // Drop indexes
            $table->dropIndex(['category_id']);
            $table->dropIndex(['brand_id']);
            $table->dropIndex(['user_id']);
            $table->dropIndex(['added_by']);
            $table->dropIndex(['published']);
            $table->dropIndex(['featured']);
            $table->dropIndex(['todays_deal']);
            $table->dropIndex(['num_of_sale']);
            $table->dropIndex(['rating']);
            $table->dropIndex(['created_at']);
            $table->dropIndex(['updated_at']);
            
            // Drop composite indexes
            $table->dropIndex(['category_id', 'published']);
            $table->dropIndex(['brand_id', 'published']);
            $table->dropIndex(['user_id', 'published']);
            $table->dropIndex(['featured', 'published']);
            $table->dropIndex(['todays_deal', 'published']);
            $table->dropIndex(['category_id', 'featured', 'published']);
        });
    }
}