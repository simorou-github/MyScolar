<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>Reçu</title>
    <style type="text/css">
        @media screen {
            @font-face {
                font-family: 'Plus Jakarta Sans';
                font-style: normal;
                font-weight: 400;
                src: url(https://fonts.gstatic.com/s/plusjakartasans/v8/LDIbaomQNQcsA88c7O9yZ4KMCoOg4IA6-91aHEjcWuA_qU7NShXUEKi4Rw.woff2) format('woff2');
            }

            @font-face {
                font-family: 'Plus Jakarta Sans';
                font-style: normal;
                font-weight: 700;
                src: url(https://fonts.gstatic.com/s/plusjakartasans/v8/LDIbaomQNQcsA88c7O9yZ4KMCoOg4IA6-91aHEjcWuA_qU7NShXUEKi4Rw.woff2) format('woff2');
            }
        }

        body,
        table,
        td,
        a {
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }

        table,
        td {
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
        }

        table {
            border-collapse: collapse !important;
        }

        body {
            height: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            background-color: #F0F6FF;
        }
    </style>
</head>

<body style="margin: 0 !important; padding: 0 !important; background-color: #F0F6FF;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
            <td bgcolor="#F0F6FF" align="center">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                    <tr>
                        <td align="center" valign="top" style="padding: 30px 10px 20px 10px;"> </td>
                    </tr>
                </table>
            </td>
        </tr>

        <!-- HEADER -->
        <tr>
            <td bgcolor="#F0F6FF" align="center" style="padding: 0px 10px 0px 10px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; border-radius: 12px 12px 0px 0px; overflow: hidden;">
                    <tr>
                        <td align="center" valign="top" style="background: linear-gradient(135deg, #4A90D9 0%, #2B6BAA 100%); background-color: #2B6BAA; padding: 32px 20px; border-radius: 12px 12px 0px 0px;">
                            <img src="{{ $message->embed(public_path('images/scolarplus-icon-3x.png')) }}" alt="ScolarPlus" width="56" height="56" style="display: block; margin: 0 auto 12px auto; width: 56px; height: 56px;">
                            <p style="margin: 0; font-family: 'Plus Jakarta Sans', Helvetica, Arial, sans-serif; font-size: 22px; font-weight: 700; letter-spacing: 1px; color: #ffffff;">ScolarPlus</p>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" valign="top" bgcolor="#ffffff" style="padding: 30px 20px 10px 20px; font-family: 'Plus Jakarta Sans', Helvetica, Arial, sans-serif;">
                            <table cellpadding="0" cellspacing="0" border="0" align="center" style="margin-bottom: 14px;">
                                <tr>
                                    <td style="background-color: #E6F4EA; color: #1E8E3E; font-size: 13px; font-weight: 700; letter-spacing: 1px; padding: 8px 18px; border-radius: 20px;">PAIEMENT CONFIRMÉ</td>
                                </tr>
                            </table>
                            <h2 style="margin: 0; font-size: 22px; font-weight: 700; color: #0A0F1E;">Merci d'utiliser ScolarPlus</h2>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>

        <!-- BODY -->
        <tr>
            <td bgcolor="#F0F6FF" align="center" style="padding: 0px 10px 0px 10px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                    <tr>
                        <td bgcolor="#ffffff" align="left" style="padding: 20px 30px 0px 30px; font-family: 'Plus Jakarta Sans', Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 400; line-height: 25px; color: #333333;">
                            <p style="margin: 0;">Récapitulatif de votre paiement en date du <b><?= date('d/m/Y H:i') ?></b>.</p>
                        </td>
                    </tr>

                    <!-- Récapitulatif -->
                    <tr>
                        <td bgcolor="#ffffff" align="left" style="padding: 16px 30px 0px 30px;">
                            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #F0F6FF; border-radius: 8px;">
                                <tr>
                                    <td style="padding: 16px 18px 8px 18px; font-family: 'Plus Jakarta Sans', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 24px; color: #333333;">
                                        <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                            <tr>
                                                <td style="color: #6B7A99; padding: 4px 0;">Code Scolar</td>
                                                <td align="right" style="font-weight: 700; padding: 4px 0;">{{ $data['payment']['student']['code_scolar'] }}</td>
                                            </tr>
                                            <tr>
                                                <td style="color: #6B7A99; padding: 4px 0;">Apprenant</td>
                                                <td align="right" style="font-weight: 700; padding: 4px 0;">{{ $data['payment']['student']['last_name'] }} {{ $data['payment']['student']['first_name'] }}</td>
                                            </tr>
                                            <tr>
                                                <td style="color: #6B7A99; padding: 4px 0;">Ecole</td>
                                                <td align="right" style="font-weight: 700; padding: 4px 0;">{{ $data['payment']['school']['social_reason'] }}</td>
                                            </tr>
                                            <tr>
                                                <td style="color: #6B7A99; padding: 4px 0;">Classe</td>
                                                <td align="right" style="font-weight: 700; padding: 4px 0;">{{ $data['payment']['classe']['classe']['code'] }}</td>
                                            </tr>
                                            <tr>
                                                <td style="color: #6B7A99; padding: 4px 0;">Numéro paiement</td>
                                                <td align="right" style="font-weight: 700; padding: 4px 0;">{{ $data['payment']['phone'] }} (MTN)</td>
                                            </tr>
                                            <tr>
                                                <td style="color: #6B7A99; padding: 4px 0;">Date</td>
                                                <td align="right" style="font-weight: 700; padding: 4px 0;"><?= date('d/m/Y H:i:s') ?></td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Détails frais -->
                    <tr>
                        <td bgcolor="#ffffff" align="left" style="padding: 24px 30px 0px 30px; font-family: 'Plus Jakarta Sans', Helvetica, Arial, sans-serif;">
                            <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                <tr>
                                    <th align="left" style="font-size: 14px; color: #6B7A99; border-bottom: 2px solid #F0F6FF; padding-bottom: 10px; font-weight: 700;">Désignation</th>
                                    <th align="right" style="font-size: 14px; color: #6B7A99; border-bottom: 2px solid #F0F6FF; padding-bottom: 10px; font-weight: 700;">Montant</th>
                                </tr>
                                @foreach ($data['payment_details'] as $key=>$detail)
                                <tr>
                                    <td style="padding: 10px 0; font-size: 15px; color: #333333; border-bottom: 1px solid #F0F6FF;">
                                        {{ $key+1 }}. <b>{{ $detail->type_fees?->label }}</b>{{ $detail->balance_fees?->fees_label ? ', '.$detail->balance_fees?->fees_label : '' }}
                                    </td>
                                    <td align="right" style="padding: 10px 0; font-size: 15px; color: #333333; border-bottom: 1px solid #F0F6FF; white-space: nowrap;">
                                        {{ number_format($detail->fees_amount, 0, ',', ' ') }} F CFA
                                    </td>
                                </tr>
                                @endforeach
                                <tr>
                                    <td style="padding: 14px 0 0 0; font-size: 16px; font-weight: 700; color: #0A0F1E;">Montant total</td>
                                    <td align="right" style="padding: 14px 0 0 0; font-size: 18px; font-weight: 700; color: #2B6BAA; white-space: nowrap;">
                                        {{ number_format($data['payment']['amount'], 0, ',', ' ') }} F CFA
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <tr>
                        <td bgcolor="#ffffff" align="left" style="padding: 24px 30px 30px 30px; border-radius: 0px 0px 12px 12px; font-family: 'Plus Jakarta Sans', Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 400; line-height: 22px; color: #999999; border-top: 1px solid #F0F6FF;">
                            <p style="margin: 18px 0 0 0;">Merci de votre confiance,<br>L'équipe ScolarPlus</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>

        <tr>
            <td bgcolor="#F0F6FF" align="center" style="padding: 24px 10px 24px 10px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                    <tr>
                        <td align="center" style="font-family: 'Plus Jakarta Sans', Helvetica, Arial, sans-serif; font-size: 12px; color: #9AA8C7;">
                            &copy; {{ date('Y') }} ScolarPlus. Tous droits réservés.
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>

</html>
