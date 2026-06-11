export type Room = {
  id: string;
  name: string;
  view: string;
  price: number;
  bed: string;
  images: string[];
  amenities: string[];
  description: string;
};

export const rooms: Room[] = [
  {
    id: "double-standard",
    name: "Chambre Double Standard",
    view: "Vue jardin tropical",
    price: 54,
    bed: "1 lit double",
    images: [
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1400&q=80",
    ],
    amenities: ["WiFi gratuit", "TV LCD", "Douche effet pluie", "Bureau", "Rideaux occultants", "Climatisation"],
    description:
      "Une chambre élégante donnant sur notre jardin tropical, parfaite pour un séjour reposant à deux pas de la plage.",
  },
  {
    id: "double-vue-mer",
    name: "Chambre Double Vue Mer",
    view: "Vue océan Atlantique",
    price: 70,
    bed: "1 lit double ou twin",
    images: [
      "https://images.unsplash.com/photo-1615460549969-36fa19521a4f?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1400&q=80",
    ],
    amenities: ["Vue mer", "WiFi gratuit", "TV LCD", "Douche effet pluie", "Rideaux occultants", "Climatisation"],
    description:
      "Réveillez-vous au rythme des vagues. Cette chambre face à l'Atlantique offre des couchers de soleil inoubliables.",
  },
  {
    id: "suite-kitchenette",
    name: "Suite avec Kitchenette",
    view: "Vue mer ou jardin",
    price: 90,
    bed: "1 lit double + canapé",
    images: [
      "https://images.unsplash.com/photo-1631049552057-403cdb8f0658?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1400&q=80",
    ],
    amenities: ["Kitchenette équipée", "Coin repas extérieur", "Vue mer", "WiFi gratuit", "TV LCD", "Frigo", "Espace détente"],
    description:
      "Idéale pour les longs séjours en famille — un véritable appartement avec terrasse privée sous les cocotiers.",
  },
];

export const amenities = [
  { icon: "Waves", label: "Piscine extérieure", note: "08h – 18h" },
  { icon: "Umbrella", label: "Plage privée", note: "Accès direct Atlantique" },
  { icon: "UtensilsCrossed", label: "2 Restaurants", note: "Local & international" },
  { icon: "Wine", label: "Bar & Salon", note: "Cocktails tropicaux" },
  { icon: "Plane", label: "Navette aéroport", note: "20€ / véhicule" },
  { icon: "Car", label: "Parking gratuit", note: "Sécurisé 24/7" },
  { icon: "Wifi", label: "WiFi gratuit", note: "Haut débit partout" },
  { icon: "TreePalm", label: "Jardin tropical", note: "Cocotiers & fleurs" },
  { icon: "Baby", label: "Club enfants", note: "Animations" },
  { icon: "Droplets", label: "Parc aquatique", note: "Toboggans" },
  { icon: "Building2", label: "2 Salles de réunion", note: "Jusqu'à 250m²" },
  { icon: "Shirt", label: "Blanchisserie", note: "Service rapide" },
  { icon: "BellRing", label: "Réception 24/7", note: "À votre écoute" },
  { icon: "Coffee", label: "Petit-déjeuner", note: "7€/pers • 7h30-11h" },
];

export const reviews = [
  {
    name: "Aïcha K.",
    text: "Très bel emplacement avec la possibilité de se baigner dans l'océan. Vue mer magnifique depuis la chambre.",
    rating: 5,
    origin: "Booking",
  },
  {
    name: "Jean-Marc L.",
    text: "Personnel aimable et disponible, atmosphère tropicale garantie. Un vrai dépaysement à Lomé.",
    rating: 5,
    origin: "Tripadvisor",
  },
  {
    name: "Mariam O.",
    text: "Piscine propre avec vue sur la plage, chambre impeccable, personnel professionnel. Je reviendrai !",
    rating: 5,
    origin: "Google",
  },
  {
    name: "Pierre D.",
    text: "La cuisine, l'environnement, le service — j'ai prolongé mon séjour de trois nuits !",
    rating: 5,
    origin: "Booking",
  },
];

export const galleryImages = [
  { src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80", cat: "Plage", alt: "Plage tropicale Atlantique" },
  { src: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80", cat: "Piscine", alt: "Piscine vue mer" },
  { src: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80", cat: "Chambres", alt: "Chambre vue mer" },
  { src: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80", cat: "Restaurants", alt: "Restaurant paillote" },
  { src: "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80", cat: "Plage", alt: "Coucher de soleil océan" },
  { src: "https://images.unsplash.com/photo-1540202404-1b927e27fa8b?auto=format&fit=crop&w=1200&q=80", cat: "Piscine", alt: "Piscine tropicale" },
  { src: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80", cat: "Chambres", alt: "Suite tropicale" },
  { src: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=80", cat: "Restaurants", alt: "Cuisine locale" },
  { src: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80", cat: "Plage", alt: "Sable doré Atlantique" },
  { src: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?auto=format&fit=crop&w=1200&q=80", cat: "Plage", alt: "Vague océan" },
  { src: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80", cat: "Événements", alt: "Salle d'événement" },
  { src: "https://images.unsplash.com/photo-1551918120-9739cb430c6d?auto=format&fit=crop&w=1200&q=80", cat: "Événements", alt: "Espace réunion" },
];

export const heroSlides = [
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2400&q=85",
  "https://images.unsplash.com/photo-1540202404-1b927e27fa8b?auto=format&fit=crop&w=2400&q=85",
  "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=2400&q=85",
  "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=2400&q=85",
];
