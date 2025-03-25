<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\PaymentDetail;
use App\Models\TypeFees;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ScolarController extends Controller
{
    //Agrégation des paiement par type de frais
    public function paymentAggregationByTypeFees(Request $request)
    {
        $amounts = [];

        $params = [];
        if ($request->school_id) {
            $params[] = ['school_id', '=', $request->school_id];
        }
        if ($request->operateur_id) {
            $params[] = ['operateur_id', '=', $request->operateur_id];
        }
        if ($request->date_debut && $request->date_fin) {
            $params[] = ['created_at', '>=', $request->date_debut];
            $params[] = ['created_at', '<=', $request->date_fin];
        }
        if ($request->date_debut && !$request->date_fin) {
            $params[] = ['created_at', '>=', $request->date_debut];
        }
        if (!$request->date_debut && $request->date_fin) {
            $params[] = ['created_at', '<=', $request->date_fin];
        }
        if ($request->academic_year) {
            $params[] = ['academic_year', '=', $request->academic_year];
        }
        
        if ($request->school_id)
            $_data = PaymentDetail::with(['type_fees'])
                ->where($params)
                ->groupBy('type_fees_id')
                ->selectRaw('sum(fees_amount) as sum, sum(scolar_commission) as scolar_com, type_fees_id')->get();

        $total = $_data->sum('sum');
        $total_com = $_data->sum('scolar_com');

        foreach ($_data as $fee) {
            $amounts['type_fees'][] = $fee->type_fees->label;
            $amounts['amount'][] = round($fee->sum);
        }

        return response()->json([
            'data' => $_data,
            'total' => $total,
            'total_com' => $total_com,
            'amounts' => $amounts,
            'message' => 'Une erreur interne est survenue',
            'status' => 500
        ]);
    }

    //Liste des transactions par moi de l'année courrante
    public function yearTransactionPerMonth(Request $request)
    {
        $params = [];
        if ($request->school_id) {
            $params[] = ['school_id', '=', $request->school_id];
        }
        if ($request->operateur_id) {
            $params[] = ['operateur_id', '=', $request->operateur_id];
        }
        if ($request->date_debut && $request->date_fin) {
            $params[] = ['created_at', '>=', $request->date_debut];
            $params[] = ['created_at', '<=', $request->date_fin];
        }
        if ($request->date_debut && !$request->date_fin) {
            $params[] = ['created_at', '>=', $request->date_debut];
        }
        if (!$request->date_debut && $request->date_fin) {
            $params[] = ['created_at', '<=', $request->date_fin];
        }
        if ($request->academic_year) {
            $params[] = ['academic_year', '=', $request->academic_year];
        }

        $_data = PaymentDetail::with(['type_fees'])
            ->where($params)
            ->selectRaw('sum(fees_amount) as sum, sum(scolar_commission) as scolar_com, MONTH(created_at) month, type_fees_id')
            ->groupBy('month', 'type_fees_id')
            ->get();
        
        if ($request->school_id)
            $listFees = TypeFees::where('school_id', $request->school_id)->orderBy('created_at', 'desc')->get();
        else 
            $listFees = TypeFees::orderBy('created_at', 'desc')->get();

        $general_data = [];
        foreach ($listFees as $parentFee) {
            $fee_data = [];
            $fee_data['name'] = $parentFee->label;
            $months_amounts = array_fill(0, 12, 0);
            foreach ($_data as $childFee) {
                if ($parentFee->id == $childFee->type_fees_id) {
                    $months_amounts[$childFee->month - 1] = (int)$childFee->sum;
                }
            }
            $fee_data['data'] = $months_amounts;
            $general_data[] = $fee_data;
        }

        $max_amount = 0;
        $max_com = 0;
        foreach($_data as $fee){
            if($fee->sum > $max_amount){
                $max_amount = $fee->sum;
                $max_com = $fee->scolar_com;
            }
        }

        return response()->json([
            'data' => $general_data,
            'max_amount' => $max_amount + 10000,
            'max_com' => $max_com + 10000,
            'message' => 'Une erreur interne est survenue',
            'status' => 500
        ]);
    }
}
