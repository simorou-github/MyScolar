<x-mail::message>
# Bienvenue chez {{ config('app.name') }} !

Bonjour {{ $user->name }},

Nous sommes ravis de vous compter parmi nous. Votre compte a été créé avec succès.

Pour vous connecter pour la première fois, veuillez utiliser les identifiants suivants :

* **Adresse e-mail :** `{{ $user->email }}`
* **Mot de passe temporaire :** `{{ $temporaryPassword }}`

<x-mail::button :url="config('app.frontend_url')">
Se connecter maintenant
</x-mail::button>

Si vous rencontrez des difficultés, n'hésitez pas à nous contacter en répondant à cet e-mail.

Cordialement,

L'équipe {{ config('app.name') }}
</x-mail::message>