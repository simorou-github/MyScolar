<?php

use App\Mail\PaymentNotification;
use App\Mail\ScolarPayMail;
use App\Mail\ScolarPlusMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

if(!function_exists('sendMail')){
    //Send Mail
    
    function sendMail($to, $data, $template, $subject, $name, $message) { 
        if($to && $template && $subject && $name && $message)
         {
            Mail::to($to)->send(new ScolarPayMail($data, $template, $subject, $name, $message));
         }
    }
}

if(!function_exists('sendMailForPayment')){
    //Send Mail After payment
    
    function sendMailForPayment($to, $data, $template, $subject, $name, $message) { 
        if($to && $template && $subject && $name && $message)
         {
            Log::info('did');
            Mail::to($to)->send(new PaymentNotification($data, $template, $subject, $name, $message));
         }
    }
}