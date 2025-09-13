@component('mail::message')

Bonjour {{ $name ?? '' }},

@if(($data['status'] ?? '') == "VALIDE")
# Validation de compte

@elseif(($data['status'] ?? '') == "REJETE")
# Rejet

@elseif(($data['status'] ?? '') == "INACTIF")
# Désactivation de compte
@endif

Cher(e) Partenaire,

{{ $_message ?? '' }}

@if(($data['status'] ?? '') == "VALIDE")
Pour accéder à votre espace de travail en ligne, veuillez cliquer sur le bouton ci-dessous.

@component('mail::button', ['url' => 'https://web.scolarco.com/#/auth/login'])
ESPACE DE TRAVAIL
@endcomponent

@elseif(($data['status'] ?? '') == "REJETE")
# Raison du rejet :  
{{ $data['reason'] ?? '' }}

Cliquez [ici](https://web.scolarco.com/#/auth/inscription?sci={{ $data['school_id'] ?? '' }})
pour soumettre à nouveau votre inscription en prenant en compte le motif du rejet précédent.
@endif

Cordialement,  
L'équipe {{ config('app.name') }}

@endcomponent
