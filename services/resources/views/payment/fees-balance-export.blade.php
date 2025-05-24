<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8">
  <title>Soldes des Frais </title>
</head>

<body style="font-family: 'Gill Sans', sans-serif;">
  <style type="text/css">
    p {
      line-height: 200%;
      font-size: 18px;
      text-shadow: 1px 1px rgba(0, 0, 0, 0.1)
    }

    .mt-5 {
      margin-top: 50px;
    }
    table{
      border-collapse: collapse !important;
      font-size: 9px;
    }
    td{
        padding-left: 1px;
        padding-right: 1px;
    }

    @page {
      @bottom-center {
        content: element(footer)
      }
    }
  </style>
    <div style="width: 100%; text-align: center;">
        <img src="{{ storage_path('images/logo-scolarplus2.png') }}" alt="Scolar Plus"/>
        <h1 style="font-family: 'Gill Sans', sans-serif; padding: 10px ;">SCOLAR PLUS</h1>
        <h3 style="font-family: 'Gill Sans', sans-serif; margin-top: -20px;">SOLDE DES FRAIS A COLLECTER </h3>
    </div>
    <hr style="border: 3px solid #f8f8fb; margin-bottom: 2px;">
    <div style="width: 100%; font-family: 'Gill Sans', sans-serif;  margin-top: 25px !important; margin-bottom: 5px;">
      <div style="display: inline-block; height: 50px; width: 20%; text-align: center; padding-top: 1px; background: #f8f8fb; border: solid 2px #cadaec; border-radius: 10px;">
        <span style="padding: 3px; font-size: 16px;">Nombre <br> <i style="padding-top: 20px; font-size:  13px;">{{number_format($nbre_fees,0,' ',' ')}} Frais</i></span>
      </div>
      <div style="margin-left: 3px; display: inline-block; height: 50px;  width: 18%; text-align: center; padding-top: 1px; background: #f8f8fb; border: solid 2px #cadaec; border-radius: 10px;">
        <span style="padding: 3px; font-size: 16px;">Total à Collecter <br><i style="padding-top: 20px; font-size:  13px;">{{number_format($sum_fees,0,' ',' ')}} CFA</i></span>
      </div>
      <div style="margin-left: 3px; display: inline-block;  height: 50px; width: 19%; text-align: center; padding-top: 1px; background: #f8f8fb; border: solid 2px #cadaec; border-radius: 10px;">
        <span style="padding: 3px; font-size: 16px;">Total Collecté <br><i style="padding-top: 20px; font-size:  13px;">{{number_format(($sum_fees-$sum_balance),0,' ',' ')}} CFA</i></span>
      </div>
      <div style="margin-left: 3px; display: inline-block;  height: 50px; width: 18%; text-align: center; padding-top: 1px; background: #f8f8fb; border: solid 2px #cadaec; border-radius: 10px;">
        <span style="padding: 3px; font-size: 16px;">Reste à Collecter <br><i style="padding-top: 20px; font-size:  13px;">{{number_format($sum_balance,0,' ',' ')}} CFA</i></span>
      </div>
      <div style="margin-left: 3px; display: inline-block;  height: 50px; width: 20%; text-align: center; padding-top: 1px; background: #f8f8fb; border: solid 2px #cadaec; border-radius: 10px;">
        <span style="padding: 3px; font-size: 16px;">Efficacité <br><i style="padding-top: 20px; font-size:  13px;">{{number_format((($sum_fees-$sum_balance)/$sum_fees)*100,0,' ',' ')}}%</i></span>
      </div>
    </div>

    <div style="margin-top: -10px;" >
        <table style="border: solid 1px #dee2e6; font-family: 'Gill Sans', sans-serif; font: size 9px;" width="100%">
            <thead>
            <tr style="height: 35px; border: solid 1px #dee2e6; background: #f8f8fb; font-size: 9px;">
                <th style="height: 35px; border: solid 1px #dee2e6; text-align: center;">NUMERO</th>
                <th style="height: 35px; border: solid 1px #dee2e6;">CODE SCOLAR</th>
                <th style="height: 35px; border: solid 1px #dee2e6;">NOM APPRENANT</th>
                <th style="height: 35px; border: solid 1px #dee2e6;">CLASSE</th>
                <th style="height: 35px; border: solid 1px #dee2e6;">ECOLE</th>
                <th style="height: 35px; border: solid 1px #dee2e6;">ANNEE</th>
                <th style="height: 35px; border: solid 1px #dee2e6;">TYPE FRAIS</th>
                <th style="height: 35px; border: solid 1px #dee2e6; text-align:center;">MONTANT</th>
                <th style="height: 35px; border: solid 1px #dee2e6; text-align:center;">TOTAL PAYE</th>
                <th style="height: 35px; border: solid 1px #dee2e6; text-align:center;">RESTE A PAYER</th>
            </tr>
            </thead>
            <tbody>
            @php
                $index = 1;
            @endphp
            @foreach ($balanceFeesData as $balance)
            <tr style="border: solid 1px #dee2e6; font-size: 8px;">
                <td style="border: solid 1px #dee2e6; text-align: center;">{{$index}}</td>
                <td style="border: solid 1px #dee2e6; padding: 1px;">{{$balance->code_scolar}}</td>
                <td style="border: solid 1px #dee2e6; padding: 1px;">{{$balance->student_last_name}} {{$balance->student_first_name}}</td>
                <td style="border: solid 1px #dee2e6; padding: 1px;">{{$balance->classe_code.'-'.$balance->groupe_code}}</td>
                <td style="border: solid 1px #dee2e6; padding: 1px;">{{$balance->social_reason}}</td>
                <td style="border: solid 1px #dee2e6; padding: 1px;">{{$balance->academic_year}}</td>
                <td style="height: 35px; border: solid 1px #dee2e6;">{{$balance->type_fees_label}}, {{ $balance->fees_label}}</td>
                <td style="height: 35px; border: solid 1px #dee2e6; text-align:center;">{{number_format($balance->fees_amount,0,' ',' ')}}</td>
                <td style="height: 35px; border: solid 1px #dee2e6; text-align:center;">{{number_format(($balance->fees_amount-$balance->balance),0,' ',' ')}}</td>
                <td style="height: 35px; border: solid 1px #dee2e6; text-align:center;">{{number_format($balance->balance,0,' ',' ')}}</td>
                </tr>
                @php
                $index ++;
                @endphp
            @endforeach
            </tbody>
        </table>
    </div>
</body>

</html>