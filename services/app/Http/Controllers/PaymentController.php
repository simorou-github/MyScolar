<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\PaymentDetail;
use Illuminate\Http\Request;
use Exception;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{
    public function getHistoryOfPayment(Request $request)
    {
        $params = [];
        if ($request->input('id')) {
            $params[] = ['id', '=', $request->input('id')];
        }
        if ($request->input('student_id')) {
            $params[] = ['student_id', '=', $request->input('student_id')];
        }
        if ($request->input('classe_id')) {
            $params[] = ['classe_id', '=', $request->input('classe_id')];
        }
        if ($request->input('school_id')) {
            $params[] = ['school_id', '=', $request->input('school_id')];
        }
        if ($request->input('academic_year')) {
            $params[] = ['academic_year', '=', $request->input('academic_year')];
        }
        if ($request->input('type_fees_id')) {
            $params[] = ['type_fees_id', '=', $request->input('type_fees_id')];
        }
        if ($request->input('transaction_status')) {
            $params[] = ['transaction_status', '=', $request->input('transaction_status')];
        }
        if ($request->input('phone')) {
            $params[] = ['phone', '=', $request->input('phone')];
        }
        if ($request->input('email')) {
            $params[] = ['email', '=', $request->input('email')];
        }
        if ($request->input('operation_date')) {
            $params[] = ['operation_date', '=', $request->input('operation_date')];
        }
        if ($request->input('operator')) {
            $params[] = ['operator', '=', $request->input('operator')];
        }

        try {
            $data = Payment::with(['student', 'classe.classe', 'classe.groupe', 'school', 'creater', 'operator'])
            ->where($params)->orderBy('id', 'DESC')->get();
            return response()->json([
                'data' => $data,
                'amount' => $data->sum('amount'),
                'message' => "Liste des paiements",
                'status' => 200
            ]);
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return response()->json([
                'data' => [],
                'message' => 'Une erreur interne est survenue',
                'status' => 500
            ]);
        }
    }

    public function getPaymentDetails(Request $request)
    {
        try {
            $data = PaymentDetail::with(['payment', 'balance_fees', 'type_fees'])
            ->where('payment_id', $request->payment_id)->orderBy('id', 'DESC')->get();
            return response()->json([
                'data' => $data,
                'message' => "Liste des paiements",
                'status' => 200
            ]);
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return response()->json([
                'data' => [],
                'message' => 'Une erreur interne est survenue',
                'status' => 500
            ]);
        }
    }

    public function getInvoice()
    {
        return view('emails.invoicePayment');
    }
}
