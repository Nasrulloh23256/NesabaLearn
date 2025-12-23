<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{{ $headline }}</title>
  </head>
  <body style="margin:0;padding:0;background:#f8fafc;font-family:Arial,sans-serif;color:#0f172a;">
    <div style="max-width:600px;margin:0 auto;padding:24px;">
      <div style="background:#0f172a;border-radius:16px;padding:20px;color:#ffffff;">
        <h1 style="margin:0;font-size:20px;">{{ $headline }}</h1>
        <p style="margin:12px 0 0;color:#cbd5f5;font-size:14px;">NesabaLearn Notification</p>
      </div>
      <div style="background:#ffffff;border-radius:16px;padding:24px;margin-top:16px;box-shadow:0 6px 18px rgba(15,23,42,0.08);">
        <p style="margin:0 0 16px;font-size:14px;line-height:1.6;white-space:pre-line;">{{ $body }}</p>
        @if($actionText && $actionUrl)
          <a href="{{ $actionUrl }}" style="display:inline-block;background:linear-gradient(90deg,#04BBFD,#FB00FF);color:#ffffff;text-decoration:none;padding:10px 18px;border-radius:999px;font-size:13px;font-weight:600;">
            {{ $actionText }}
          </a>
        @endif
      </div>
      <p style="margin:16px 0 0;color:#64748b;font-size:12px;text-align:center;">
        Email ini dikirim otomatis oleh NesabaLearn.
      </p>
    </div>
  </body>
</html>
