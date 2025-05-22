<?php

namespace App\Jobs;

use App\Mail\PaymentMail;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class PaymentJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $to;
    protected $data;
    protected $template;
    protected $subject;
    protected $name;
    protected $receipt_path;
    protected $file_name;
    /**
     * Create a new job instance.
     */
    public function __construct($to, $data, $template, $subject, $name, $receipt_path, $file_name)
    {
        $this->to = $to;
        $this->data = $data;
        $this->template = $template;
        $this->subject = $subject;
        $this->name = $name;
        $this->receipt_path = $receipt_path;
        $this->file_name = $file_name;
    }

    /**
     * Execute the job.
     */
    public function handle()
    {
        Mail::to($this->to)->send(new PaymentMail($this->data, $this->template, $this->subject, $this->name, $this->receipt_path, $this->file_name));
    }
}
