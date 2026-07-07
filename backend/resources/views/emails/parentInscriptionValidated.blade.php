<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
</head>
<body style="margin:0;padding:0;background-color:#F0F6FF;font-family:Helvetica,Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
            <td align="center" style="padding:30px 10px;">
                <table width="100%" style="max-width:600px;border-radius:12px;overflow:hidden;background:#ffffff;">
                    <tr>
                        <td align="center" style="background:linear-gradient(135deg,#4A90D9 0%,#2B6BAA 100%);padding:28px 20px;">
                            <table cellpadding="0" cellspacing="0" align="center" style="margin-bottom:10px;">
                                <tr><td style="background-color:#E6F4EA;color:#1E8E3E;font-size:12px;font-weight:700;padding:6px 16px;border-radius:20px;">COMPTE VALIDÉ</td></tr>
                            </table>
                            <p style="margin:0;color:#fff;font-size:20px;font-weight:700;">{{ $name }}</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:28px 30px;font-size:15px;line-height:24px;color:#333;">
                            <p>Bonjour {{ $data['first_name'] }},</p>
                            <p>{{ $_message }}</p>
                            <table cellpadding="0" cellspacing="0" align="center" style="margin:24px 0;">
                                <tr>
                                    <td style="border-radius:30px;background-color:#F47920;">
                                        <a href="{{ $data['activation_link'] }}" target="_blank" style="background-color:#F47920;color:#fff;font-size:15px;font-weight:700;padding:14px 32px;border-radius:30px;text-decoration:none;display:inline-block;">ACTIVER MON ESPACE PARENT</a>
                                    </td>
                                </tr>
                            </table>
                            <p style="font-size:13px;color:#888;">Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :<br>{{ $data['activation_link'] }}</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
