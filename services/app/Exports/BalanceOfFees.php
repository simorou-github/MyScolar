<?php 
namespace App\Exports;
 
use App\Models\Student;
use App\Http\Controllers\Controller;

use Maatwebsite\Excel\Concerns\FromArray;

use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
 
class BalanceOfFees extends Controller implements FromArray
{
    protected $param;

    public function __construct($param)
    {
        $this->param = $param;
    }    

    public function array():array
    {
        $balanceFees[] = array(
            'NUMERO',
            'CODE SCOLAR',
            'NOM',
            'PRENOMS',
            'CLASSE',
            'TELEPHONE',
            'DATE NAISSANCE',
            'MATRICULE',
            'EMAIL',
            'IFU ECOLES',
            'NOM ECOLES',
            'ANNEE ACADEMIQUE',
            'FRAIS',
            'REPARTITION',
            'MONTANT DU',
            'TOTAL PAYE',
            'RESTE A PAYER'
        );
        try{
            $balanceFeesData = getFeesBalanceData($this->param)['data'];
            foreach($balanceFeesData as $index => $balance)
            {
                $balanceFees[] = array(
                    'NUMERO' => $index+1,
                    'CODE SCOLAR' => $balance->code_scolar,
                    'NOM' => $balance->student_last_name,
                    'PRENOMS' => $balance->student_first_name,
                    'CLASSE' => $balance->classe_code.'-'.$balance->groupe_code,
                    'TELEPHONE' => $balance->student_phone,
                    'DATE NAISSANCE' => $balance->student_birthday,
                    'MATRICULE' => $balance->student_matricule,
                    'EMAIL' => $balance->student_email,
                    'IFU ECOLES' => $balance->ifu,
                    'NOM ECOLES' => $balance->social_reason,
                    'ANNEE ACADEMIQUE' => $balance->academic_year,
                    'FRAIS' => $balance->type_fees_label,
                    'REPARTITION' => $balance->fees_label,
                    'MONTANT DU' => $balance->fees_amount,
                    'TOTAL PAYE' => ($balance->fees_amount-$balance->balance),
                    'RESTE A PAYER' => $balance->balance,
                );
            }       
            return $balanceFees;

        } catch (Exception $e) {
            Log::info($e);
            return [];
        }
    }
}