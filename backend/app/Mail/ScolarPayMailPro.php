<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ScolarPayMailPro extends Mailable
{
    use Queueable, SerializesModels;

    public $data;
    public $template;
    public $subject;
    public $name;
    public $message;

    public function __construct($data, $template, $subject, $name, $message)
    {
        $this->data = $data;
        $this->template = $template;
        $this->subject = $subject;
        $this->name = $name;
        $this->message = $message;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->from(env("MAIL_FROM_ADDRESS"), $this->name)
            ->subject($this->subject)
            ->markdown($this->template)
            ->with([
                'data' => $this->data,
                '_message' => $this->message,
            ]);
    }
}
