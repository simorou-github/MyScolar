<?php

namespace App\Exceptions;

use Exception;

class ScolarException extends Exception
{
    protected $code = 422;

    public function __construct(string $message = 'Erreur survenue.')
    {
        parent::__construct($message, $this->code);
    }

    public function getStatusCode(): int
    {
        return $this->code;
    }
}
