<?php

namespace App\Services;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use Illuminate\Support\Facades\Log;

class FasterMessageService
{
    protected Client $client;
    protected ?string $username;
    protected ?string $password;
    protected string $senderId;

    public function __construct()
    {
        $this->username  = config('services.fastermessage.username');
        $this->password  = config('services.fastermessage.password');
        $this->senderId  = config('services.fastermessage.sender_id');

        $this->client = new Client([
            'base_uri' => rtrim(config('services.fastermessage.base_url'), '/'),
            'timeout'  => 15,
        ]);
    }

    /**
     * Envoie un SMS via l'API FasterMessage.
     *
     * Auth    : Basic base64("username:password")
     * Body    : form-data (from, to, text)
     * Endpoint: POST /v1/sms/send
     *
     * @param string $phone   Numéro au format international, ex: +22966748925
     * @param string $message Contenu du SMS
     */
    public function sendSms(string $phone, string $message): bool
    {
        if (!$this->username || !$this->password) {
            Log::info('[FasterMessage:SIMULATION] Identifiants absents — SMS non envoyé', [
                'to'      => $phone,
                'message' => $message,
            ]);
            return true;
        }

        $basicToken = base64_encode($this->username . ':' . $this->password);

        try {
            $response = $this->client->post('/v1/sms/send', [
                'headers' => [
                    'Authorization' => 'Basic ' . $basicToken,
                ],
                'form_params' => [
                    'from' => $this->senderId,
                    'to'   => $phone,
                    'text' => $message,
                ],
            ]);

            $statusCode = $response->getStatusCode();
            $body       = (string) $response->getBody();

            if ($statusCode < 200 || $statusCode >= 300) {
                Log::warning('[FasterMessage] Réponse inattendue', [
                    'status' => $statusCode,
                    'body'   => $body,
                    'to'     => $phone,
                ]);
                return false;
            }

            Log::info('[FasterMessage] SMS envoyé', ['to' => $phone, 'status' => $statusCode]);
            return true;

        } catch (GuzzleException $e) {
            Log::error('[FasterMessage] Échec envoi SMS : ' . $e->getMessage(), ['to' => $phone]);
            return false;
        }
    }
}
