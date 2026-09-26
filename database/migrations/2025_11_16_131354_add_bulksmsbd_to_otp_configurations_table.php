<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class AddBulksmsbdToOtpConfigurationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Check if the bulksmsbd configuration already exists
        if (!DB::table('otp_configurations')->where('type', 'bulksmsbd')->exists()) {
            DB::table('otp_configurations')->insert([
                'type' => 'bulksmsbd',
                'value' => '0',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
        
        // Also add the otp_for_order configuration if it doesn't exist
        if (!DB::table('otp_configurations')->where('type', 'otp_for_order')->exists()) {
            DB::table('otp_configurations')->insert([
                'type' => 'otp_for_order',
                'value' => '0',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        DB::table('otp_configurations')->where('type', 'bulksmsbd')->delete();
    }
}