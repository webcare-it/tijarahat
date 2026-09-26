<?php

namespace Tests\Unit;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class TranslationDisabledTest extends TestCase
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
        $result = translate('Hello World!');
        $this->assertEquals('Hello World!', $result);
    }
}