export const API_ENDPOINTS = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    profile: "/auth/profile"
  },
  listings: {
    list: "/listings",
    details: (id: string | number) => `/listings/${id}`,
    search: "/listings",
    create: "/listings",
    update: (id: string | number) => `/listings/${id}`,
    remove: (id: string | number) => `/listings/${id}`,
    my: "/listings/my",
    uploadImage: (id: string | number) => `/listings/${id}/images`
  },
  images: {
    remove: (id: string | number) => `/images/${id}`
  },
  favorites: {
    list: "/favorites",
    add: (listingId: string | number) => `/favorites/${listingId}`,
    remove: (listingId: string | number) => `/favorites/${listingId}`
  },
  messages: {
    send: "/messages",
    myListings: "/messages/my-listings",
    markRead: (id: string | number) => `/messages/${id}/read`
  },
  admin: {
    dashboard: "/admin/dashboard",
    users: "/admin/users",
    listings: "/admin/listings",
    messages: "/admin/messages"
  }
} as const;