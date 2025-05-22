<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Attachment;

class PaymentMail extends Mailable
{
    use Queueable, SerializesModels;
    public $data;
    public $template;
    public $subject;
    public $name;
    public $receipt_path;
    public $file_name;

    /**
     * Create a new message instance.
     */
    public function __construct($data, $template, $subject, $name, $receipt_path, $file_name)
    {
        $this->data = $data;
        $this->template = $template;
        $this->subject = $subject;
        $this->name = $name;
        $this->receipt_path = $receipt_path;
        $this->file_name = $file_name;
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
                'name' => $this->name
            ]
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [
            Attachment::fromPath($this->receipt_path)
                ->as($this->file_name)
                ->withMime('application/pdf'),
        ];
    }
}
