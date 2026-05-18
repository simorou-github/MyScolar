<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\{
    FromCollection,
    WithHeadings,
    WithDrawings,
    WithEvents
};
use PhpOffice\PhpSpreadsheet\Worksheet\Drawing;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use Maatwebsite\Excel\Events\AfterSheet;
use Maatwebsite\Excel\Concerns\WithCustomStartCell;
use PhpOffice\PhpSpreadsheet\Cell\DataValidation;


class AprenantListModel implements FromCollection, WithHeadings, WithDrawings, WithEvents, WithCustomStartCell
{

    protected $classe = "";
    public function __construct(String $classe = "")
    {
        $this->classe = $classe;
    }

    /**
     * Retourne les données à exporter.
     */
    public function collection()
    {
        return collect([]);
    }


    public function startCell(): string
    {
        return 'A5'; // Les headings commenceront ici
    }

    /**
     * Définit les en-têtes de colonnes dans le fichier Excel.
     */
    public function headings(): array
    {
        return ['NOM', 'PRENOMS', 'DATE DE NAISSANCE', 'SEXE', 'EMAIL', 'TELEPHONE', 'MATRICULE ECOLE'];
    }
    /**
     * Ajout du logo
     */
    public function drawings()
    {
        $drawing = new Drawing();
        $drawing->setName('Logo');
        $drawing->setDescription('Logo Scolarpay');
        $drawing->setPath(public_path('/images/ScolarPlusLogo_AvecFond_1.png')); 
        $drawing->setHeight(60);
        $drawing->setCoordinates('A1');

        return $drawing;
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {

                $event->sheet->mergeCells('B2:H2');
                $event->sheet->setCellValue('B2', 'LISTE DES ELEVES A CHARGER DANS VOTRE BASE');
                $event->sheet->getStyle('B2')->applyFromArray([
                    'font' => ['bold' => true, 'size' => 20,],
                    'alignment' => [
                        'horizontal' => Alignment::HORIZONTAL_CENTER,
                        'vertical'   => Alignment::VERTICAL_CENTER,
                    ]
                ]);

                $event->sheet->mergeCells('A3:H3');
                $event->sheet->setCellValue('A3', 'CLASSE : ' . $this->classe);
                $event->sheet->getStyle('A3')->applyFromArray([
                    'font' => ['italic' => true, 'size' => 16],
                    'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
                ]);

                $event->sheet->getStyle('A5:H5')->applyFromArray([
                    'font' => ['bold' => true],
                    'fill' => [
                        'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                        'startColor' => ['rgb' => 'DCE6F1']
                    ],
                    'alignment' => [
                        'horizontal' => Alignment::HORIZONTAL_CENTER,
                        'vertical' => Alignment::VERTICAL_CENTER,
                    ],
                    'borders' => [
                        'allBorders' => [
                            'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                            'color' => ['argb' => '000000'],
                        ],
                    ],
                ]);

                foreach (range('A', 'H') as $col) {
                    $event->sheet->getDelegate()->getColumnDimension($col)->setAutoSize(false);
                }

                $event->sheet->getDelegate()->getColumnDimension('A')->setWidth(32);
                $event->sheet->getDelegate()->getColumnDimension('B')->setWidth(40);
                $event->sheet->getDelegate()->getColumnDimension('C')->setWidth(18);
                $event->sheet->getDelegate()->getColumnDimension('E')->setWidth(28);
                $event->sheet->getDelegate()->getColumnDimension('F')->setWidth(12);
                $event->sheet->getDelegate()->getColumnDimension('G')->setWidth(15);

                // AJOUT DES VALIDATIONS 
                $sheet = $event->sheet->getDelegate();

                // Colonne NOM (A) et PRENOMS (B) → uniquement texte (interdire numérique)
                foreach (['A', 'B'] as $col) {
                    $validation = $sheet->getCell($col . '6')->getDataValidation();
                    $validation->setType(DataValidation::TYPE_CUSTOM);
                    $validation->setErrorStyle(DataValidation::STYLE_STOP);
                    $validation->setAllowBlank(true);
                    $validation->setShowInputMessage(true);
                    $validation->setShowErrorMessage(true);
                    $validation->setErrorTitle('Erreur');
                    $validation->setError('Seul le texte est autorisé.');
                    $validation->setPromptTitle('Texte uniquement');
                  //  $validation->setPrompt('Veuillez entrer uniquement des lettres.');
                    $validation->setFormula1('=ESTTEXTE(' . $col . '6)');

                    // Appliquer la règle sur plusieurs lignes (par ex. 6 à 500)
                    for ($row = 6; $row <= 500; $row++) {
                        $sheet->getCell($col . $row)->setDataValidation(clone $validation);
                    }
                }

                // Colonne DATE DE NAISSANCE (C) → doit être une date
                $validationDate = new DataValidation();
                $validationDate->setType(DataValidation::TYPE_DATE);
                $validationDate->setErrorStyle(DataValidation::STYLE_STOP);
                $validationDate->setAllowBlank(true);
                $validationDate->setShowInputMessage(true);
                $validationDate->setShowErrorMessage(true);
                $validationDate->setErrorTitle('Erreur');
                $validationDate->setError('La valeur doit être une date valide.');
                $validationDate->setPromptTitle('Date attendue');
                $validationDate->setPrompt('Veuillez entrer une date valide.');

                for ($row = 6; $row <= 500; $row++) {
                    $sheet->getCell('C' . $row)->setDataValidation(clone $validationDate);
                }

                // Colonne SEXE (D) → Liste déroulante "M" ou "F"
                $validationSexe = new DataValidation();
                $validationSexe->setType(DataValidation::TYPE_LIST);
                // Interdit toute autre valeur
                $validationSexe->setErrorStyle(DataValidation::STYLE_STOP); 
                // Oblige à choisir une valeur
                $validationSexe->setAllowBlank(false);
                $validationSexe->setShowInputMessage(true);
                $validationSexe->setShowErrorMessage(true);
                // Affiche la flèche du select
                $validationSexe->setShowDropDown(true); 
                $validationSexe->setErrorTitle('Valeur invalide');
                $validationSexe->setError('Veuillez sélectionner "M" pour Masculin ou "F" pour "Féminin".');
                $validationSexe->setPromptTitle('Choisir le sexe');
                $validationSexe->setPrompt('Sélectionnez une valeur (M ou F).');
                $validationSexe->setFormula1('"M,F"');

                for ($row = 6; $row <= 500; $row++) {
                    $sheet->getCell('D' . $row)->setDataValidation(clone $validationSexe);
                }
            }
        ];
    }
}
