export type Dentist = {
  id: number;
  name: string;
  officeName: string;
  specialty: string;
  rating: number;
  reviews: number;
  distance: string;
  address: string;
  insurance: string[];
  networkProvider: boolean;
  latitude: number;
  longitude: number;
};

export const dentists: Dentist[] = [
  {
    id: 1,
    name: "Dr. Emily Carter, DDS",
    officeName: "Bright Smile Dental",
    specialty: "General Dentist",
    rating: 4.8,
    reviews: 120,
    distance: "0.5 miles away",
    address: "123 Newark Ave, Jersey City, NJ 07302",
    insurance: ["Aetna", "Cigna", "MetLife", "Delta Dental", "United Concordia"],
    networkProvider: true,
    latitude: 40.7282,
    longitude: -74.0431,
  },
  {
    id: 2,
    name: "Dr. Michael Rodriguez, DDS",
    officeName: "Hudson Family Dental",
    specialty: "Orthodontist",
    rating: 4.6,
    reviews: 89,
    distance: "1.2 miles away",
    address: "456 Summit Ave, Jersey City, NJ 07306",
    insurance: ["Aetna", "Delta Dental", "Cigna", "MetLife", "United Concordia"],
    networkProvider: false,
    latitude: 40.738,
    longitude: -74.065,
  },
  {
    id: 3,
    name: "Dr. Sarah Kim, DDS",
    officeName: "Grand Street Dental Care",
    specialty: "Cosmetic Dentist",
    rating: 4.9,
    reviews: 156,
    distance: "0.8 miles away",
    address: "789 Grand St, Jersey City, NJ 07302",
    insurance: ["Aetna", "MetLife", "Cigna", "Delta Dental", "United Concordia"],
    networkProvider: true,
    latitude: 40.7178,
    longitude: -74.049,
  },
  {
    id: 4,
    name: "Dr. James Wilson, DDS",
    officeName: "Central Pediatric Dentistry",
    specialty: "Pediatric Dentist",
    rating: 4.7,
    reviews: 98,
    distance: "1.5 miles away",
    address: "321 Central Ave, Jersey City, NJ 07307",
    insurance: ["Delta Dental", "United Concordia", "Cigna", "Aetna", "MetLife"],
    networkProvider: false,
    latitude: 40.7485,
    longitude: -74.0545,
  },
  {
    id: 5,
    name: "Dr. Lisa Chen, DMD",
    officeName: "Bergen Periodontal Associates",
    specialty: "Periodontist",
    rating: 4.9,
    reviews: 142,
    distance: "1.8 miles away",
    address: "567 Bergen Ave, Jersey City, NJ 07304",
    insurance: ["Aetna", "MetLife", "Cigna", "Delta Dental", "United Concordia"],
    networkProvider: true,
    latitude: 40.7089,
    longitude: -74.062,
  },
  {
    id: 6,
    name: "Dr. Robert Martinez, DDS",
    officeName: "Kennedy Oral Surgery Center",
    specialty: "Oral Surgeon",
    rating: 4.8,
    reviews: 134,
    distance: "2.1 miles away",
    address: "890 Kennedy Blvd, Jersey City, NJ 07305",
    insurance: ["Delta Dental", "United Concordia", "Aetna", "Cigna", "MetLife"],
    networkProvider: false,
    latitude: 40.702,
    longitude: -74.075,
  },
];

export const insuranceCarriers = [
  "Aetna",
  "Blue Cross Blue Shield",
  "Cigna",
  "Delta Dental",
  "Humana",
  "MetLife",
  "United Concordia",
];

export const specialties = [
  "General Practitioner",
  "Pediatric Dentist",
  "Endodontist",
  "Oral Surgeon",
  "Orthodontist",
  "Periodontist",
  "Cosmetic Dentist",
];
