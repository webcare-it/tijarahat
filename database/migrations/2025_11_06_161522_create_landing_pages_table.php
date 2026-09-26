<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLandingPagesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('landing_pages', function (Blueprint $table) {
            $table->id();
            $table->string('title')->nullable();
            $table->string('name')->nullable();
            $table->string('slug')->nullable();
            $table->date('deadline')->nullable();
            $table->string('sub_title')->nullable();
            $table->string('banner_image')->nullable();
            $table->string('video_id')->nullable();
            $table->longText('feature_1')->nullable();
            $table->longText('feature_2')->nullable();
            $table->longText('feature_3')->nullable();
            $table->longText('feature_4')->nullable();
            $table->longText('feature_5')->nullable();
            $table->longText('feature_6')->nullable();
            $table->longText('feature_7')->nullable();
            $table->longText('feature_8')->nullable();
            $table->longText('description')->nullable();
            $table->text('short_description')->nullable();
            $table->foreignId('product_id');
            $table->string('copyright_text')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('landing_pages');
    }
}
