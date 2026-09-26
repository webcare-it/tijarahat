<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddIndexesToCategoriesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('categories', function (Blueprint $table) {
            // Add indexes for commonly queried columns
            $table->index('parent_id');
            $table->index('featured');
            $table->index('created_at');
            $table->index('updated_at');
            
            // Composite indexes for common query combinations
            $table->index(['parent_id', 'featured']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('categories', function (Blueprint $table) {
            // Drop indexes
            $table->dropIndex(['parent_id']);
            $table->dropIndex(['featured']);
            $table->dropIndex(['created_at']);
            $table->dropIndex(['updated_at']);
            
            // Drop composite indexes
            $table->dropIndex(['parent_id', 'featured']);
        });
    }
}