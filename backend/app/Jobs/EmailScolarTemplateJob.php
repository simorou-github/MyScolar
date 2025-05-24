<?php

namespace App\Jobs;

use App\Mail\ScolarPayMail;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class EmailScolarTemplateJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;
    protected $to;
    protected $data;
    protected $template;
    protected $subject;
    protected $name;
    protected $message;
    /**
     * Create a new job instance.
     */
    public function __construct($to, $data, $template, $subject, $name, $message)
    {
        $this->to = $to;
        $this->data = $data;
        $this->template = $template;
        $this->subject = $subject;
        $this->name = $name;
        $this->message = $message;
    }

    /**
     * Execute the job.
     */
    public function handle()
    {
            Mail::to($this->to)->send(new ScolarPayMail($this->data, $this->template, $this->subject, $this->name, $this->message));
       //sendMail($this->to, $this->data, $this->template, $this->subject, $this->name, $this->message);
    }
}
