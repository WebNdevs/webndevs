<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreServiceInquiryRequest;
use App\Models\ServiceInquiry;

class ServiceInquiryController extends Controller
{
    public function store(StoreServiceInquiryRequest $request)
    {
        $validated = $request->validated();

        // 1. Honeypot check for spam bots
        if (!empty($validated['address'])) {
            \Illuminate\Support\Facades\Log::warning("Spam bot detected via honeypot field from email: " . ($validated['email'] ?? 'unknown'));
            // Return success to deceive the spammer/bot
            return $this->success(null, 'Inquiry submitted successfully.', 201);
        }

        // 2. Sanitize inputs to prevent script injection (infected code)
        $sanitized = [
            'service_slug' => strip_tags($validated['service_slug']),
            'plan_key' => isset($validated['plan_key']) ? strip_tags($validated['plan_key']) : null,
            'plan_name' => isset($validated['plan_name']) ? strip_tags($validated['plan_name']) : null,
            'name' => strip_tags($validated['name']),
            'email' => strip_tags($validated['email']),
            'phone' => isset($validated['phone']) ? strip_tags($validated['phone']) : null,
            'company' => isset($validated['company']) ? strip_tags($validated['company']) : null,
            'budget' => isset($validated['budget']) ? strip_tags($validated['budget']) : null,
            'project_brief' => strip_tags($validated['project_brief']),
        ];

        $inquiry = ServiceInquiry::query()->create([
            ...$sanitized,
            'status' => 'new',
        ]);

        // Dynamically load SMTP settings if configured in settings
        $smtp = \App\Services\SettingsService::getSmtp();
        if (!empty($smtp['host'])) {
            config([
                'mail.mailers.smtp.transport' => 'smtp',
                'mail.mailers.smtp.host' => $smtp['host'],
                'mail.mailers.smtp.port' => $smtp['port'] ?? 587,
                'mail.mailers.smtp.encryption' => $smtp['encryption'] ?? 'tls',
                'mail.mailers.smtp.username' => $smtp['username'] ?? null,
                'mail.mailers.smtp.password' => $smtp['password'] ?? null,
                'mail.from.address' => $smtp['from_email'] ?? config('mail.from.address'),
                'mail.from.name' => $smtp['from_name'] ?? config('mail.from.name'),
                'mail.default' => 'smtp',
            ]);
        }

        // Retrieve support email to send notifications to, fallback to mail.from.address (MAIL_FROM_ADDRESS in .env)
        $supportEmail = \App\Services\SettingsService::get('general', 'support_email');
        if (empty($supportEmail) || $supportEmail === 'support@webndevs.local') {
            $supportEmail = config('mail.from.address') ?? 'sales@webndevs.com';
        }

        // Compile mail content
        $subject = "project WebNDevs - New Inquiry: " . $inquiry->name;
        $body = "You have received a new service inquiry from your website.\n\n"
              . "Name: " . $inquiry->name . "\n"
              . "Email: " . $inquiry->email . "\n"
              . "Phone: " . ($inquiry->phone ?? 'N/A') . "\n"
              . "Service: " . $inquiry->service_slug . "\n"
              . "project WebNDevs: \n" . $inquiry->project_brief . "\n";

        // 1. Send inquiry notification to admin
        try {
            \Illuminate\Support\Facades\Mail::send('emails.inquiry_notification', [
                'name' => $inquiry->name,
                'email' => $inquiry->email,
                'phone' => $inquiry->phone,
                'service_slug' => $inquiry->service_slug,
                'project_brief' => $inquiry->project_brief,
            ], function ($message) use ($supportEmail, $subject) {
                $message->to($supportEmail)->subject($subject);
            });
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error("Failed to send admin notification email: " . $e->getMessage());
        }

        // 2. Send confirmation email to customer
        try {
            $customerSubject = "We have received your inquiry - WebNDevs";
            \Illuminate\Support\Facades\Mail::send('emails.customer_confirmation', [
                'name' => $inquiry->name,
                'service_slug' => $inquiry->service_slug,
                'project_brief' => $inquiry->project_brief,
            ], function ($message) use ($inquiry, $customerSubject) {
                $message->to($inquiry->email)->subject($customerSubject);
            });
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error("Failed to send customer confirmation email: " . $e->getMessage());
        }

        return $this->success($inquiry, 'Inquiry submitted successfully.', 201);
    }
}
