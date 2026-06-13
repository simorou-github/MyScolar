<!DOCTYPE html>
<html>

<head>
    <title></title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
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

        /* CLIENT-SPECIFIC STYLES */
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

        img {
            -ms-interpolation-mode: bicubic;
        }

        /* RESET STYLES */
        img {
            border: 0;
            height: auto;
            line-height: 100%;
            outline: none;
            text-decoration: none;
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

        /* iOS BLUE LINKS */
        a[x-apple-data-detectors] {
            color: inherit !important;
            text-decoration: none !important;
            font-size: inherit !important;
            font-family: inherit !important;
            font-weight: inherit !important;
            line-height: inherit !important;
        }

        /* MOBILE STYLES */
        @media screen and (max-width:600px) {
            h1 {
                font-size: 28px !important;
                line-height: 32px !important;
            }

            .verif-code {
                font-size: 28px !important;
                letter-spacing: 6px !important;
            }
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
                            <p style="margin: 0; font-family: 'Plus Jakarta Sans', Helvetica, Arial, sans-serif; font-size: 22px; font-weight: 700; letter-spacing: 1px; color: #ffffff;">{{ $name }}</p>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" valign="top" bgcolor="#ffffff" style="padding: 30px 20px 10px 20px; font-family: 'Plus Jakarta Sans', Helvetica, Arial, sans-serif;">
                            <h2 style="margin: 0; font-size: 22px; font-weight: 700; color: #0A0F1E;">Bienvenue chez {{ $name }} !</h2>
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
                        <td bgcolor="#ffffff" align="left" style="padding: 10px 30px 0px 30px; font-family: 'Plus Jakarta Sans', Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 400; line-height: 25px; color: #333333;">
                            <p style="margin: 0;"><b>Veuillez confirmer votre adresse mail</b></p>
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#ffffff" align="left" style="padding: 10px 30px 20px 30px; font-family: 'Plus Jakarta Sans', Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 400; line-height: 25px; color: #333333;">
                            <p style="margin: 0;">{{ $_message }}</p>
                        </td>
                    </tr>

                    <tr>
                        <td bgcolor="#ffffff" align="center" style="padding: 0px 30px 30px 30px;">
                            <table cellpadding="0" cellspacing="0" border="0" align="center">
                                <tr>
                                    <td class="verif-code" style="background-color: #F0F6FF; border: 1px dashed #4A90D9; border-radius: 10px; padding: 18px 36px; font-family: 'Plus Jakarta Sans', Helvetica, Arial, sans-serif; font-size: 32px; font-weight: 700; letter-spacing: 10px; color: #2B6BAA; text-align: center;">
                                        {{ $data['code'] }}
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <tr>
                        <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 30px 30px; border-radius: 0px 0px 12px 12px; font-family: 'Plus Jakarta Sans', Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 400; line-height: 22px; color: #999999; border-top: 1px solid #F0F6FF;">
                            <p style="margin: 18px 0 0 0;">Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet e-mail.</p>
                            <p style="margin: 12px 0 0 0;">Merci de votre confiance,<br>L'équipe {{ $name }}</p>
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
                            &copy; {{ date('Y') }} {{ $name }}. Tous droits réservés.
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>

</html>
