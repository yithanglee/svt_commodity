export const PHX_ENDPOINT = import.meta.env.VITE_PHX_ENDPOINT
export const PHX_WS_PROTOCOL = import.meta.env.VITE_PHX_WS_PROTOCOL
export const PHX_HTTP_PROTOCOL = import.meta.env.VITE_PHX_HTTP_PROTOCOL
export const PHX_COOKIE = import.meta.env.VITE_PHX_COOKIE

export const MENUS = [
    {
        path: '#', title: 'Admin', icon: null, children: [
            { path: '/admin/staff', title: 'Staff', icon: 'camera-foto-solid' },
            { path: '/admin/role', title: 'Role', icon: 'camera-foto-solid' },

            { path: '/admin/app_route', title: 'Route', icon: 'camera-foto-solid' },
        ]
    },
    { path: '/commodities', title: 'Commodities', icon: 'book-solid' },
    { path: '/transactions', title: 'Transactions', icon: 'book-solid' },
    { path: '/locations', title: 'Locations', icon: 'book-solid' },
    { path: '/sellers', title: 'Sellers', icon: 'book-solid' },
];