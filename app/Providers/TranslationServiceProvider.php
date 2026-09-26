<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Contracts\Support\DeferrableProvider;

class TranslationServiceProvider extends ServiceProvider implements DeferrableProvider
{
    /**
     * Register the service provider.
     *
     * @return void
     */
    public function register()
    {
        // Do nothing - we're disabling the translation service
        // But we still need to provide a dummy translator to avoid errors
        $this->app->singleton('translator', function ($app) {
            return new class implements \Illuminate\Contracts\Translation\Translator {
                public function get($key, array $replace = [], $locale = null) {
                    return $key;
                }
                
                public function choice($key, $number, array $replace = [], $locale = null) {
                    return $key;
                }
                
                public function getLocale() {
                    return 'en';
                }
                
                public function setLocale($locale) {
                    // Do nothing
                }
                
                // Add the missing addNamespace method
                public function addNamespace($namespace, $hint) {
                    // Do nothing - stub method to prevent errors
                    return $this;
                }
            };
        });
    }

    /**
     * Bootstrap the application events.
     *
     * @return void
     */
    public function boot()
    {
        // Do nothing - we're disabling the translation service
    }
    
    /**
     * Get the services provided by the provider.
     *
     * @return array
     */
    public function provides()
    {
        return ['translator'];
    }
}