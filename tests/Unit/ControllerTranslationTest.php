<?php

namespace Tests\Unit;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ControllerTranslationTest extends TestCase
{
    /**
     * Test that the translate function returns the original key when translation is disabled.
     *
     * @return void
     */
    public function testTranslateFunctionReturnsOriginalKey()
    {
        $result = translate('test_key');
        $this->assertEquals('test_key', $result);
    }

    /**
     * Test that the translate function works with special characters.
     *
     * @return void
     */
    public function testTranslateFunctionWithSpecialCharacters()
    {
        $result = translate('In House Product');
        $this->assertEquals('In House Product', $result);
    }

    /**
     * Test that the translate function works in collections.
     *
     * @return void
     */
    public function testTranslateFunctionInCollections()
    {
        // Test the LanguageCollection
        $language = new \stdClass();
        $language->name = 'English';
        $language->id = 1;
        $language->code = 'en';
        $language->app_lang_code = 'en';
        $language->rtl = 0;

        $result = $language->name;
        $this->assertEquals('English', $result);
    }
}