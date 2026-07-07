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
                                <tr><td style="background-color:#FBE7E0;color:#C0392B;font-size:12px;font-weight:700;padding:6px 16px;border-radius:20px;">INSCRIPTION REJETÉE</td></tr>
                            </table>
                            <p style="margin:0;color:#fff;font-size:20px;font-weight:700;">{{ $name }}</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:28px 30px;font-size:15px;line-height:24px;color:#333;">
                            <p>Bonjour {{ $data['first_name'] }},</p>
                            <p>{{ $_message }}</p>
                            <table cellpadding="0" cellspacing="0" width="100%" style="background-color:#FBE7E0;border-left:4px solid #C0392B;border-radius:6px;margin:14px 0;">
                                <tr><td style="padding:14px 18px;font-size:14px;color:#8B2E1F;">
                                    <strong>Motif :</strong> {{ $data['reason'] }}
                                </td></tr>
                            </table>
                            <p>Vous pouvez soumettre une nouvelle demande d'inscription depuis la page d'accueil Scolar Plus.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
