<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>Reçu</title>
</head>
<style>
    td {
        font-size: medium;
        
    }

    th {
        color: gray;
    }

 
    b {
        color: gray;
    }
</style>

<body>


    <div style="width: 70%; margin: auto; border: 1px black solid; padding-bottom: 6%; padding-left: -5%; padding-right: -5%">
        <h2 style="text-align: center; margin-top: 10%; margin-bottom: 15%;">Merci d'utiliser <span style="font-weight: bold; color: #2353A7;">ScolarPlus</span></h2>

        <table style="width: 80%;margin: auto; border-collapse: collapse;">
            <tr>
                <td style="width: 80%; text-align: left; font-size: 16px; font-family: Verdana, Geneva, Tahoma, sans-serif; color: gray;"><b>Code Scolar</b>: {{ $data['payment']['student']['code_scolar'] }}</td>
            </tr>
            <tr>
                <td style="width: 80%; text-align: left; font-size: 16px; font-family: Verdana, Geneva, Tahoma, sans-serif; color: gray;"><b>Apprenant</b>: {{ $data['payment']['student']['last_name'] }} {{ $data['payment']['student']['first_name'] }}</td>
            </tr>
            <tr>
                <td style="width: 80%; text-align: left; font-size: 16px; font-family: Verdana, Geneva, Tahoma, sans-serif; color: gray;"><b>Ecole</b>: {{ $data['payment']['school']['social_reason'] }}</td>
            </tr>
            <tr>
                <td style="width: 80%; text-align: left; font-size: 16px; font-family: Verdana, Geneva, Tahoma, sans-serif; color: gray;"><b>Classe</b>: {{ $data['payment']['classe']['code'] }}</td>
            </tr>
            <tr>
                <td style="width: 80%; text-align: left; font-size: 16px; font-family: Verdana, Geneva, Tahoma, sans-serif; color: gray;"><b>Numéro paiement</b>: {{ $data['payment']['phone'] }}
                    <b>par</b> MTN
                </td>
            </tr>
            <tr>
                <th style="width: 80%; text-align: left; font-size: 16px; font-family: Verdana, Geneva, Tahoma, sans-serif; color: gray;"><b>Date du jour</b>: <?= date('d-m-Y') ?></td>
            </tr>

            <tr>
                <td></td>
                <td></td>
            </tr>

            <tr>
                <td></td>
                <td></td>
            </tr>

            <tr>
                <th style="width: 75%; text-align: left;border-bottom: 2px solid gray;
                    padding-bottom: 10px; font-size: 15px; padding-top: 5px;">Désignation</th>
                <th style="width: 25%; text-align: left; border-bottom: 2px solid gray;
                    padding-bottom: 10px; font-size: 15px; padding-top: 5px;">Montant</th>
            </tr>
            @foreach ($data['payment_details'] as $key=>$detail)
            <tr>
                <td style="width: 75%; text-align: left;border-bottom: 2px solid gray;
                    padding-bottom: 10px; font-size: 15px; padding-top: 5px; font-family: Verdana, Geneva, Tahoma, sans-serif; color: black;">
                    {{$key+1}} &nbsp; &nbsp;<b>{{ $detail->type_fees?->label }}, </b> {{ $detail->balance_fees?->fees_label }}                    
                </td>
                <td style="width: 25%; text-align: left;border-bottom: 2px solid gray;
                    padding-bottom: 10px; font-size: 15px; padding-top: 5px; font-family: Verdana, Geneva, Tahoma, sans-serif; color: black;">
                    {{$detail->fees_amount}} F CFA
                </td>
            </tr>
            @endforeach
            <tr>
                <td style="width: 75%;text-align: center; font-size: 17px !important; padding-top: 10px;border-bottom: 2px solid black;
                    padding-bottom: 10px;  padding-top: 5px; font-family: Verdana, Geneva, Tahoma, sans-serif; color: gray;">
                    <b>Montant total</b>
                </td>
                <td style="width: 25%;font-size: 17px !important; font-family: Verdana, Geneva, Tahoma, sans-serif; color: black; padding-top: 10px;border-bottom: 2px solid gray;
                    padding-bottom: 10px; padding-top: 5px;"><b>
                        {{ $data['payment']['amount'] }} F CFA</b>
                </td>
            </tr>
        </table>
    </div>


</body>

</html>