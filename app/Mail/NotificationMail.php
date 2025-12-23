<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class NotificationMail extends Mailable
{
    use Queueable, SerializesModels;

    public string $headline;
    public string $body;
    public ?string $actionText;
    public ?string $actionUrl;

    public function __construct(string $headline, string $body, ?string $actionText = null, ?string $actionUrl = null)
    {
        $this->headline = $headline;
        $this->body = $body;
        $this->actionText = $actionText;
        $this->actionUrl = $actionUrl;
    }

    public function build(): self
    {
        return $this->subject($this->headline)
            ->view('emails.notification');
    }
}
