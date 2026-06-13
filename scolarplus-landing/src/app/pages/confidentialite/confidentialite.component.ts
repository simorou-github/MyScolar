import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface PolicyTable {
  headers: string[];
  rows: string[][];
}

interface PolicySection {
  title: string;
  paragraphs?: string[];
  list?: string[];
  table?: PolicyTable;
  subsections?: { title: string; paragraphs?: string[]; list?: string[] }[];
}

@Component({
  selector: 'app-confidentialite',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './confidentialite.component.html',
  styleUrls: ['./confidentialite.component.scss']
})
export class ConfidentialiteComponent {
  lastUpdate = '01 décembre 2025';

  current = signal(0);

  sections: PolicySection[] = [
    {
      title: 'Engagement du responsable de traitement',
      paragraphs: [
        "En tant que Responsable de traitement, nous sommes conscients que l'un de nos actifs les plus précieux est la confiance que nous accordent nos utilisateurs.",
        "En conséquence, la protection et la confidentialité des données est un sujet critique pour nous, et nous faisons tout notre possible pour respecter la réglementation béninoise sur la protection des données personnelles, conformément à la loi n° 2017-20 portant Code du numérique en République du Bénin (Livre 5 relatif à la protection des données personnelles et de la vie privée).",
        "La présente politique formalise donc les engagements de la société NOVAPLUS CORPORATION en matière de protection des données personnelles des utilisateurs de sa plateforme web Scolar Plus.",
        "Pour toute information sur la protection des données à caractère personnel, vous pouvez également consulter le site de l'Autorité de Protection des Données Personnelles (APDP) : contact@apdp.bj."
      ]
    },
    {
      title: 'Objet de la présente politique',
      paragraphs: [
        "Cette politique de confidentialité s'applique au site : https://portal.scolarco.com/",
        "Le but de cette politique de confidentialité est d'informer les utilisateurs de notre site web Scolar Plus des données personnelles que nous recueillerons, ainsi que les informations suivantes, le cas échéant :"
      ],
      list: [
        'Le responsable du traitement des données à caractère personnel collectées et traitées',
        'La base légale du traitement des données collectées',
        'Les catégories de données personnelles que nous collectons',
        'Les finalités pour lesquelles leurs données personnelles sont collectées',
        'La manière dont sont collectées et traitées leurs données à caractère personnel',
        'La durée de conservation des données collectées',
        'Qui a accès aux données recueillies',
        'Les mesures prises pour garantir la sécurité et la confidentialité de leurs données personnelles',
        'Les droits des utilisateurs du site concernant ces données'
      ],
      subsections: [
        {
          title: '',
          paragraphs: ["Cette politique a été élaborée le 01 décembre 2025 et reste en vigueur jusqu'à la prochaine mise à jour."]
        }
      ]
    },
    {
      title: 'Formalités préalables',
      paragraphs: [
        "Le traitement mis en œuvre sur cette plateforme est poursuivi conformément à la Délibération n° 2026-038/AT/APDP/DST/SC du 26 février 2026 délivrée par l'Autorité de Protection des Données Personnelles (APDP).",
        "Dans la suite de ce document, se trouvent tous les détails sur les données à caractère personnel que nous collectons auprès des Utilisateurs."
      ]
    },
    {
      title: 'Identité du responsable de traitement',
      paragraphs: [
        "« Le responsable du traitement est, au sens du Code du Numérique (CN), la personne physique ou morale, qui détermine les moyens et les finalités d'un traitement de données personnelles. »",
        "Le responsable des traitements de vos données personnelles mis en œuvre au travers du site web Scolar Plus est la société NOVAPLUS CORPORATION, représentée par M. SEBAPO Kwami Olivier, en sa qualité d'Auditeur.",
        "Contact téléphonique : (+229) 01 60 50 90 07 / 01 61 01 18 92",
        "Adresse email : innovagroup.infos@gmail.com"
      ]
    },
    {
      title: 'Origine des données personnelles',
      paragraphs: [
        "La société NOVAPLUS CORPORATION ne collecte aucune donnée personnelle sans le consentement préalable explicite des utilisateurs concernés.",
        "De fait, toutes les données à caractère personnel sont directement collectées auprès des Utilisateurs lors de leur inscription et lors de leurs différentes interactions sur notre plateforme web.",
        "Les données collectées et traitées dans le cadre de l'utilisation ou de l'exploitation du site web Scolar Plus concernent :"
      ],
      table: {
        headers: ['Personnes concernées', 'Données collectées'],
        rows: [
          ['Promoteur de l\'établissement scolaire', "Nom, prénom, email, numéro de téléphone, sexe, raison sociale de l'établissement scolaire, localisation (pays, ville), numéro d'identité fiscale (IFU), matricule des élèves et documents justificatifs de l'existence réelle de l'établissement scolaire."],
          ['Parents d\'élève, apprenants', "Code Scolar de l'apprenant, date de naissance de l'apprenant, année académique, numéro de téléphone."]
        ]
      }
    },
    {
      title: 'Finalités du traitement des données personnelles',
      paragraphs: [
        "Lors de leur inscription, les Utilisateurs communiquent sur le site Scolar Plus certaines données à caractère personnel nécessaires à la fourniture de services.",
        "Si les Utilisateurs ne souhaitent pas communiquer les informations qui leur sont demandées, ou s'opposent à fournir leurs données personnelles, il se peut que l'Utilisateur ne puisse pas accéder aux Services proposés sur la plateforme.",
        "Les informations sont collectées pour les finalités suivantes :"
      ],
      list: [
        'Gestion du tableau de bord (statistiques)',
        'Gestion des profils',
        'Administration',
        'Gestion des frais',
        'Gestion du module de caisse (encaissement interne ou manuel)',
        'Gestion comptable et reporting',
        'Gestion multi-établissements',
        'Gestion du paiement en ligne'
      ]
    },
    {
      title: 'Durée de conservation des données personnelles',
      paragraphs: [
        "Pour satisfaire à ses obligations légales, notamment la lutte contre le blanchiment de capitaux et le financement du terrorisme, ou afin de disposer des éléments nécessaires pour faire valoir ses droits, le responsable de traitement pourra conserver pour une durée limitée les données personnelles collectées sur son site web, en fonction de la finalité des traitements et dans les conditions prévues par la réglementation.",
        "Ainsi, les données à caractère personnel collectées au travers de la plateforme Scolar Plus relatives à l'identité et aux coordonnées de ses utilisateurs sont conservées pendant une durée maximum de dix (10) ans à compter de leur dernière opération sur la plateforme.",
        "À l'expiration des durées de conservation, les données à caractère personnel sont supprimées de façon définitive ou archivées.",
        "Ces données peuvent toutefois être supprimées à la demande des Utilisateurs qui exercent leur droit de suppression. Leur requête sera satisfaite dans un délai maximum d'un (01) mois.",
        "En cas de procédure judiciaire, les données seront conservées jusqu'à la fin de la procédure et expiration des prescriptions applicables."
      ]
    },
    {
      title: 'Sous-traitants et destinataires des données',
      paragraphs: [
        "« Le sous-traitant est une personne traitant des données à caractère personnel pour le compte du responsable du traitement. Il agit sous l'autorité du responsable du traitement et sur instruction de celui-ci. »",
        "Les données à caractère personnel des Utilisateurs peuvent être traitées par les administrateurs ou ses sous-traitants dans le strict respect des règles de protection des données personnelles."
      ],
      table: {
        headers: ['Sous-traitant', 'Rôle / Finalité', 'Base légale', 'Transfert', 'Garanties'],
        rows: [
          ['INOVACORP', 'Conception et maintenance du site Scolar Plus', 'Relation contractuelle', 'Néant : entreprise implantée au Bénin', "Sous-traitant soumis à un engagement de confidentialité et à la mise en place de mesures techniques pour assurer la protection des données traitées pour le compte du responsable de traitement."],
          ['HOSTINGER INTERNATIONAL Ltd', 'Hébergement des données du site Scolar Plus', 'Relation contractuelle', 'Lituanie — soumis au RGPD, sous le contrôle de la Valstybinė duomenų agentūra (Agence nationale des données)', "Met en place des mesures techniques et physiques (notamment chiffrement SSL) conformes aux standards européens de protection des données."]
        ]
      }
    },
    {
      title: 'Les droits des personnes Utilisateurs',
      subsections: [
        {
          title: 'Droits des Utilisateurs sur leurs données à caractère personnel',
          paragraphs: ["La loi vous donne sur vos données personnelles les droits suivants :"],
          list: [
            "Droit d'accès aux informations collectées",
            "Droit d'information",
            "Droit d'interrogation",
            "Droit de modification",
            "Droit de rectification",
            "Droit à la portabilité",
            "Droit d'opposition au traitement",
            "Droit de limitation du traitement",
            "Droit de suppression de données",
            "Droit à l'oubli",
            "Droit à la réparation"
          ]
        },
        {
          title: '',
          paragraphs: [
            "Le délai de réponse à vos demandes d'exercice de droit ne saurait excéder 30 jours.",
            "Vous pouvez consulter la définition de ces droits à l'adresse www.apdp.bj.",
            "Vous pouvez exercer vos droits en écrivant au responsable de traitement, soit par e-mail, soit par lettre, aux adresses ci-après :"
          ],
          list: [
            'innovagroup.infos@gmail.com',
            'Tél : (+229) 01 60 50 90 07 / 01 61 01 18 92'
          ]
        },
        {
          title: 'Modalités d\'exercice des droits des personnes concernées',
          paragraphs: [
            "Si les Utilisateurs souhaitent savoir comment leurs données sont traitées, ou exercer leurs droits, ils peuvent contacter NOVAPLUS CORPORATION à l'adresse suivante : innovagroup.infos@gmail.com.",
            "Dans ce cas, les Utilisateurs doivent indiquer les données à caractère personnel qu'ils souhaiteraient que NOVAPLUS CORPORATION corrige, mette à jour ou supprime, en s'identifiant de manière précise avec une copie d'une pièce d'identité (carte d'identité ou passeport) ou tout autre élément permettant de justifier de son identité."
          ]
        }
      ]
    },
    {
      title: 'Sécurité des données',
      paragraphs: [
        "La plateforme met en œuvre une série de mesures techniques afin d'assurer un niveau de protection optimal et la confidentialité des données à caractère personnel recueillies chez les utilisateurs, à l'image du cryptage, de l'implémentation des mécanismes de sécurité essentiels (protection contre XSS et injection SQL, etc.) et de l'authentification à double facteur.",
        "La confidentialité des échanges sur la plateforme est assurée par le chiffrement des bases de données, et la disponibilité des données est garantie par la sauvegarde des données chez l'hébergeur.",
        "Par ailleurs, l'équipe conceptrice de l'application a intégré à la plateforme, dès la conception et par défaut, toutes les précautions utiles, au regard de la nature des données à caractère personnel et des risques présentés par le traitement, les mesures de sécurité appropriées afin de garantir la sécurité des données à caractère personnel et, notamment, d'empêcher qu'elles soient déformées, endommagées, ou que des tiers non autorisés y aient accès.",
        "Nos sous-traitants mettent ainsi en œuvre des mesures qui respectent les principes de protection dès la conception et de protection par défaut des données traitées, prônés par l'article 423 du Code du numérique.",
        "Enfin, les personnes impliquées dans le traitement des données ont signé un engagement de confidentialité. Les sous-traitants, quant à eux, sont soumis à un contrat de confidentialité avec le responsable de traitement."
      ]
    },
    {
      title: 'Plaintes',
      paragraphs: [
        "Lorsque vous estimez qu'il y a eu violation de vos droits, vous avez la possibilité de saisir le responsable de traitement par courriel à l'adresse : innovagroup.infos@gmail.com.",
        "Si après cette démarche vous n'êtes toujours pas satisfait, vous pouvez introduire une réclamation auprès de l'APDP :"
      ],
      list: [
        'Siège de l\'institution : Rue 6.076, Aïdjèdo, Cotonou',
        'Email : contact@apdp.bj'
      ],
      subsections: [
        {
          title: '',
          paragraphs: ["Ceci est sans préjudice d'un recours devant un tribunal compétent."]
        }
      ]
    },
    {
      title: "Conditions d'application de la politique",
      paragraphs: [
        "La présente politique est susceptible d'être modifiée, complétée ou mise à jour afin de prendre en compte toute évolution légale, réglementaire, jurisprudentielle et/ou technique.",
        "En cas de modification significative de la présente politique (relative aux finalités de traitement, aux données à caractère personnel collectées, à l'exercice des droits, au transfert des données à caractère personnel), NOVAPLUS CORPORATION s'engage à en informer les Utilisateurs par tout moyen, dans un délai minimum de trente (30) jours avant leur date de prise d'effet.",
        "En cas de désaccord des Utilisateurs avec les termes de la nouvelle politique, ces derniers pourront se passer des services de la plateforme.",
        "Passé ce délai, tout accès et utilisation des Services de la plateforme sera soumis à la nouvelle politique."
      ]
    }
  ];

  total = this.sections.length;

  progress = computed(() => ((this.current() + 1) / this.total) * 100);

  goTo(i: number) {
    if (i < 0 || i >= this.total) return;
    this.current.set(i);
    document.querySelector('.pc-card')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  next() {
    this.goTo(this.current() + 1);
  }

  prev() {
    this.goTo(this.current() - 1);
  }
}
