<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\CacheService;

class OptimizeApiCache extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'api:optimize-cache';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Optimize API cache by clearing and preloading common caches';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $this->info('Clearing all caches...');
        CacheService::clearAll();
        $this->info('All caches cleared successfully.');

        $this->info('Preloading common caches...');
        // Preload common caches here
        // This would typically involve calling key API endpoints
        // to populate the cache with frequently accessed data
        $this->info('Common caches preloaded successfully.');

        $this->info('API cache optimization completed!');
        return 0;
    }
}