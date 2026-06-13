<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>Reçu </title>
</head>
<style>

    body {
        font-family: Verdana, Geneva, Tahoma, sans-serif;
        color: #333333;
    }

    td {
        font-size: 13px;
        font-family: Verdana, Geneva, Tahoma, sans-serif;
        color: #333333;
    }

    .sub_title {
        font-weight: bold;
        color: #2B6BAA;
        font-size: 12px;
        letter-spacing: 1px;
        text-transform: uppercase;
        border-bottom: 2px solid #F0F6FF;
        padding-bottom: 6px;
    }

    table {
        border-collapse: collapse;
    }

    .line_border_bottom {
        border-bottom: 1px solid #F0F6FF;
        padding-bottom: 12px;
        padding-top: 8px;
    }

    .info-box {
        background-color: #F0F6FF;
        border-radius: 6px;
        padding: 14px 18px;
    }

    .badge-success {
        background-color: #E6F4EA;
        color: #1E8E3E;
        font-weight: bold;
        font-size: 12px;
        padding: 6px 14px;
        border-radius: 14px;
        letter-spacing: 1px;
    }

    .text-muted {
        color: #6B7A99;
    }

    b{
        color: #333333;
    }
</style>

@php $logoBase64 = base64_encode(file_get_contents(public_path('images/scolarplus-icon-3x.png'))); @endphp
<body>
    <table style="width: 100%; border-bottom: 4px solid #2B6BAA; padding-bottom: 14px; margin-bottom: 14px;">
        <tr>
            <td style="width: 20%;" style="padding-bottom: 10px;">
                <img src="data:image/png;base64,{{ $logoBase64 }}" alt="ScolarPlus" style="width: 60px; height: 60px;">
            </td>

            <td style="width: 50%;">
                <h2 style="margin: 0 0 4px 0; color: #2B6BAA; ">REÇU DE PAIEMENT</h2>
                <p style="margin: 0; color: #6B7A99;">N&deg; {{ $payment->id }}</p>
            </td>
            <td style="width: 30%; text-align: right;">{!! $qrSvg !!}</td>
        </tr>
    </table>

    <table style="width: 100%; margin-top: 10px;">
        <tr>
            <td style="width: 50%; vertical-align: top; padding-right: 10px;">
                <div class="info-box">
                    <p class="sub_title" style="border-bottom: none; padding-bottom: 4px; margin: 0 0 8px 0;">Informations apprenant</p>
                    <p style="margin: 4px 0;"><b>Code Scolar</b>: {{ $payment->student->code_scolar }}</p>
                    <p style="margin: 4px 0;"><b>Nom et Prénom (s)</b>: {{ $payment->student->last_name }} {{ $payment->student->first_name }}</p>
                    <p style="margin: 4px 0;"><b>Classe</b>: {{ $payment->classe->classe->code }}</p>
                </div>
            </td>
            <td style="width: 50%; vertical-align: top; padding-left: 10px;">
                <div class="info-box">
                    <p class="sub_title" style="border-bottom: none; padding-bottom: 4px; margin: 0 0 8px 0;">Informations paiement</p>
                    <p style="margin: 4px 0;"><b>Opérateur</b>: {{ $operator?->name ?? $payment->operator }}</p>
                    @if($operator?->country)
                    <p style="margin: 4px 0;"><b>Pays</b>: {{ $operator->country->name }}</p>
                    @endif
                    <p style="margin: 4px 0;"><b>Numéro</b>: {{ $payment->phone }}</p>
                    <p style="margin: 4px 0;"><b>Date</b>: {{ \Carbon\Carbon::parse($payment->created_at)->format('d-m-Y H:i') }}</p>
                </div>
            </td>
        </tr>
    </table>

    <table style="width: 100%; margin-top: 14px;">
        <tr>
            <td style="width: 100%; vertical-align: top;">
                <div class="info-box">
                    <p class="sub_title" style="border-bottom: none; padding-bottom: 4px; margin: 0 0 8px 0;">Informations école</p>
                    <p style="margin: 4px 0;"><b>Raison sociale</b>: {{ $payment->school->social_reason }}</p>
                    <p style="margin: 4px 0;"><b>IFU</b>: {{ $payment->school->ifu }}</p>
                    <p style="margin: 4px 0;"><b>Téléphone</b>: {{ $payment->school->tel }}</p>
                </div>
            </td>
        </tr>
    </table>

    <table style="width: 100%; margin-top: 18px;">
        <tr>
            <th style="width: 5%; text-align: left;" class="line_border_bottom sub_title">#</th>
            <th style="width: 72%; text-align: left;" class="line_border_bottom sub_title">Désignation</th>
            <th style="width: 23%; text-align: right;" class="line_border_bottom sub_title">Montant</th>
        </tr>
        @foreach ($payment_details as $key=>$detail)
        <tr>
            <td style="width: 5%;" class="line_border_bottom">{{ $key+1 }}</td>
            <td style="width: 72%;" class="line_border_bottom">
                <b>{{ $detail->type_fees?->label }}</b>{{ $detail->balance_fees?->fees_label ? ', '.$detail->balance_fees?->fees_label : '' }}
            </td>
            <td style="width: 23%; text-align: right;" class="line_border_bottom">
                {{ number_format($detail->fees_amount, 0, ',', ' ') }} F CFA
            </td>
        </tr>
        @endforeach
        <tr>
            <td colspan="2" style="text-align: right; font-size: 16px; padding-top: 14px; color: #0A0F1E;"><b>Montant total</b></td>
            <td style="text-align: right; font-size: 18px; padding-top: 14px; color: #2B6BAA;"><b>{{ number_format($payment->amount, 0, ',', ' ') }} F CFA</b></td>
        </tr>
    </table>

    <table style="width: 100%; margin-top: 18px;">
        <tr>
            <td>
                <span class="badge-success">PAIEMENT VALIDÉ</span>
            </td>
        </tr>
    </table>

    <table style="width: 100%; bottom: 30px; position: absolute; border-top: 2px solid #F0F6FF; padding-top: 10px;">
        <tr>
            <td style="text-align: center; color: #6B7A99;">
                <p style="margin: 0;"><span style="font-weight: bold; color: #2B6BAA;">ScolarPlus</span> &mdash; Plateforme de gestion scolaire</p>
                <p style="margin: 6px 0 0 0;">Pour toutes vos préoccupations, contactez notre support au <b>21 40 40 40</b> / <b>66 05 05 05</b><br>
                ou par e-mail à <b>support@scolar-plus.com</b></p>
            </td>
        </tr>
    </table>
</body>

</html>