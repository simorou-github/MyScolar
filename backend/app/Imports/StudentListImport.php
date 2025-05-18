<?php

namespace App\Imports;

use App\Models\BalanceFees;
use App\Models\School;
use App\Models\SchoolClasseFees;
use App\Models\SchoolClasseFeesDetails;
use App\Models\Student;
use App\Models\StudentClasse;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Concerns\SkipsOnFailure;
use Maatwebsite\Excel\Concerns\ToArray;
use Maatwebsite\Excel\Concerns\WithStartRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use PhpOffice\PhpSpreadsheet\Shared\Date;
use Carbon\Carbon;

class StudentListImport implements ToArray, WithValidation, SkipsOnFailure, WithStartRow
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
    /**
     * @param Collection $collection
     */
    public function array(array $data)
    {
        if (!$school = School::with('country')->where('id', $this->schoolId)->first()) {
            return response()->json([
                'message' => 'L\'école associée manque de configuration. Veuillez la mettre à jour.',
                'status' => 500
            ]);
        }

        if (!$school_classe_fees = SchoolClasseFees::where('school_id', $this->schoolId)
            ->where('school_classe_id', $this->currentClasseId)
            ->where('academic_year', $this->academicYear)
            ->get()) {
            return response()->json([
                'message' => 'Aucun frais n\'est encore configuré pour cette école. Veuillez la mettre à jour d\'abord.',
                'status' => 500
            ]);
        }

        DB::beginTransaction();

        try {
            foreach ($data as $row) {
                // Création 
                $generatedStudentRegistration = generateStudentRegistration($school->country->code);
                $student = Student::create([
                    'id' => generateDBTableId(28, "App\Models\Student"),
                    'code' => $generatedStudentRegistration['last_student_code_plus_one'],
                    'school_id' => $this->schoolId,
                    'last_name' => $row[0],
                    'first_name' => $row[1],
                    'sex' => $row[3],
                    'email' => $row[4],
                    'phone' => $row[5],
                    'matricule' => $row[6],
                    'birthday' => is_numeric($row[2])
                        ? Date::excelToDateTimeObject($row[2])
                        : Carbon::parse($row[2]),
                    'code_scolar' => $generatedStudentRegistration['registration'],
                    'status' => 1
                ]);

                $student_classe = StudentClasse::create([
                    'id' => generateDBTableId(29, "App\Models\StudentClasse"),
                    'student_id' => $student->id,
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

            DB::commit();
        } catch (\Throwable $th) {
            DB::rollBack();
            throw $th; // repropager l'erreur pour annuler l'import
        }
    }

    public function startRow(): int
    {
        return 8; // On commence à la ligne 6 (donc on ignore les lignes 1 à 7)
    }

    public function rules(): array
    {
        return [
            '*.last_name'     => 'required|string|max:255',
            '*.first_name'     => 'required|string|max:255',
            '*.matricule'     => 'string|max:30',
            '*.email'    => 'email',
            '*.birthday' => 'required|date|before:today|after:1900-01-01',
            '*.sex'     => 'required|in:M,F',
            '*.phone'     => 'numeric|min:8|max:20',
        ];
    }

    public function onFailure(...$failures)
    {
        // Capturer les erreurs de validation
        foreach ($failures as $failure) {
            $row = $failure->values();
            $row['error'] = implode(', ', $failure->errors());
            $this->invalidRows[] = $row;
        }
    }

    public function customValidationMessages(): array
    {
        return [
            '*.last_name.required'     => 'Le nom de famille est obligatoire à la ligne :attribute.',
            '*.first_name.required'     => 'Le prénom est obligatoire à la ligne :attribute.',
            '*.birthday.required'    => 'La date de naissance est obligatoire à la ligne :attribute.',
            '*.email.email'       => 'Le format de l\'email n’est pas valide à la ligne :attribute.',
            '*.birthday.required' => 'La date de naissance est obligatoire.',
            '*.birthday.date'     => 'Format de date invalide.',
            '*.birthday.before'   => 'La date de naissance doit être dans le passé.',
            '*.birthday.after'    => 'La date de naissance est trop ancienne.',
            '*.sex.in'           => 'Le sexe doit être H ou F à la ligne :attribute.',
            '*.phone.numeric' => 'Le numéro de téléphone doit être composé de chiffres.',
            '*.phone.min' => 'Le numéro de téléphone doit comporter au moins 8 chiffres.',
            '*.phone.max' => 'Le numéro de téléphone doit comporter au plus 20 chiffres.'
        ];
    }
}
