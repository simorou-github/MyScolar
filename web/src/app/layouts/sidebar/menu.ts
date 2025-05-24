import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
    {
        id: 1,
        label: 'MENU PRINCIPAL',
        isTitle: true,
    },

    {
        id: 2,
        label: 'Tableau de bord',
        icon: 'bx bx-pie-chart',
        link: '/dashboard',
        rolesAllowed: ['school_admin', 'admin', 'super_admin', 'accountant', 'treasurer']

    },

    {
        id: 3,
        label: 'Inscriptions',
        icon: 'bx bx-bookmarks',
        rolesAllowed: ['admin', 'super_admin'],

        subItems: [
            {
                id: 3001,
                label: 'En attente',
                link: '/inscription-en-attente',
                parentId: 3
            },
            {
                id: 3002,
                label: 'Validées',
                link: '/inscription-validee',
                parentId: 3
            }
        ]
    },

    {
        id: 4,
        label: 'Espace Ecole',
        icon: 'bx bxs-school',
        rolesAllowed: ['school_admin', 'accountant', 'treasurer'],

        subItems: [
            {
                id: 4001,
                label: 'Gestion Groupes',
                link: '/espace/gestion-groupe',
                parentId: 4
            },
            {
                id: 4002,
                label: 'Gestion Frais',
                link: '/espace/gestion-frais',
                parentId: 4
            },
            {
                id: 4003,
                label: 'Gestion Classes',
                link: '/espace/gestion-classe',
                parentId: 4
            },
            {
                id: 4004,
                label: 'Gestion Apprenants',
                link: '/espace/gestion-apprenant',
                parentId: 4
            },
            {
                id: 4005,
                label: 'Paiements',
                link: '/espace/historiques-paiements',
                parentId: 4
            },
            {
                id: 4006,
                label: 'Statistiques',
                link: '/espace/statistiques',
                parentId: 4
            },
            {
                id: 4007,
                label: 'Mes Utilisateurs',
                link: '/espace/user-management',
                parentId: 4
            },

            {
                id: 4008,
                label: 'Suivi des Paiements',
                icon: 'bx bx-wallet',
                link: '/scolar/fees-balance-followup',
                parentId: 4
            },
        ]
    },

    {
        id: 5,
        label: 'Statistiques',
        icon: 'bx bx-line-chart',
        link: '/scolar/statistics',
        rolesAllowed: ['admin', 'super_admin'],
    },

    {
        id: 6,
        label: 'Paramètres',
        icon: 'bx bxs-cog',
        rolesAllowed: ['admin', 'super_admin'],
        subItems: [
            {
                id: 6001,
                label: 'Params. Système',
                link: '/scolar/system-parameter',
                parentId: 6
            },

        ]
    },

    {
        id: 7,
        label: 'Administration',
        icon: 'bx bx-cast',
        rolesAllowed: ['super_admin', 'admin'],
        subItems: [
            {
                id: 7001,
                label: 'Classes',
                link: '/classes',
                parentId: 7
            },
            {
                id: 7002,
                label: 'Opérateurs',
                link: '/scolar/operators',
                parentId: 7
            },
            {
                id: 7003,
                label: 'Utilisateurs',
                link: '/scolar/manage-user',
                parentId: 7
            },
            {
                id: 7004,
                label: 'Roles Permissions',
                link: '/scolar/manage-permission',
                parentId: 7
            }
        ]
    },

    {
<<<<<<< HEAD
        id: 19,
        label: 'Suivi des Paiements',
        icon: 'bx bx-wallet',
        link: '/scolar/fees-balance-followup',
        rolesAllowed: ['school_admin', 'admin', 'super_admin', 'accountant', 'treasurer']
=======
        id: 8,
        label: 'Suivi des Paiements',
        icon: 'bx bx-wallet',
        link: '/scolar/fees-balance-followup',
        rolesAllowed: ['admin', 'super_admin']
>>>>>>> 4bc17fd19b064b462d55d6d26d599ee7079a64bb

    },
];

