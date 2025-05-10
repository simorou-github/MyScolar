<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\BalanceFees;
use App\Models\Payment;
use App\Models\PaymentDetail;
use App\Models\TypeFees;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use PDF;

class MTNPaymentController extends Controller
{

    private $secondary_key = '96ea56ca1194463fbdae1ea331861c43';
    private $reference_id = 'f98a342e-269a-4780-bfed-b0ac90859ed2'; //UUID
    private $api_key = '5f9a11757aa74a4e8c8646b0e9b3b7f1';

    //Create access token
    public function createAccessToken(Request $request)
    {

        $url = "https://sandbox.momodeveloper.mtn.com/collection/token/";

        //Set Header
        $header = array(
            'Authorization : Basic ' . base64_encode($this->reference_id . ':' . $this->api_key),
            'Ocp-Apim-Subscription-Key: ' . $this->secondary_key
        );

        //Initialize cURL
        $curl = curl_init();

        //Set cURL options
        curl_setopt_array($curl, array(
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_HTTPHEADER => $header,
        ));

        //Execute the cURL request
        $response = curl_exec($curl);

        //check for cURL error
        if (curl_errno($curl)) {
            Log::error(curl_error($curl));
            return response()->json([
                'data' => [],
                'message' => 'Une erreur interne est survenue',
                'status' => 500
            ]);
        }

        //Close cURL session
        curl_close($curl);
        $data = json_decode($response);
        // Log::info($response);
        if ($data) {
            return $data;
        } else {
            return response()->json([
                'data' => [],
                'message' => "Impossible d'obtenir un token.",
                'status' => 500
            ]);
        }
    }


    //Process Batch Payment
    public function requestToBatchPayment(Request $request)
    {
        //Log::info($request);
        $validated = $request->validate([
            'data' => ['required'],
            'balance_rows' => ['required'],
            'additional_fields' => ['required'],
        ]);
        if (!$validated) {
            return response()->json([
                'data' => null,
                'message' => 'Les champs requis ne sont pas tous fournis.',
                'status' => 500
            ]);
        }

        $sumRowsAmount = 0;
        foreach ($request->balance_rows as $value) {
            $sumRowsAmount = $sumRowsAmount + $value['balance'];
        }

        if ($sumRowsAmount != $request->data['amount']) {
            return response()->json([
                'data' => null,
                'message' => 'Le montant total est différent de la somme des lignes sélectionnées.',
                'status' => 500
            ]);
        }

        $scolar_rate = getScolarPlusRate();
        if (!$request->data['operator']) {
            return response()->json([
                'data' => null,
                'message' => 'Veuillez sélectionner un mode de paiement correct.',
                'status' => 300
            ]);
        }
        $access_token = $this->createAccessToken($request)->access_token;
        $environment = 'sandbox';
        $reference_uuid = Str::uuid();
        $url = "https://sandbox.momodeveloper.mtn.com/collection/v1_0/requesttopay";

        //Set Header
        $header = array(
            'Authorization : Bearer ' . $access_token,
            'X-Reference-Id: ' . $reference_uuid,
            'X-Target-Environment: ' . $environment,
            'Content-Type: application/json',
            'Ocp-Apim-Subscription-Key: ' . $this->secondary_key
        );

        //Generate an External ID 8 digits
        $external_id = rand(10000000, 99999999);

        //Set the request body
        $body = array(
            'amount' => $request->data['amount'],
            'currency' => env("CURRENCY"),
            'externalId' => $external_id,
            'payer' => array(
                'partyIdType' => 'MSISDN',
                'partyId' => $request->data['phone']
            ),
            'payerMessage' => $request->data['details'],
            'payeeNote' => $request->data['details']
        );

        //encode body ti json
        $json_body = json_encode($body);

        //initialize cURL
        $curl = curl_init();

        //set cURL options
        curl_setopt_array($curl, array(
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_HTTPHEADER => $header,
            CURLOPT_POSTFIELDS => $json_body
        ));

        //Execute the cURL request
        $response = curl_exec($curl);


        //check for cURL error
        if (curl_errno($curl)) {
            Log::error(curl_error($curl));
            return response()->json([
                'data' => [],
                'message' => 'Une erreur interne est survenue',
                'status' => 500
            ]);
        }

        //close cURL session
        curl_close($curl);

        //get http status code
        $http_code = curl_getinfo($curl, CURLINFO_HTTP_CODE);
        curl_close($curl);
        if ($http_code == 202) {
            try {
                DB::beginTransaction();
                //Save payment
                if ($payment = Payment::create(
                    [
                        'id' => generateDBTableId(25, 'App\Models\Payment'),
                        'details' => $request->data['details'],
                        'amount' => $request->data['amount'],
                        'phone' => $request->data['phone'],
                        'email' => $request->data['email'],
                        'classe_id' => $request->additional_fields['classe_id'],
                        'school_id' => $request->additional_fields['school_id'],
                        'student_id' => $request->additional_fields['student_id'],
                        'operator' => $request->data['operator'],
                        'academic_year' => $request->additional_fields['academic_year'],
                        'operation_date' => Carbon::now(),
                        'transaction_id' => $external_id,
                        'transaction_status' => true,
                        'scolar_commission' => $request->data['amount'] * $scolar_rate
                    ]
                )) {
                    // Update Balance Fees
                    foreach ($request->balance_rows as $value) {
                        //Get current Balance Fees
                        $balance_fees = BalanceFees::where('id', $value['id'])->first();

                        //Create Details of payment
                        PaymentDetail::create([
                            'id' => generateDBTableId(25, 'App\Models\PaymentDetail'),
                            'payment_id' => $payment->id,
                            'school_id' => $request->additional_fields['school_id'],
                            'operator_id' => $request->data['operator'],
                            'classe_id' => $request->additional_fields['classe_id'],
                            'student_id' => $request->additional_fields['student_id'],
                            'academic_year' => $request->additional_fields['academic_year'],
                            'balance_fees_id' => $value['id'],
                            'type_fees_id' => $value['type_fees_id'],
                            'fees_amount' => $value['balance'],
                            'school_classe_fees_id' => $balance_fees?->school_classe_fees_id,
                            'scolar_commission' => $value['balance'] * $scolar_rate
                        ]);

                        //Update balance fees
                        if ($balance_fees = BalanceFees::where('id', $value['id'])->first()) {
                            $balance_fees->balance = $balance_fees->balance - $value['balance'];
                            $balance_fees->save();
                        }
                    }
                    
                    $this->generatePDFInvoice($payment->id);

                    $payment_details = PaymentDetail::with(['type_fees', 'school_classe_fees', 'balance_fees'])
                    ->where('payment_id', $payment->id)->get();

                    $data["email"] = $payment->email;
                    $data["title"] = "Paiement Scolar Plus";
                    $data["payment"] = $payment;
                    $data["payment_details"] = $payment_details;


                    Mail::send('emails.paymentNotification', ['data' => $data], function ($message) use ($data) {
                        $message->to($data["email"])
                            ->subject($data["title"])
                            ->attach(public_path('storage/factures/Recu_SP_' . $data["payment"]["id"] . '.pdf'));
                    });

                    DB::commit();
                    return response()->json([
                        'data' => [],
                        'message' => 'Paiement effectué avec succès.',
                        'status' => 200
                    ]);
                } else {
                    Log::error('Paiement effectué, mais les données n\'ont pas pu être mises à jour.');
                    return response()->json([
                        'data' => [],
                        'message' => 'Paiement effectué, mais les données n\'ont pas pu être mises à jour.',
                        'status' => 500
                    ]);
                }
            } catch (Exception $e) {
                DB::rollBack();
                Log::info($e);
                return response()->json([
                    'data' => [],
                    'message' => 'Une erreur interne est survenue, veuillez réessayer plus tard.',
                    'status' => 500
                ]);
            }
        } else {
            return response()->json([
                'data' => [],
                'message' => 'Le paiement n\'a pas pu aboutir, veuillez essayer plus tard.',
                'status' => 500
            ]);
        }
    }


    //Process Unique Payment
    public function requestToUniquePayment(Request $request)
    {
        //Log::info($request->school_id);
        $scolar_rate = getScolarPlusRate();
        if (!$request->operator) {
            return response()->json([
                'data' => null,
                'message' => 'Veuillez sélectionner un mode de paiement correct.',
                'status' => 300
            ]);
        }
        $access_token = $this->createAccessToken($request)->access_token;
        $environment = 'sandbox';
        $reference_uuid = Str::uuid();
        $url = "https://sandbox.momodeveloper.mtn.com/collection/v1_0/requesttopay";

        //Set Header
        $header = array(
            'Authorization : Bearer ' . $access_token,
            'X-Reference-Id: ' . $reference_uuid,
            'X-Target-Environment: ' . $environment,
            'Content-Type: application/json',
            'Ocp-Apim-Subscription-Key: ' . $this->secondary_key
        );

        //Generate an External ID 8 digits
        $external_id = rand(10000000, 99999999);

        //Set the request body
        $body = array(
            'amount' => $request->amount,
            'currency' => env("CURRENCY"),
            'externalId' => $external_id,
            'payer' => array(
                'partyIdType' => 'MSISDN',
                'partyId' => $request->phone
            ),
            'payerMessage' => $request->payerMessage,
            'payeeNote' => $request->payeeNote
        );

        //encode body ti json
        $json_body = json_encode($body);

        //initialize cURL
        $curl = curl_init();

        //set cURL options
        curl_setopt_array($curl, array(
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_HTTPHEADER => $header,
            CURLOPT_POSTFIELDS => $json_body
        ));

        //Execute the cURL request
        $response = curl_exec($curl);


        //check for cURL error
        if (curl_errno($curl)) {
            Log::error(curl_error($curl));
            return response()->json([
                'data' => [],
                'message' => 'Une erreur interne est survenue',
                'status' => 500
            ]);
        }

        //close cURL session
        curl_close($curl);

        //get http status code
        $http_code = curl_getinfo($curl, CURLINFO_HTTP_CODE);
        curl_close($curl);

        //Check balance
        DB::beginTransaction();
        if ($balance_fees = BalanceFees::where('id', $request->balance_id)->first()) {
            
            if ($balance_fees->balance >= $request->amount) {
                if ($http_code == 202) {
                    try {
                        if ($payment = Payment::create(array_merge(
                            $request->except(['type_fees_id']),
                            [
                                'id' => generateDBTableId(25, 'App\Models\Payment'),
                                'scolar_commission' => $request->amount * $scolar_rate,
                                'operation_date' => Carbon::now(),
                                'transaction_status' => true,
                                'transaction_id' => $external_id,

                            ]
                        ))) {

                            //Create Payment details
                            PaymentDetail::create([
                                'id' => generateDBTableId(25, 'App\Models\Payment'),
                                'payment_id' => $payment->id,
                                'school_id' => $request->school_id,
                                'operator_id' => $request->operator,
                                'classe_id' => $request->classe_id,
                                'student_id' => $request->student_id,
                                'academic_year' => $request->academic_year,
                                'balance_fees_id' => $request->balance_id,
                                'scolar_commission' => $request->amount * $scolar_rate,
                                'fees_amount' => $request->amount,
                                'type_fees_id' => $request->type_fees_id,
                                'school_classe_fees_id' => $balance_fees->school_classe_fees_id

                            ]);

                            // Update Balance Fees
                            $balance_fees->balance = $balance_fees->balance - $payment->amount;
                            $balance_fees->save();
                            
                            $this->generatePDFInvoice($payment->id);


                            $payment_details = PaymentDetail::with(['type_fees', 'school_classe_fees', 'balance_fees'])
                            ->where('payment_id', $payment->id)->get();

                            $data["email"] = $payment->email;
                            $data["title"] = "Paiement Scolar Plus";
                            $data["payment"] = $payment;
                            $data["payment_details"] = $payment_details;


                            Mail::send('emails.paymentNotification', ['data' => $data], function ($message) use ($data) {
                                $message->to($data["email"])
                                    ->subject($data["title"])
                                    ->attach(public_path('storage/factures/Recu_SP_' . $data["payment"]["id"] . '.pdf'));
                            });

                            DB::commit();
                            return response()->json([
                                'data' => ["payment" => $payment],
                                'message' => 'Paiement effectué avec succès',
                                'status' => 200
                            ]);
                        } else {
                            Log::error('Paiement effectué, mais les données n\'ont pas pu être mises à jour.');
                            return response()->json([
                                'data' => [],
                                'message' => 'Paiement effectué, mais les données n\'ont pas pu être mises à jour.',
                                'status' => 500
                            ]);
                        }
                    } catch (Exception $e) {
                        DB::rollBack();
                        Log::error($e);
                        return response()->json([
                            'data' => [],
                            'message' => 'Une erreur interne est survenue. Veuillez contacter le Groupe Scolar Plus.',
                            'status' => 500
                        ]);
                    }
                } else {
                    return response()->json([
                        'data' => [],
                        'message' => 'La transaction n\'a pas pu aboutir, veuillez réessayer.',
                        'status' => $http_code
                    ]);
                }
            } else {
                return response()->json([
                    'data' => [],
                    'message' => 'Le montant de paiement est supérieur au solde. Merci de corriger.',
                    'status' => 500
                ]);
            }
        } else {
            return response()->json([
                'data' => [],
                'message' => 'Cette catégorie de frais n\'existe plus pour cet apprenant.',
                'status' => 500
            ]);
        }
    }

    //Account Balance 
    public function requestToAccountBalance()
    {
        $access_token = $this->createAccessToken($request)->access_token;
        $environment = 'sandbox';
        $url = "https://sandbox.momodeveloper.mtn.com/collection/v1_0/account/balance";

        //Set Header
        $header = array(
            'Authorization : Bearer ' . $access_token,
            'X-Target-Environment: ' . $environment,
        );

        //Set the request body
        $body = array();

        //encode body ti json
        $json_body = json_encode($body);

        //initialize cURL
        $curl = curl_init();

        //set cURL options
        curl_setopt_array($curl, array(
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_HTTPHEADER => $header,
            CURLOPT_POSTFIELDS => $json_body
        ));

        //Execute the cURL request
        $response = curl_exec($curl);
        Log::info($response);

        //check for cURL error
        if (curl_errno($curl)) {
            Log::error(curl_error($curl));
            return response()->json([
                'data' => [],
                'message' => 'Une erreur interne est survenue',
                'status' => 500
            ]);
        }

        //close cURL session
        curl_close($curl);

        //get http status code
        $http_code = curl_getinfo($curl, CURLINFO_HTTP_CODE);
        curl_close($curl);

    }

    public function generatePDFInvoice($id)
    {
        
        if ($payment = Payment::with(['student', 'classe', 'school'])->where('id', $id)->first()) {
            // Set options of page and load data in blade file
            $payment_details = PaymentDetail::with(['type_fees', 'school_classe_fees', 'balance_fees'])
            ->where('payment_id', $payment->id)->get();
            $pdf = PDF::setOptions([
                'isJavascriptEnabled' => true, 'isHtml5ParserEnabled' => true,
                'isRemoteEnabled' => true, 'isPhpEnabled' => true,   "dpi" => 96,
            ])->loadView('emails.invoicePayment', ['payment' => $payment, 'payment_details'=> $payment_details]);
            
            //Log::info($payment_details);
            // Name of file
            $file_name = "Recu_SP_" . $id . ".pdf";
            $pdf->save(public_path("storage/factures/" . $file_name));
        }
    }
}
