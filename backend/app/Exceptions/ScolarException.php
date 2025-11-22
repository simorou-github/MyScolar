<?php

namespace App\Exceptions;

use Exception;

class ScolarException extends Exception
{
    public function __construct(string $message = 'Erreur survenue.')
    {
        parent::__construct($message, 422);
    }
}
