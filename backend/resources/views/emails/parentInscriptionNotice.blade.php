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
                            <p style="margin:0;color:#fff;font-size:20px;font-weight:700;">{{ $name }}</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:28px 30px;font-size:15px;line-height:24px;color:#333;">
                            <p>Bonjour,</p>
                            <p>{{ $_message }}</p>
                            <table cellpadding="0" cellspacing="0" style="margin:14px 0;background:#F0F6FF;border-radius:8px;">
                                <tr><td style="padding:14px 18px;font-size:14px;">
                                    <strong>Parent :</strong> {{ $data['first_name'] }} {{ $data['last_name'] }}<br>
                                    <strong>Email :</strong> {{ $data['email'] }}<br>
                                    <strong>Téléphone :</strong> {{ $data['phone'] }}
                                </td></tr>
                            </table>
                            <p>Merci de vous connecter au back-office Scolar Plus pour traiter cette demande.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
