<?php
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['consent']) && $_POST['consent'] === 'accepted') {
    // Définir le cookie de consentement pour qu'il expire dans 365 jours (86400 * 365 secondes)
    setcookie('user_consent', 'accepted', time() + (86400 * 365), "/"); 
    
    // Alternativement, stocker dans la session PHP
    // $_SESSION['user_consent'] = true;

    echo "Consentement enregistré avec succès.";
} else {
    http_response_code(400); // Bad Request
    echo "Requête invalide.";
}
?>
