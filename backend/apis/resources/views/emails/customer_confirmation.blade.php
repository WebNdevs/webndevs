<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Inquiry Received - WebNDevs</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #0B0F14;
            color: #E5E7EB;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #111827;
            border: 1px solid #374151;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0,0,0,0.3);
        }
        .header {
            background-color: #0B0F14;
            padding: 30px;
            text-align: center;
            border-bottom: 1px solid #374151;
        }
        .logo {
            height: 60px;
            border-radius: 8px;
        }
        .content {
            padding: 40px 30px;
        }
        h2 {
            color: #FFFFFF;
            margin-top: 0;
            font-size: 22px;
            font-weight: 600;
        }
        .message {
            font-size: 15px;
            color: #D1D5DB;
            line-height: 1.6;
            margin-bottom: 30px;
        }
        .message strong {
            color: #22C55E;
        }
        .cta-btn {
            display: inline-block;
            background-color: #22C55E;
            color: #0B0F14 !important;
            font-weight: 700;
            text-decoration: none;
            padding: 12px 25px;
            border-radius: 6px;
            font-size: 15px;
            transition: background-color 0.2s;
            margin-bottom: 30px;
        }
        .summary-title {
            color: #FFFFFF;
            font-size: 16px;
            font-weight: 600;
            margin-top: 30px;
            margin-bottom: 15px;
            border-bottom: 1px solid #374151;
            padding-bottom: 5px;
        }
        .summary-item {
            font-size: 14px;
            margin-bottom: 8px;
            color: #9CA3AF;
        }
        .summary-item strong {
            color: #E5E7EB;
        }
        .footer {
            background-color: #0B0F14;
            padding: 20px;
            text-align: center;
            font-size: 13px;
            color: #6B7280;
            border-top: 1px solid #1F2937;
        }
        .footer a {
            color: #22C55E;
            text-decoration: none;
        }
    </style>
</head>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0B0F14; color: #E5E7EB; margin: 0; padding: 0;">
    <div class="container" style="max-width: 600px; margin: 40px auto; background-color: #111827; border: 1px solid #374151; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">
        <div class="header" style="background-color: #0B0F14; padding: 30px; text-align: center; border-bottom: 1px solid #374151;">
            <img src="https://webndevs.com/logo.png" alt="WebNDevs Logo" class="logo" style="height: 60px; border-radius: 8px;">
        </div>
        <div class="content" style="padding: 40px 30px;">
            <h2 style="color: #FFFFFF; margin-top: 0; font-size: 22px; font-weight: 600;">Hi {{ $name }},</h2>
            <div class="message" style="font-size: 15px; color: #D1D5DB; line-height: 1.6; margin-bottom: 30px;">
                <p style="margin: 0 0 15px 0;">Thank you for reaching out to <strong style="color: #22C55E;">WebNDevs</strong>! We have successfully received your service inquiry.</p>
                <p style="margin: 0;">One of our senior project managers is reviewing your requirements and will get back to you with a free consultation and project estimate within <strong style="color: #22C55E;">24 business hours</strong>.</p>
            </div>
            
            <div style="text-align: center;">
                <a href="https://webndevs.com/portfolio" class="cta-btn" style="display: inline-block; background-color: #22C55E; color: #0B0F14 !important; font-weight: 700; text-decoration: none; padding: 12px 25px; border-radius: 6px; font-size: 15px; margin-bottom: 30px;">View Our Portfolio</a>
            </div>

            <div class="summary-title" style="color: #FFFFFF; font-size: 16px; font-weight: 600; margin-top: 30px; margin-bottom: 15px; border-bottom: 1px solid #374151; padding-bottom: 5px;">Your Inquiry Summary</div>
            <div class="summary-item" style="font-size: 14px; margin-bottom: 8px; color: #9CA3AF;">Service: <strong style="color: #E5E7EB;">{{ $service_slug }}</strong></div>
            <div class="summary-item" style="font-size: 14px; margin-bottom: 8px; color: #9CA3AF;">Brief: <i style="color: #D1D5DB;">"{{ $project_brief }}"</i></div>
        </div>
        <div class="footer" style="background-color: #0B0F14; padding: 20px; text-align: center; font-size: 13px; color: #6B7280; border-top: 1px solid #1F2937;">
            <p style="margin: 0 0 10px 0;">© 2026 WebNDevs. All rights reserved.</p>
            <p style="margin: 0;">If you have any urgent queries, reply to this email or reach us at <a href="mailto:{{ $support_email }}" style="color: #22C55E; text-decoration: none;">{{ $support_email }}</a></p>
        </div>
    </div>
</body>
</html>
