<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Mail\Mailables\Address;

class ScolarPayMail extends Mailable
{
    use Queueable, SerializesModels;
    public $data;
    public $template;
    public $subject;
    public $name;
    public $message;

    /**
     * Create a new message instance.
     */
    public function __construct($data, $template, $subject, $name, $message)
    {
        //
        $this->data = $data;
        $this->template = $template;
        $this->subject = $subject;
        $this->name = $name;
        $this->message = $message;

    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            from: new Address(env("MAIL_FROM_ADDRESS"), $this->name),
            subject: $this->subject,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: $this->template,
            with: [
                'data' => $this->data,
                'subject' => $this->subject,
                '_message' => $this->message,
                'name' => $this->name
            ]
        );
    }

   
}
