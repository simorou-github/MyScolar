<?php

namespace App\Imports;

use App\Exceptions\ScolarException;
use App\Models\BalanceFees;
use App\Models\School;
use App\Models\SchoolClasseFees;
use App\Models\SchoolClasseFeesDetails;
use App\Models\Student;
use App\Models\StudentClasse;
use Maatwebsite\Excel\Concerns\ToArray;
use Maatwebsite\Excel\Concerns\WithValidation;
use Carbon\Carbon;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class StudentListImport implements ToArray, WithValidation, WithHeadingRow
{
    public $invalidRows = [];

    protected $currentClasseId;
    protected $academicYear;
    protected $schoolId;

    public function __construct($currentClasseId, $academicYear, $schoolId)
    {
        $this->currentClasseId = $currentClasseId;
        $this->academicYear = $academicYear;
        $this->schoolId = $schoolId;
    }

    public function array(array $data)
    {


        if (!$school = School::with('country')->where('id', $this->schoolId)->first()) {
            throw new ScolarException("L'école associée manque de configuration. Veuillez la mettre à jour.");
        }

        if (!$school_classe_fees = SchoolClasseFees::where('school_id', $this->schoolId)
            ->where('school_classe_id', $this->currentClasseId)
            ->where('academic_year', $this->academicYear)
            ->get()) {
            throw new ScolarException("Aucun frais n'est encore configuré pour cette école. Veuillez la mettre à jour d'abord.");
        }


        foreach ($data as $key => $row) {
            if ($std = Student::where('last_name', $row['nom'])->where('first_name', $row['prenoms'])
                ->first()
            ) {
                throw new ScolarException('L\'élève ' . $row['nom'] . ' ' . $row['prenoms'] . ' à la ligne ' . $key + 6 . ' existe déjà dans la base.');
            }

            if (!in_array($row['sexe'], ['M', 'F'])) {
                throw new ScolarException('Valeur de sexe invalide à la ligne : '. $key + 6 .'. Autorisé : M ou F."');
            }
            // Création 
            $generatedStudentRegistration = generateStudentRegistration($school->country->code);
            $student = Student::create([
                'id' => generateDBTableId(28, "App\Models\Student"),
                'code' => $generatedStudentRegistration['last_student_code_plus_one'],
                'school_id' => $this->schoolId,
                'last_name' => $row['nom'],
                'first_name' => $row['prenoms'],
                'sex' => $row['sexe'],
                'email' => $row['email'],
                'phone' => $row['telephone'],
                'matricule' => $row['matricule_ecole'],
                'birthday' => $this->transformDate($row['date_de_naissance']),
                'code_scolar' => $generatedStudentRegistration['registration'],
                'status' => 1
            ]);

            $student_classe = StudentClasse::create([
                'id' => generateDBTableId(29, "App\Models\StudentClasse"),
                'student_id' => $student->id,
                'school_id' => $this->schoolId,
                'classe_id' => $this->currentClasseId,
                'school_classe_id' => $this->currentClasseId,
                'academic_year' => $this->academicYear,
            ]);

            //Loop on School Classe Fees rows to save each row in Balance Fees table for the current student
            foreach ($school_classe_fees as $value) {
                if ($school_classe_fees_details = SchoolClasseFeesDetails::where('school_classe_fees_id', $value['id'])->get()) {
                    //Loop to create BalanceFees
                    foreach ($school_classe_fees_details as $detail) {
                        $balance = BalanceFees::create([
                            'id' => generateDBTableId(29, "App\Models\BalanceFees"),
                            'student_id' => $student->id,
                            'classe_id' => $this->currentClasseId,
                            'school_id' => $this->schoolId,
                            'type_fees_id' => $value['type_fees_id'],
                            'academic_year' => getActiveAcademicYear(),
                            'fees_amount' => $detail['due_amount'],
                            'balance' => $detail['due_amount'],
                            'fees_label' => $detail['fees_label'],
                            'due_date' => $detail['due_date'],
                            'school_classe_fees_id' => $value['school_classe_fees_id'],
                        ]);
                    }
                }
            }
        }
    }

    public function headingRow(): int
    {
        return 5; // Ligne où se trouvent les en-têtes
    }

    public function rules(): array
    {
        return [
            '*.nom'              => 'required|string|max:255',
            '*.prenoms'          => 'required|string|max:255',
            '*.matricule_ecole'  => 'nullable|max:30',
            '*.email'            => 'nullable|email',
            '*.date_de_naissance' => 'required|before:today|after:1900-01-01',
            '*.sexe'             => 'required|in:M,F',
            '*.telephone'        => 'nullable|digits_between:8,20',
        ];
    }

    public function transformDate($value)
    {
        if (!$value) return null;

        // Cas 1 : Excel timestamp
        if (is_numeric($value)) {
            return Carbon::instance(\PhpOffice\PhpSpreadsheet\Shared\Date::excelToDateTimeObject($value))->format('Y-m-d');
        }

        // Cas 2 : Texte avec / ou -
        try {
            return Carbon::parse($value)->format('Y-m-d');
        } catch (\Exception $e) {
            return null; // ou déclenche une exception si tu veux bloquer l'import
        }
    }


    public function customValidationMessages(): array
    {
        return [
            '*.nom.required'               => 'Le nom de famille est obligatoire.',
            '*.prenoms.required'           => 'Le prénom est obligatoire.',
            '*.matricule_ecole.max'        => 'Le matricule ne doit pas dépasser 30 caractères.',
            '*.email.email'                => 'Le format de l\'email n\'est pas valide.',
            '*.date_de_naissance.required' => 'La date de naissance est obligatoire.',
            '*.date_de_naissance.before'   => 'La date de naissance doit être dans le passé.',
            '*.date_de_naissance.after'    => 'La date de naissance est trop ancienne.',
            '*.sexe.in'                    => 'Le sexe doit être M (Masculin) ou F (Féminin).',
            '*.telephone.digits_between'   => 'Le numéro de téléphone doit comporter entre 8 et 20 chiffres.',
        ];
    }
}
