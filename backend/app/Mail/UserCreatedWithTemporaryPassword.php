<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class UserCreatedWithTemporaryPassword extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * L'utilisateur et le mot de passe temporaire.
     */
    public $user;
    public $temporaryPassword;

    /**
     * Crée une nouvelle instance de message.
     */
    public function __construct(User $user, string $temporaryPassword)
    {
        $this->user = $user;
        $this->temporaryPassword = $temporaryPassword;
    }

    /**
     * Récupère l'enveloppe du message.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            from: new \Illuminate\Mail\Mailables\Address(env('MAIL_FROM_ADDRESS'), env('APP_NAME')),
            subject: 'Bienvenue chez ' . env('APP_NAME') . ' ! Vos identifiants de connexion',
        );
    }

    /**
     * Récupère le contenu du message.
     */
    public function content(): Content
    {
        return new Content(
            markdown: 'emails.user-created',
            with: [
                'user' => $this->user,
                'temporaryPassword' => $this->temporaryPassword,
            ],
        );
    }
}
