<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>New Project Inquiry - WebNDevs</title>
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
        .lead {
            font-size: 16px;
            color: #9CA3AF;
            margin-bottom: 30px;
            line-height: 1.5;
        }
        .details-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }
        .details-table td {
            padding: 12px 15px;
            border-bottom: 1px solid #1F2937;
            font-size: 15px;
        }
        .details-table td.label {
            font-weight: 600;
            color: #22C55E;
            width: 30%;
        }
        .details-table td.value {
            color: #F9FAFB;
        }
        .brief-box {
            background-color: #1F2937;
            border-left: 4px solid #22C55E;
            padding: 20px;
            border-radius: 6px;
            font-size: 15px;
            line-height: 1.6;
            color: #D1D5DB;
            white-space: pre-wrap;
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
            <h2 style="color: #FFFFFF; margin-top: 0; font-size: 22px; font-weight: 600;">New Service Inquiry Received</h2>
            <p class="lead" style="font-size: 16px; color: #9CA3AF; margin-bottom: 30px; line-height: 1.5;">You have received a new service inquiry from your website. Here are the project details:</p>
            
            <table class="details-table" style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                <tr>
                    <td class="label" style="padding: 12px 15px; border-bottom: 1px solid #1F2937; font-size: 15px; font-weight: 600; color: #22C55E; width: 30%;">Name</td>
                    <td class="value" style="padding: 12px 15px; border-bottom: 1px solid #1F2937; font-size: 15px; color: #F9FAFB;">{{ $name }}</td>
                </tr>
                <tr>
                    <td class="label" style="padding: 12px 15px; border-bottom: 1px solid #1F2937; font-size: 15px; font-weight: 600; color: #22C55E; width: 30%;">Email</td>
                    <td class="value" style="padding: 12px 15px; border-bottom: 1px solid #1F2937; font-size: 15px; color: #F9FAFB;">{{ $email }}</td>
                </tr>
                <tr>
                    <td class="label" style="padding: 12px 15px; border-bottom: 1px solid #1F2937; font-size: 15px; font-weight: 600; color: #22C55E; width: 30%;">Phone</td>
                    <td class="value" style="padding: 12px 15px; border-bottom: 1px solid #1F2937; font-size: 15px; color: #F9FAFB;">{{ $phone ?? 'N/A' }}</td>
                </tr>
                <tr>
                    <td class="label" style="padding: 12px 15px; border-bottom: 1px solid #1F2937; font-size: 15px; font-weight: 600; color: #22C55E; width: 30%;">Service</td>
                    <td class="value" style="padding: 12px 15px; border-bottom: 1px solid #1F2937; font-size: 15px; color: #F9FAFB;">{{ $service_slug }}</td>
                </tr>
            </table>

            <h3 style="color: #FFFFFF; font-size: 16px; margin-bottom: 10px;">Project Brief:</h3>
            <div class="brief-box" style="background-color: #1F2937; border-left: 4px solid #22C55E; padding: 20px; border-radius: 6px; font-size: 15px; line-height: 1.6; color: #D1D5DB; white-space: pre-wrap;">{{ $project_brief }}</div>
        </div>
        <div class="footer" style="background-color: #0B0F14; padding: 20px; text-align: center; font-size: 13px; color: #6B7280; border-top: 1px solid #1F2937;">
            <p style="margin: 0;">Sent from <a href="https://webndevs.com" style="color: #22C55E; text-decoration: none;">WebNDevs Public Website</a></p>
        </div>
    </div>
</body>
</html>
