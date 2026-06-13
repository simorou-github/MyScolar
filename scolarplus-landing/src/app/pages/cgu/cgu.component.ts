import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface CguArticle {
  id: string;
  title: string;
  paragraphs?: string[];
  list?: string[];
  subsections?: { title: string; paragraphs?: string[]; list?: string[] }[];
}

@Component({
  selector: 'app-cgu',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cgu.component.html',
  styleUrls: ['./cgu.component.scss']
})
export class CguComponent {
  lastUpdate = '10 juin 2026';

  scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  articles: CguArticle[] = [
    {
      id: 'article-1',
      title: 'Article 1 : Mentions légales',
      paragraphs: [
        "NOVAPLUS CORPORATION, soucieuse du respect des réglementations protectrices des droits fondamentaux et des libertés individuelles des individus, met à votre disposition cet accord, à lire attentivement, car il contient des informations importantes concernant vos droits et recours légaux.",
        "Conformément aux articles 328 et 415 de la loi n° 2020-35 du 06 janvier 2021 modifiant la loi n° 2017-20 du 20 avril 2018 portant Code du numérique en République du Bénin, nous vous informons que cette plateforme web « Scolar Plus », mise en œuvre au Bénin est la propriété exclusive de NOVAPLUS CORPORATION.",
        "Spécialiste dans la création de solutions digitales, NOVAPLUS CORPORATION est située dans la ville de Cotonou. Contact : innovagroup.infos@gmail.com. Ci-après dénommé « l'Éditeur ».",
        "Le site web (plateforme web) donne accès à plusieurs informations de services, de programme ou de données (ci-après, « Contenu ») appartenant à l'Éditeur."
      ]
    },
    {
      id: 'article-2',
      title: "Article 2 : L'Hébergeur des données",
      paragraphs: [
        "Pour assurer la conservation et la disponibilité des données du site web Scolar Plus, NOVAPLUS CORPORATION utilise les services de l'hébergeur HOSTINGER INTERNATIONAL Ltd, société de droit lituanien, ayant son siège social en Lituanie et soumis au Règlement Général sur la Protection des Données (RGPD)."
      ]
    },
    {
      id: 'article-3',
      title: "Article 3 : Mise en garde de l'utilisateur",
      paragraphs: [
        "En utilisant et en parcourant le site web, vous, en votre qualité d'Utilisateur acceptez de vous conformer aux présentes Conditions Générales d'Utilisation (ci-après dénommées « CGU ») que vous reconnaissez avoir lues, comprises et acceptées dans leur intégralité.",
        "Si vous refusez d'accepter les présentes CGU, nous vous remercions de ne pas parcourir le contenu du site web ou mobile. Elles entrent en vigueur à la date de leur mise en ligne.",
        "Les présentes CGU sont opposables pendant toute la durée d'utilisation de la plateforme Scolar Plus et jusqu'à ce que de nouvelles CGU viennent remplacer les présentes. Les « CGU » sont accessibles sur le site web dès la première utilisation et restent disponibles tout le temps sur la page d'inscription à travers le lien « Conditions Générales d'Utilisation ».",
        "Veuillez les lire attentivement avant d'utiliser le site web Scolar Plus. La violation de l'une des clauses contenues dans les présentes « CGU » peut entraîner l'interruption de la fourniture du Contenu par l'Éditeur.",
        "L'Utilisateur déclare avoir pris connaissance et accepté les présentes conditions générales d'utilisation."
      ]
    },
    {
      id: 'article-4',
      title: 'Article 4 : Licence d\'utilisation de la plateforme web et mobile',
      paragraphs: [
        "L'Éditeur concède à l'Utilisateur un simple droit d'utilisation du site web et plateforme mobile Scolar Plus, du contenu et de ses éléments, non exclusif, révocable, non cessible, non transférable, gratuit et mondial.",
        "Cette licence est accordée à l'Utilisateur uniquement pour ses besoins propres, à l'exclusion de toute exploitation commerciale ou à but lucratif de tout ou partie du Contenu et/ou des Éléments.",
        "L'Utilisateur n'acquiert aucun autre droit sur le Site, le Contenu et/ou les Éléments autres que ceux conférés par les présentes CGU.",
        "Scolar Plus web comme mobile est dédié aux Utilisateurs majeurs (ayant atteint l'âge en vigueur pour être qualifié de majeur). De ce fait, il est déconseillé aux mineurs l'utilisation de Scolar Plus. Dans tous les cas, l'éditeur ne peut être garant d'aucun désagrément causé par l'utilisation de cette plateforme par des mineurs."
      ]
    },
    {
      id: 'article-5',
      title: 'Article 5 : Accès à la plateforme web et mobile',
      paragraphs: [
        "Scolar Plus est accessible depuis le réseau Internet à l'adresse suivante : https://portal.scolarco.com/",
        "L'Éditeur s'engage à faire ses meilleurs efforts pour sécuriser l'accès, la consultation et l'utilisation du site web.",
        "La plateforme Scolar Plus est accessible en continu, sauf en cas de force majeure ou de survenance d'un évènement hors du contrôle de l'Éditeur, et sous réserve des éventuelles pannes et interventions de maintenance nécessaires au bon fonctionnement du site web."
      ]
    },
    {
      id: 'article-6',
      title: 'Article 6 : Création de compte',
      paragraphs: [
        "Lors de la création de son compte, l'Utilisateur s'engage à fournir des informations exactes, complètes et à jour à tout moment concernant son état civil et ses coordonnées, notamment son nom, son prénom, son email, son numéro de téléphone, son sexe, la raison sociale de son établissement scolaire, son pays, sa ville, son numéro d'identité fiscale (IFU), les informations sur ses élèves et les documents justificatifs de l'existence réelle de son entité.",
        "Pendant la procédure de paiement des frais, l'Utilisateur s'engage à fournir des informations (matricule, année scolaire et date de naissance) justes et non usurpées pour l'identification et l'obtention des détails sur l'élève et les frais le concernant.",
        "La plateforme web Scolar Plus est ouverte à tout Utilisateur, promoteur d'école et de centre de formation, parent d'élève et apprenant, désireux de faciliter le paiement, recouvrement et la traçabilité sur les transactions telles que les frais de scolarité ou de formation, de travaux dirigés, de cantine, etc., dans le strict respect des réglementations en vigueur dans son pays et des présentes Conditions Générales d'Utilisation.",
        "En tout état de cause, l'Utilisateur s'interdit d'utiliser comme nom d'utilisateur le nom d'une autre personne ou entité, ou un nom ou une marque soumis à des droits d'une autre personne ou entité sans autorisation appropriée, ou un nom qui est autrement offensant, vulgaire ou obscène.",
        "L'Éditeur se réserve le droit de vérifier l'exactitude de ces informations et de refuser ou annuler toute inscription contenant des données inexactes, usurpées ou frauduleuses.",
        "L'Utilisateur peut supprimer son compte de la plateforme Scolar Plus en adressant une requête à l'administrateur du site web. Celle-ci sera effective dans un délai raisonnable tel que mentionné dans la Politique de confidentialité des données.",
        "L'Utilisateur est responsable du maintien de la confidentialité de son compte. L'Éditeur n'est pas responsable de tout dommage ou perte pouvant résulter d'une erreur de votre part dans la protection de vos informations d'accès, y compris votre mot de passe.",
        "L'Utilisateur s'oblige à nous informer immédiatement dès qu'il a connaissance d'une violation de la sécurité ou d'une utilisation non autorisée de son compte, et s'engage à faire un usage approprié du Contenu de la plateforme."
      ],
      list: [
        "S'engager dans des activités illégales ou contraires à la bonne foi et à l'ordre public",
        "Diffuser du contenu ou de la propagande de nature raciste, xénophobe, pornographique et illégale, prôner le terrorisme ou attaquer les droits de l'homme",
        "Causer des dommages aux systèmes de l'Éditeur ou aux autres Utilisateurs de Scolar Plus",
        "Essayer d'accéder et, le cas échéant, utiliser les comptes de courrier électronique d'autres utilisateurs et modifier ou manipuler leurs messages"
      ]
    },
    {
      id: 'article-7',
      title: 'Article 7 : Services de la plateforme web et mobile',
      paragraphs: [
        "Le site web Scolar Plus a été mis en œuvre pour faciliter le paiement, le recouvrement et la traçabilité des frais de scolarité, de formation, et autres frais associés à l'apprentissage des apprenants dans les établissements, écoles et centres de formation au Bénin et ailleurs.",
        "À cette fin, les services de cette plateforme sont destinés à tous les Utilisateurs intéressés par les offres proposées par Scolar Plus. Ainsi, elle permet à l'Utilisateur un accès gratuit aux fonctionnalités suivantes :"
      ],
      subsections: [
        {
          title: 'Un Espace École composé de :',
          list: [
            'Tableau de bord (Statistiques)',
            'Gestion des profils',
            'Administration',
            'Gestion des frais',
            'Module de caisse (Encaissement interne via la caisse de l\'école)',
            'Gestion comptable et reporting',
            'Gestion multi-établissements'
          ]
        },
        {
          title: 'Un Espace Payeur composé de :',
          list: ['Paiement en ligne']
        }
      ]
    },
    {
      id: 'article-7-suite',
      title: '',
      paragraphs: [
        "Cette liste est non exhaustive et peut être modifiée à tout moment par l'Éditeur sans que sa responsabilité ne puisse être engagée à ce titre par qui que ce soit. Le site web est accessible gratuitement en tout lieu à tout Utilisateur ayant un accès à Internet.",
        "L'Utilisateur accepte que l'Éditeur puisse ajouter, supprimer ou modifier des fonctionnalités à la plateforme Scolar Pay, sans préavis ni indemnité. Toutes les fonctionnalités seront soumises aux mêmes Conditions Générales d'Utilisation.",
        "L'Éditeur peut recueillir des suggestions de la part de l'Utilisateur, mais en aucun cas il ne s'engage à ajouter, modifier ou éliminer ces fonctionnalités en réponse à ces suggestions."
      ]
    },
    {
      id: 'article-8',
      title: 'Article 8 : Conditions Générales de Vente',
      paragraphs: [
        "Pour une meilleure collecte des frais pour le compte des établissements, écoles et/ou centres de formation inscrits sur la plateforme, Scolar Pay accepte que les transactions financières soient effectuées au travers du site web.",
        "Les établissements, écoles et/ou centres de formation, partenaires, mettent donc à disposition des parents d'élèves ou des apprenants les informations indispensables, notamment le Code Scolar Pay de l'apprenant, pour faciliter et sécuriser le paiement des différents frais associés à l'apprenant.",
        "Le payeur (parents/apprenants) reconnaît et accepte expressément que le montant des fonds qu'il dépose sera viré vers le compte de paiement du destinataire (l'établissement, le centre de formation et/ou de l'école).",
        "L'Éditeur décline toute responsabilité relative aux différends qui découleront des opérations financières effectuées entre les Utilisateurs en dehors de la plateforme Scolar Plus.",
        "Le Payeur s'engage à se soumettre à toutes les lois et conventions internationales régissant la lutte contre le blanchiment de capitaux et le financement du terrorisme, applicables dans les pays.",
        "L'Éditeur, pour le respect de ces lois et conventions, se réserve le droit d'assurer la traçabilité de toutes les transactions financières effectuées directement sur sa plateforme.",
        "Les présentes Conditions Générales de Vente s'appliquent à toutes les transactions pécuniaires effectuées au travers du site web Scolar Plus.",
        "L'Éditeur se réserve le droit de modifier les présentes, à tout moment par la publication d'une nouvelle version sur son site web. Les conditions générales de vente (CGV) applicables sont celles en vigueur à la date de paiement (ou du premier paiement en cas de paiements multiples) des frais."
      ]
    },
    {
      id: 'article-9',
      title: 'Article 9 : Limitation contractuelle',
      subsections: [
        {
          title: '9.1. Responsabilité générale',
          paragraphs: ["Dans la limite des lois et règlements applicables, l'Éditeur du site web ne saurait être tenu responsable :"],
          list: [
            'De la qualité du site web',
            "De la perturbation dans l'utilisation des services",
            "De l'impossibilité d'utiliser les services",
            "Du dysfonctionnement du site web en raison d'une cause volontaire ou involontaire, imputable à l'Utilisateur, à un tiers ou à un acte de malveillance, d'un logiciel, du smartphone/tablette, d'une interface ou tout autre produit ou fourniture de l'Utilisateur",
            "Des atteintes à la sécurité informatique, pouvant causer des dommages aux matériels informatiques des Utilisateurs et à leurs données. Vous devez prendre toutes les mesures appropriées pour protéger votre matériel et vos propres données notamment d'attaques virales par Internet",
            "Du fait de l'usage du site web",
            "Du fait du non-respect par vous des présentes Conditions Générales",
            "Des dommages causés à vous-même, à des tiers et/ou à votre équipement du fait de votre connexion ou de votre utilisation du site web"
          ]
        },
        {
          title: '9.2. Responsabilité à l\'égard des informations présentes sur le site web',
          paragraphs: [
            "L'Éditeur fait ses meilleurs efforts pour proposer sur sa plateforme Scolar Plus des informations à jour, et déploie des efforts permanents en termes humain, technique et financier pour assurer un service de qualité professionnelle en faveur des Utilisateurs.",
            "En dépit de ces efforts, l'Éditeur ne pourra en aucun cas être tenu responsable pour toute erreur involontaire de sa part ayant pour conséquence l'absence d'exactitude, de fiabilité, de pertinence, d'exhaustivité ou d'actualité des informations insérées pour décrire un évènement ou un bien sur le site web.",
            "L'Éditeur ne saurait être tenu responsable de toute erreur ou omission. Toute mise à jour, nouvelle prestation ou nouvelle caractéristique qui améliore ou augmente un ou plusieurs contenus d'informations existantes sera soumise aux présentes conditions."
          ]
        }
      ]
    },
    {
      id: 'article-10',
      title: "Article 10 : Engagements de l'Utilisateur",
      paragraphs: [
        "L'utilisateur s'engage à utiliser le site web Scolar Plus conformément aux réglementations nationales et internationales. Il s'engage en particulier à :"
      ],
      list: [
        'Prendre connaissance des présentes CGU et à s\'y conformer',
        "Ne pas utiliser les coordonnées des autres utilisateurs pour toute action autre que celle initialement prévue par les présentes CGU",
        "Ne pas reproduire de façon permanente ou provisoire le site web, en tout ou partie, par tout moyen et sous toute forme",
        "Ne pas utiliser de logiciels ou de procédés destinés à copier le contenu sans l'autorisation préalable écrite de l'Éditeur",
        "Ne pas procéder à toute adaptation, modification, traduction, transcription, arrangement, compilation, décompilation, assemblage, désassemblage, transcodage, ni appliquer la rétro-ingénierie de tout ou partie du site web",
        "Ne pas exporter le site web, ni fusionner tout ou partie du site web avec d'autres programmes informatiques",
        "Ne procéder qu'à de courtes citations, analyses et reproductions destinées à des revues de presse ainsi qu'aux autres utilisations expressément autorisées par la loi, sous réserve de citer le nom des auteurs et la source éditoriale",
        "Renoncer expressément à utiliser des logiciels ou dispositifs susceptibles de perturber le bon fonctionnement du site web, ni à engager d'action de nature à imposer une charge disproportionnée pour les infrastructures de l'Éditeur",
        "Ne pas utiliser de robots informatiques ou tout autre procédé automatique pour accéder à nos Services pour quelque raison que ce soit",
        "Ne pas contourner nos protocoles d'exclusion de robots, perturber ou tenter de perturber le fonctionnement de nos Services, ou imposer une charge déraisonnable ou disproportionnée sur nos infrastructures",
        "Ne pas extraire ou réutiliser, y compris à des fins privées, sans autorisation préalable écrite, une partie substantielle ou non du contenu des bases de données et archives constituées par le site web",
        "Ne pas mettre en place des systèmes susceptibles de pirater le site web et/ou le contenu en tout ou partie, ou de nature à violer les présentes CGU",
        "Informer l'Éditeur dès la connaissance d'un acte de piratage et en particulier de toute utilisation illicite ou non contractuelle du site web et/ou du contenu, quel que soit le mode de diffusion",
        "Ne pas vendre, louer, sous-licencier ou distribuer de quelque façon que ce soit le site web",
        "Ne pas utiliser le site web pour afficher, télécharger ou transmettre tout contenu contraire aux bonnes mœurs et à l'ordre public (notamment tout contenu à caractère racial, politique, religieux, pornographique ou sexuel)"
      ]
    },
    {
      id: 'article-10-suite',
      title: '',
      paragraphs: [
        "L'Utilisateur étant seul responsable de l'utilisation du site web, il reconnaît que l'Éditeur ne pourra être tenu responsable des dommages directs ou indirects, et notamment préjudice matériel, préjudice immatériel, perte de données ou de programme, préjudice financier, résultant de l'accès ou de l'utilisation du site web, ou du fait, notamment, de l'interruption, la suspension ou la modification du site web ou d'un de ses éléments."
      ]
    },
    {
      id: 'article-11',
      title: 'Article 11 : Données à caractère personnel',
      paragraphs: [
        "Conformément à la loi relative à la protection des données à caractère personnel, notamment la loi n° 2020-35 du 06 janvier 2021 modifiant la loi n° 2017-20 du 20 avril 2018 portant Code du numérique en République du Bénin, l'Utilisateur est informé que l'Éditeur, en tant que responsable de traitement, met en œuvre un traitement de données à caractère personnel.",
        "Pour en savoir plus sur ce traitement de données à caractère personnel et sur l'étendue de leurs droits, les Utilisateurs sont invités à se reporter à la Politique de confidentialité disponible continuellement sur le site web."
      ]
    },
    {
      id: 'article-12',
      title: 'Article 12 : Propriété intellectuelle',
      paragraphs: [
        "L'Éditeur est titulaire de tous les droits de propriété intellectuelle relatifs au site web Scolar Plus.",
        "Les marques, logos, signes ainsi que tous les contenus de la plateforme web Scolar Plus (le code source, les textes, les articles, les images, etc.) font l'objet d'une protection par le Code de la propriété intellectuelle et plus particulièrement par le droit d'auteur.",
        "L'Utilisateur doit solliciter l'autorisation préalable du promoteur du site web pour toute reproduction, publication, copie des différents contenus. Il s'engage à une utilisation des contenus du site web dans un cadre strictement privé, toute utilisation à des fins commerciales et publicitaires étant strictement interdite.",
        "Toute représentation totale ou partielle de cette plateforme web par quelque procédé que ce soit, sans l'autorisation expresse de l'Éditeur du site web Scolar Plus, constituerait une contrefaçon sanctionnée par le Code de la propriété intellectuelle.",
        "Les présentes conditions générales d'utilisation n'emportent aucune cession d'aucune sorte de droit de propriété intellectuelle sur les éléments appartenant à l'Éditeur du site web Scolar Plus ou ayants droit, tels que les sons, photographies, images, textes littéraires, bases de données, travaux artistiques, logiciels, marques, chartes graphiques, logos, au bénéfice de l'Utilisateur.",
        "L'Éditeur concède à l'Utilisateur une licence non exclusive pour utiliser le site web. Cette licence est strictement personnelle et ne peut en aucun cas être cédée ou transférée à quelque tiers que ce soit. La licence est concédée pour la durée d'utilisation du site web.",
        "En conséquence, l'Utilisateur s'interdit tout agissement et tout acte susceptible de porter atteinte directement ou non aux droits de propriété intellectuelle du site web Scolar Plus."
      ]
    },
    {
      id: 'article-13',
      title: 'Article 13 : Liens hypertextes',
      paragraphs: [
        "Le site web peut contenir des liens hypertextes vers d'autres sites présents sur le réseau Internet. Les liens vers ces autres ressources vous font quitter le site web. L'Éditeur décline toute responsabilité relative au contenu de ces sites tiers et ne saurait être tenu responsable de l'usage qui pourra en être fait par les utilisateurs.",
        "Aucune autorisation ou demande d'information préalable ne peut être exigée par l'Éditeur à l'égard d'une application tierce, ou d'un site tiers qui souhaite établir un lien vers le site web de l'Éditeur.",
        "Cependant, l'Éditeur se réserve le droit de demander la suppression d'un lien qu'il estime non conforme à l'objet du site web, ou si ledit lien procède d'une démarche délibérée et malicieuse, entreprise en toute connaissance de cause par l'exploitant du site web d'origine."
      ]
    },
    {
      id: 'article-14',
      title: 'Article 14 : Utilisation de cookies',
      paragraphs: [
        "La plateforme Scolar Plus utilise les cookies pour personnaliser au maximum son fonctionnement afin de faciliter l'utilisation de la plateforme lors de la navigation de l'Utilisateur. Les cookies utilisés par le site web expirent après la session.",
        "Lors de votre première connexion sur le site web Scolar Plus, vous êtes averti par un bandeau en bas de votre écran que des informations relatives à votre navigation sont susceptibles d'être enregistrées dans des fichiers dénommés « cookies ».",
        "Les « cookies » (ou témoins de connexion) sont des petits fichiers texte de taille limitée qui nous permettent de reconnaître votre ordinateur, votre tablette ou votre mobile aux fins de personnaliser les services que nous vous proposons.",
        "Vous pouvez accepter ou refuser le dépôt de cookies à tout moment. Aucune de ces informations ne fait l'objet d'une communication auprès de tiers, sauf lorsque l'Éditeur a obtenu au préalable votre consentement ou bien lorsque la divulgation de ces informations est requise par la loi, sur ordre d'un tribunal ou de toute autorité administrative ou judiciaire habilitée à en connaître.",
        "Certains navigateurs peuvent accepter automatiquement les cookies tandis que d'autres peuvent être configurés pour refuser les cookies ou vous alerter lorsqu'un site web souhaite placer un cookie sur votre ordinateur. Si vous choisissez de désactiver les cookies, cela peut limiter votre capacité à utiliser notre site web."
      ]
    },
    {
      id: 'article-15',
      title: 'Article 15 : Droit applicable - Litiges',
      paragraphs: [
        "Les présentes CGU seront soumises et interprétées conformément au droit béninois.",
        "Tout litige qui surviendrait concernant l'interprétation et/ou l'exécution des présentes CGU devra faire l'objet d'une tentative de règlement amiable.",
        "Tout litige non réglé de manière amiable sera porté devant les tribunaux matériellement compétents dont dépend le bureau principal de l'Éditeur.",
        "La langue de référence, pour le règlement de contentieux éventuels, est le français."
      ]
    },
    {
      id: 'article-16',
      title: 'Article 16 : Mise à jour des CGU – Retrait – Contacts',
      paragraphs: [
        "L'Éditeur se réserve le droit de modifier les présentes CGU, selon l'évolution du site web Scolar Plus ou en raison de l'évolution de la législation, à sa seule discrétion.",
        "D'une manière générale, l'utilisation de la plateforme web Scolar Plus par l'utilisateur est toujours soumise à la version la plus récente des CGU accessibles au moment de cette utilisation. Il appartient à l'utilisateur de consulter aussi souvent que nécessaire les CGU accessibles sur le site web.",
        "L'Éditeur peut également faire cesser de façon temporaire ou définitive le fonctionnement du site web. Toutefois, en cas de retrait, les droits fondamentaux des utilisateurs vis-à-vis de leurs données à caractère personnel sont garantis.",
        "Toute question relative à l'utilisation de ce site web et/ou aux services doit être adressée à son Éditeur dont les références sont mentionnées à l'Article 1."
      ]
    }
  ];
}
