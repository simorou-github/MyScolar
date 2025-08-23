import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
    {
        id: 1,
        label: 'MENU PRINCIPAL',
        isTitle: true,
        rolesAllowed: ['school-admin', 'admin', 'super-admin', 'accountant', 'treasurer'] 
    },

    {
        id: 2,
        label: 'Tableau de bord',
        icon: 'bx bx-pie-chart',
        link: '/dashboard',
        isOpen: false,
        isActive: false,
        rolesAllowed: ['school-admin', 'admin', 'super-admin', 'accountant', 'treasurer']
    },

    {
        id: 3,
        label: 'Inscriptions',
        icon: 'bx bx-bookmarks',
        isOpen: false,
        isActive: false,
        rolesAllowed: ['admin', 'super-admin'],
        subItems: [
            {
                id: 3001,
                label: 'En attente',
                link: '/inscription-en-attente',
                parentId: 3,
                rolesAllowed: ['admin', 'super-admin']
            },
            {
                id: 3002,
                label: 'Validées',
                link: '/inscription-validee',
                parentId: 3,
                rolesAllowed: ['admin', 'super-admin']
            }
        ]
    },

    {
        id: 4,
        label: 'Espace Ecole',
        icon: 'bx bxs-school',
        isOpen: false,
        isActive: false,
        rolesAllowed: ['school-admin', 'accountant', 'treasurer'],
        subItems: [
            { id: 4001, label: 'Gestion Groupes', link: '/espace/gestion-groupe', parentId: 4, rolesAllowed: ['school-admin'] },
            { id: 4002, label: 'Gestion Frais', link: '/espace/gestion-frais', parentId: 4, rolesAllowed: ['school-admin', 'accountant'] },
            { id: 4003, label: 'Gestion Classes', link: '/espace/gestion-classe', parentId: 4, rolesAllowed: ['school-admin'] },
            { id: 4004, label: 'Gestion Apprenants', link: '/espace/gestion-apprenant', parentId: 4, rolesAllowed: ['school-admin', 'accountant'] },
            { id: 4005, label: 'Paiements', link: '/espace/historiques-paiements', parentId: 4, rolesAllowed: ['school-admin', 'accountant', 'treasurer'] },
            { id: 4006, label: 'Statistiques', link: '/espace/statistiques', parentId: 4, rolesAllowed: ['school-admin', 'accountant', 'treasurer'] },
            { id: 4008, label: 'Suivi des Paiements', icon: 'bx bx-wallet', link: '/scolar/fees-balance-followup', parentId: 4, rolesAllowed: ['school-admin', 'accountant', 'treasurer'] },
        ]
    },

    {
        id: 5,
        label: 'Statistiques',
        icon: 'bx bx-line-chart',
        isOpen: false,
        isActive: false,
        link: '/scolar/statistics',
        rolesAllowed: ['admin', 'super-admin'],
    },

    {
        id: 6,
        label: 'Paramètres',
        icon: 'bx bxs-cog',
        isOpen: false,
        isActive: false,
        rolesAllowed: ['admin', 'super-admin'],
        subItems: [
            { id: 6001, label: 'Params. Système', link: '/scolar/system-parameter', parentId: 6, rolesAllowed: ['super-admin'] },
        ]
    },

    {
        id: 7,
        label: 'Administration',
        icon: 'bx bx-cast',
        isOpen: false,
        isActive: false,
        rolesAllowed: ['super-admin', 'admin'],
        subItems: [
            { id: 7001, label: 'Classes', link: '/classes', parentId: 7, rolesAllowed: ['super-admin', 'admin'] },
            { id: 7002, label: 'Opérateurs', link: '/scolar/operators', parentId: 7, rolesAllowed: ['super-admin', 'admin'] },
            { id: 7003, label: 'Utilisateurs', link: '/scolar/manage-user', parentId: 7, rolesAllowed: ['super-admin', 'admin'] },
            { id: 7004, label: 'Roles & Permissions', link: '/scolar/manage-permission', parentId: 7, rolesAllowed: ['super-admin'] }
        ]
    },

    {
        id: 8,
        label: 'Suivi Paiements',
        icon: 'bx bx-wallet',
        isOpen: false,
        isActive: false,
        rolesAllowed: ['admin', 'super-admin', 'treasurer'],
        subItems: [
            { id: 8001, label: 'Soldes et Transactions', icon: 'bx bx-wallet', link: '/scolar/fees-balance-followup', parentId: 8, rolesAllowed: ['admin', 'super-admin', 'treasurer'] },
            { id: 8002, label: 'Paiement Caisse', icon: 'bx bx-currency-notes', link: '/scolar/fees-cash-payment', parentId: 8, rolesAllowed: ['admin', 'super-admin', 'treasurer'] }
        ]
    },
];
