export interface TourLink {
  yaw: number;
  pitch: number;
  vers: string;
  label: string;
}

export interface TourScene {
  id: string;
  nom: string;
  image: string;
  mini: string;
  texte: string;
  etiquettes: string[];
  yaw0: number;
  pitch0: number;
  liens: TourLink[];
}

export const TOUR: TourScene[] = [
  {
    id: "allee-centrale",
    nom: "Allée Centrale",
    image: "/360/allee-centrale.jpg",
    mini: "/360/allee-centrale-mini.jpg",
    texte:
      "Allée dallée bordée de palmiers et de plantations, menant directement de l'accueil de l'hôtel vers la plage privée et l'océan Atlantique.",
    etiquettes: ["Palmiers", "Promenade", "Accès plage"],
    yaw0: 0,
    pitch0: 0,
    liens: [
      { yaw: 0, pitch: -3, vers: "plage", label: "Vers la plage privée" },
      { yaw: 65, pitch: -5, vers: "jeux-enfants", label: "Vers l'espace jeux" },
      { yaw: -60, pitch: -5, vers: "jardin-restaurant", label: "Vers le restaurant" },
    ],
  },
  {
    id: "plage",
    nom: "Plage Privée",
    image: "/360/plage.jpg",
    mini: "/360/plage-mini.jpg",
    texte:
      "Le sable doré, les parasols traditionnels en chaume et l'océan Atlantique à perte de vue. Profitez de la brise marine et du calme.",
    etiquettes: ["Plage privée", "Océan Atlantique", "Transats"],
    yaw0: 0,
    pitch0: 0,
    liens: [
      { yaw: 180, pitch: -3, vers: "allee-centrale", label: "Vers l'allée centrale" },
      { yaw: -80, pitch: -6, vers: "piscine-ocean", label: "Vers la piscine" },
      { yaw: 90, pitch: -4, vers: "jeux-enfants", label: "Vers les jeux enfants" },
    ],
  },
  {
    id: "piscine",
    nom: "Piscine Principale",
    image: "/360/piscine.jpg",
    mini: "/360/piscine-mini.jpg",
    texte:
      "Grand bassin d'eau douce au bord de la plage, aménagé de transats ergonomiques, de bancs et de parasols face au bleu de l'océan.",
    etiquettes: ["Piscine", "Transats", "Baignade"],
    yaw0: 0,
    pitch0: -6,
    liens: [
      { yaw: -75, pitch: -4, vers: "paillote", label: "Vers la Paillote Atlantique" },
      { yaw: 65, pitch: -6, vers: "solarium", label: "Vers le solarium" },
      { yaw: 10, pitch: -6, vers: "piscine-ocean", label: "Vers le front de mer" },
    ],
  },
  {
    id: "paillote",
    nom: "Paillote Atlantique",
    image: "/360/paillote.jpg",
    mini: "/360/paillote-mini.jpg",
    texte:
      "Notre restaurant en plein air sous un grand toit de chaume au bord de la piscine. Savourez nos grillades et spécialités face à la mer.",
    etiquettes: ["Restaurant plein air", "Gastronomie", "Vue mer"],
    yaw0: 10,
    pitch0: -5,
    liens: [
      { yaw: 70, pitch: -7, vers: "piscine", label: "Vers la piscine" },
      { yaw: -110, pitch: -5, vers: "jardin-restaurant", label: "Vers les allées du jardin" },
      { yaw: 15, pitch: -4, vers: "plage", label: "Vers la plage" },
    ],
  },
  {
    id: "piscine-ocean",
    nom: "Piscine — Vue Océan",
    image: "/360/piscine-ocean.jpg",
    mini: "/360/piscine-ocean-mini.jpg",
    texte:
      "Bord de bassin orienté plein sud face aux vagues de l'Atlantique, avec bancs en bois massif et parasols pour des après-midis farniente.",
    etiquettes: ["Piscine", "Vue océan", "Détente"],
    yaw0: 0,
    pitch0: -6,
    liens: [
      { yaw: 175, pitch: -8, vers: "piscine", label: "Vers les transats" },
      { yaw: 40, pitch: -4, vers: "plage", label: "Vers la plage privée" },
      { yaw: -95, pitch: -5, vers: "paillote", label: "Vers la Paillote" },
    ],
  },
  {
    id: "solarium",
    nom: "Solarium & Pergola",
    image: "/360/solarium.jpg",
    mini: "/360/solarium-mini.jpg",
    texte:
      "Espace solarium sur gazon doux, équipé de chaises longues design et d'une pergola ombragée pour se ressourcer en toute tranquillité.",
    etiquettes: ["Solarium", "Transats", "Pergola"],
    yaw0: 0,
    pitch0: -7,
    liens: [
      { yaw: -70, pitch: -6, vers: "piscine", label: "Vers la piscine" },
      { yaw: -15, pitch: -4, vers: "plage", label: "Vers la plage" },
    ],
  },
  {
    id: "jardin-restaurant",
    nom: "Jardin & Allée du Restaurant",
    image: "/360/jardin-restaurant.jpg",
    mini: "/360/jardin-restaurant-mini.jpg",
    texte:
      "Cheminement pavé au milieu des pelouses et des palmiers, reliant le bâtiment principal au restaurant de plage.",
    etiquettes: ["Jardin", "Toit de chaume", "Promenade"],
    yaw0: 0,
    pitch0: 0,
    liens: [
      { yaw: 45, pitch: -3, vers: "paillote", label: "Vers la Paillote" },
      { yaw: -130, pitch: -4, vers: "allee-centrale", label: "Vers l'allée centrale" },
    ],
  },
  {
    id: "jeux-enfants",
    nom: "Jardin & Jeux Enfants",
    image: "/360/jeux-enfants.jpg",
    mini: "/360/jeux-enfants-mini.jpg",
    texte:
      "Vaste zone ombragée sous les grands cocotiers, avec signalétique vers l'aire de jeux réservée aux enfants en bord de mer.",
    etiquettes: ["Jeux enfants", "Jardin tropical", "Ombrage"],
    yaw0: 0,
    pitch0: 0,
    liens: [
      { yaw: -70, pitch: -5, vers: "allee-centrale", label: "Vers l'allée centrale" },
      { yaw: 15, pitch: -3, vers: "plage", label: "Vers la plage" },
    ],
  },
];
