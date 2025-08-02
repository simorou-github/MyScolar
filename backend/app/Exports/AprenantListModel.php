<?php

namespace App\Exports;
use Maatwebsite\Excel\Concerns\{
    FromCollection, WithHeadings, WithDrawings, WithEvents
};
use PhpOffice\PhpSpreadsheet\Worksheet\Drawing;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use Maatwebsite\Excel\Events\AfterSheet;
use Maatwebsite\Excel\Concerns\WithCustomStartCell;


class AprenantListModel implements FromCollection, WithHeadings, WithDrawings, WithEvents, WithCustomStartCell
{

    protected $classe = "";
    public function __construct(String $classe = "") {
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
        return 'A5'; // 👉 Les headings commenceront ici
    }

    /**
     * Définit les en-têtes de colonnes dans le fichier Excel.
     */
    public function headings(): array
    {
        return ['NOM', 'PRENOMS', 'DATE DE NAISSANCE', 'SEXE', 'EMAIL', 'TELEPHONE', 'MATRICULE', 'ECOLE'];
    }
        /**
     * Ajout du logo
     */
    public function drawings()
    {
        $drawing = new Drawing();
        $drawing->setName('Logo');
        $drawing->setDescription('Logo Scolarpay');
        $drawing->setPath(public_path('/images/scolar_logo.jpg')); // ton logo ici
        $drawing->setHeight(60);
        $drawing->setCoordinates('A1');

        return $drawing;
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function(AfterSheet $event) {

                // Titre sur la 2e ligne, fusionné de B2 à H2
                $event->sheet->mergeCells('B2:H2');

                $event->sheet->setCellValue('B2', 'LISTE DES ELEVES A CHARGER DANS VOTRE BASE');

                $event->sheet->getStyle('B2')->applyFromArray([
                    'font' => ['bold' => true, 'size' => 20,],
                    'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical'   => Alignment::VERTICAL_CENTER,]
                ]);
                
                // 📝 Sous-titre en A3:H3
                $event->sheet->mergeCells('A3:H3');
                $event->sheet->setCellValue('A3', 'CLASSE : '. $this->classe);
                $event->sheet->getStyle('A3')->applyFromArray([
                    'font' => ['italic' => true, 'size' => 16],
                    'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
                ]);

                 // 📘 Style des headings (ligne 5 : A5 à H5)
                $event->sheet->getStyle('A5:H5')->applyFromArray([
                    'font' => ['bold' => true],
                    'fill' => [
                        'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                        'startColor' => ['rgb' => 'DCE6F1']  // Bleu très clair
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

                // Ajustement automatique des colonnes
                foreach (range('A', 'H') as $col) {
                    $event->sheet->getDelegate()->getColumnDimension($col)->setAutoSize(true);
                }
            }
        ];
    }
}