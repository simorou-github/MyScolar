import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
    {
        id: 1,
        label: 'MENU PRINCIPAL',
        isTitle: true,
    },
    
    {
        id: 3,
        label: 'Tableau de bord',
        icon: 'bx bx-pie-chart',
        link: '/dashboard',
        rolesAllowed: ['school_admin', 'admin', 'super_admin', 'accountant', 'treasurer']

    },
    
    {
        id: 4,
        label: 'Inscriptions',
        icon: 'bx bx-bookmarks',
        rolesAllowed: ['admin', 'super_admin'],

        subItems: [
            {
                id: 5,
                label: 'En attente',
                link: '/inscription-en-attente',
                parentId: 4
            },
            {
                id: 6,
                label: 'Validées',
                link: '/inscription-validee',
                parentId: 4
            }
        ]
    },

    {
        id: 7,
        label: 'Espace Ecole',
        icon: 'bx bxs-school',
        rolesAllowed: ['school_admin', 'accountant', 'treasurer'],

        subItems: [
            {
                id: 8,
                label: 'Gestion Groupes',
                link: '/espace/gestion-groupe',
                parentId: 7
            },
            {
                id: 9,
                label: 'Gestion Frais',
                link: '/espace/gestion-frais',
                parentId: 7
            },
            {
                id: 10,
                label: 'Gestion Classes',
                link: '/espace/gestion-classe',
                parentId: 7
            },
            {
                id: 11,
                label: 'Gestion Apprenants',
                link: '/espace/gestion-apprenant',
                parentId: 7
            },
            {
                id: 12,
                label: 'Paiements',
                link: '/espace/historiques-paiements',
                parentId: 7
            },
            {
                id: 14,
                label: 'Statistiques',
                link: '/espace/statistiques',
                parentId: 7
            },
            {
                id: 15,
                label: 'Mes Utilisateurs',
                link: '/espace/user-management',
                parentId: 7
            }
        ]
    },

    {
        id: 15,
        label: 'Statistiques',
        icon: 'bx bx-line-chart',
        link: '/scolar/statistics',
        rolesAllowed: ['admin', 'super_admin'],
    },

    {
        id: 16,
        label: 'Paramètres',
        icon: 'bx bxs-cog',
        rolesAllowed:  ['admin', 'super_admin'],
        subItems: [
            {
                id: 17,
                label: 'Params. Système',
                link: '/scolar/system-parameter',
                parentId: 16
            },

        ]
    },

    {
        id: 18,
        label: 'Administration',
        icon: 'bx bx-cast',
        rolesAllowed: ['super_admin', 'admin'],
        subItems: [
            {
                id: 19,
                label: 'Classes',
                link: '/classes',
                parentId: 18
            },
            {
                id: 20,
                label: 'Opérateurs',
                link: '/scolar/operators',
                parentId: 18
            },
            {
                id: 21,
                label: 'Utilisateurs',
                link: '/scolar/manage-user',
                parentId: 18
            },
            {
                id: 22,
                label: 'Roles Permissions',
                link: '/scolar/manage-permission',
                parentId: 18
            }
        ]
    },

    {
        id: 19,
        label: 'Suivi des Paiements',
        icon: 'bx bx-wallet',
        link: '/scolar/fees-balance-followup',
        rolesAllowed: ['school_admin', 'admin', 'super_admin', 'accountant', 'treasurer']

    },
];

