@component('mail::message')
# Bonjour,

Veuillez confirmer votre adresse mail.

{{ $_message }}

Le code de vérification est :

@component('mail::panel')
# {{ $data['code'] }}
@endcomponent

Si vous n'avez pas initié cette opération, vous pouvez ignorer cet e-mail en toute sécurité.

Merci de faire confiance à notre plateforme.

Cordialement,
L'équipe {{ config('app.name') }}
@endcomponent

