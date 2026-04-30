/**
 * Sample inventory used until Phase 1 wires the Supabase `vehicles` table.
 *
 * Every row carries `IS_SAMPLE: true` so we can grep the codebase for the
 * literal and remove all sample-data references in one pass when real data
 * comes online. Real vehicles will live in Postgres and stream via the
 * Supabase server client.
 */

export const IS_SAMPLE = true as const;

export type BodyType = "sedan" | "suv" | "hatchback" | "coupe" | "truck" | "van" | "wagon";

export type FuelType = "gas" | "hybrid" | "electric" | "diesel";
export type Drivetrain = "fwd" | "rwd" | "awd" | "4wd";
export type Transmission = "automatic" | "manual" | "cvt" | "dct";

export type SampleVehicle = {
  id: string;
  slug: string;
  vin: string;
  year: number;
  make: string;
  model: string;
  trim: string;
  bodyType: BodyType;
  fuel: FuelType;
  drivetrain: Drivetrain;
  transmission: Transmission;
  mileageKm: number;
  exteriorColor: string;
  interiorColor: string;
  /** price stored in cents (CAD) */
  priceCents: number;
  /** previous price stored in cents (CAD) — set if currently discounted */
  wasPriceCents?: number;
  daysOnLot: number;
  location: "Mississauga" | "Oakville";
  badges: Array<"best-priced" | "low-km" | "carfax-clean" | "fresh-arrival" | "price-drop">;
  features: string[];
  description: string;
  /** Picsum seed string. Renders a deterministic photo for each vehicle. */
  photoSeed: string;
};

export const SAMPLE_VEHICLES: SampleVehicle[] = [
  {
    id: "v-001",
    slug: "2021-honda-civic-lx-mississauga",
    vin: "2HGFE2F50MH500111",
    year: 2021,
    make: "Honda",
    model: "Civic",
    trim: "LX",
    bodyType: "sedan",
    fuel: "gas",
    drivetrain: "fwd",
    transmission: "cvt",
    mileageKm: 48_320,
    exteriorColor: "Aegean Blue Metallic",
    interiorColor: "Black",
    priceCents: 1_999_500,
    wasPriceCents: 2_149_500,
    daysOnLot: 12,
    location: "Mississauga",
    badges: ["best-priced", "carfax-clean", "price-drop"],
    features: [
      "Apple CarPlay & Android Auto",
      "Honda Sensing safety suite",
      "Heated front seats",
      "Backup camera",
      "Lane keep assist",
    ],
    description:
      "One-owner Civic LX with full Carfax history, no accidents. Honda Sensing standard. Recently dropped to AutoTrader Best Priced threshold.",
    photoSeed: "civic-lx-blue",
  },
  {
    id: "v-002",
    slug: "2020-toyota-rav4-le-awd-oakville",
    vin: "2T3F1RFV5LC100222",
    year: 2020,
    make: "Toyota",
    model: "RAV4",
    trim: "LE AWD",
    bodyType: "suv",
    fuel: "gas",
    drivetrain: "awd",
    transmission: "automatic",
    mileageKm: 62_180,
    exteriorColor: "Magnetic Grey",
    interiorColor: "Black",
    priceCents: 2_849_900,
    daysOnLot: 7,
    location: "Oakville",
    badges: ["fresh-arrival", "carfax-clean"],
    features: [
      "All-Wheel Drive",
      "Toyota Safety Sense 2.0",
      "Adaptive cruise control",
      "Heated seats",
      "Remote start",
    ],
    description:
      "Fresh trade. AWD RAV4 LE with Toyota Safety Sense and a clean Carfax. Recently serviced — fluids, brakes, alignment.",
    photoSeed: "rav4-grey",
  },
  {
    id: "v-003",
    slug: "2022-hyundai-elantra-preferred-mississauga",
    vin: "KMHLM4AG3NU300333",
    year: 2022,
    make: "Hyundai",
    model: "Elantra",
    trim: "Preferred",
    bodyType: "sedan",
    fuel: "gas",
    drivetrain: "fwd",
    transmission: "cvt",
    mileageKm: 31_640,
    exteriorColor: "Phantom Black",
    interiorColor: "Black",
    priceCents: 2_189_900,
    daysOnLot: 18,
    location: "Mississauga",
    badges: ["low-km"],
    features: [
      "Wireless Apple CarPlay",
      "Lane following assist",
      "Blind spot collision warning",
      "10.25-inch infotainment",
      "Heated steering wheel",
    ],
    description: "Low-km Elantra Preferred with wireless CarPlay and Hyundai SmartSense.",
    photoSeed: "elantra-black",
  },
  {
    id: "v-004",
    slug: "2019-honda-cr-v-ex-l-awd-oakville",
    vin: "2HKRW2H85KH400444",
    year: 2019,
    make: "Honda",
    model: "CR-V",
    trim: "EX-L AWD",
    bodyType: "suv",
    fuel: "gas",
    drivetrain: "awd",
    transmission: "cvt",
    mileageKm: 78_510,
    exteriorColor: "Modern Steel Metallic",
    interiorColor: "Black Leather",
    priceCents: 2_649_500,
    daysOnLot: 22,
    location: "Oakville",
    badges: ["carfax-clean"],
    features: [
      "Leather seats",
      "Sunroof",
      "Power tailgate",
      "Honda Sensing",
      "Apple CarPlay & Android Auto",
    ],
    description: "Loaded CR-V EX-L with leather, sunroof, and full Honda Sensing.",
    photoSeed: "crv-steel",
  },
  {
    id: "v-005",
    slug: "2020-mazda-cx-5-gs-awd-mississauga",
    vin: "JM3KFBCM3L0500555",
    year: 2020,
    make: "Mazda",
    model: "CX-5",
    trim: "GS AWD",
    bodyType: "suv",
    fuel: "gas",
    drivetrain: "awd",
    transmission: "automatic",
    mileageKm: 55_290,
    exteriorColor: "Soul Red Crystal",
    interiorColor: "Black",
    priceCents: 2_599_500,
    daysOnLot: 9,
    location: "Mississauga",
    badges: ["fresh-arrival", "best-priced"],
    features: [
      "i-Activsense safety",
      "All-Wheel Drive",
      "Heated leatherette seats",
      "Power liftgate",
      "Bose premium audio",
    ],
    description: "Soul Red CX-5 GS in showroom condition. Mazda i-Activsense standard.",
    photoSeed: "cx5-red",
  },
  {
    id: "v-006",
    slug: "2021-toyota-corolla-le-oakville",
    vin: "2T1BURHEXMC600666",
    year: 2021,
    make: "Toyota",
    model: "Corolla",
    trim: "LE",
    bodyType: "sedan",
    fuel: "gas",
    drivetrain: "fwd",
    transmission: "cvt",
    mileageKm: 41_870,
    exteriorColor: "Classic Silver Metallic",
    interiorColor: "Black",
    priceCents: 1_949_900,
    wasPriceCents: 2_049_900,
    daysOnLot: 16,
    location: "Oakville",
    badges: ["price-drop", "carfax-clean", "best-priced"],
    features: [
      "Toyota Safety Sense 2.0",
      "Adaptive cruise",
      "Lane departure alert",
      "Apple CarPlay & Android Auto",
      "Backup camera",
    ],
    description: "Bulletproof Corolla LE — perfect first car or commuter. Below market price.",
    photoSeed: "corolla-silver",
  },
  {
    id: "v-007",
    slug: "2018-lexus-rx-350-awd-mississauga",
    vin: "2T2BZMCA5JC700777",
    year: 2018,
    make: "Lexus",
    model: "RX 350",
    trim: "AWD Premium",
    bodyType: "suv",
    fuel: "gas",
    drivetrain: "awd",
    transmission: "automatic",
    mileageKm: 89_450,
    exteriorColor: "Atomic Silver",
    interiorColor: "Stratus Grey Leather",
    priceCents: 3_599_500,
    daysOnLot: 31,
    location: "Mississauga",
    badges: ["carfax-clean"],
    features: [
      "Heated & ventilated seats",
      "Panoramic sunroof",
      "Mark Levinson audio",
      "Power liftgate",
      "Lexus Safety System+",
    ],
    description: "Beautifully maintained RX 350 with full service history.",
    photoSeed: "rx350-silver",
  },
  {
    id: "v-008",
    slug: "2022-kia-forte-ex-mississauga",
    vin: "3KPF34AD9NE800888",
    year: 2022,
    make: "Kia",
    model: "Forte",
    trim: "EX",
    bodyType: "sedan",
    fuel: "gas",
    drivetrain: "fwd",
    transmission: "cvt",
    mileageKm: 28_150,
    exteriorColor: "Snow White Pearl",
    interiorColor: "Black",
    priceCents: 2_279_900,
    daysOnLot: 5,
    location: "Mississauga",
    badges: ["low-km", "fresh-arrival"],
    features: [
      "Wireless phone charging",
      "Sunroof",
      "Heated steering wheel",
      "Blind-spot monitoring",
      "8-inch touchscreen",
    ],
    description: "Low-km Forte EX with sunroof, heated steering, and a generous tech package.",
    photoSeed: "forte-white",
  },
  {
    id: "v-009",
    slug: "2019-bmw-330i-xdrive-oakville",
    vin: "WBA5R7C58KFH900999",
    year: 2019,
    make: "BMW",
    model: "330i",
    trim: "xDrive",
    bodyType: "sedan",
    fuel: "gas",
    drivetrain: "awd",
    transmission: "automatic",
    mileageKm: 67_330,
    exteriorColor: "Mineral White Metallic",
    interiorColor: "Cognac Vernasca Leather",
    priceCents: 3_399_500,
    daysOnLot: 14,
    location: "Oakville",
    badges: ["carfax-clean"],
    features: [
      "M Sport package",
      "Premium package",
      "Heads-up display",
      "Wireless Apple CarPlay",
      "Heated steering & seats",
    ],
    description: "Sport-tuned 330i xDrive with M Sport, premium package, and a clean Carfax.",
    photoSeed: "330i-white",
  },
  {
    id: "v-010",
    slug: "2021-ford-escape-titanium-mississauga",
    vin: "1FMCU9J9XMU101010",
    year: 2021,
    make: "Ford",
    model: "Escape",
    trim: "Titanium AWD",
    bodyType: "suv",
    fuel: "hybrid",
    drivetrain: "awd",
    transmission: "automatic",
    mileageKm: 51_960,
    exteriorColor: "Star White Metallic Tri-Coat",
    interiorColor: "Sandstone Leather",
    priceCents: 2_749_500,
    daysOnLot: 11,
    location: "Mississauga",
    badges: ["carfax-clean"],
    features: [
      "Hybrid powertrain",
      "B&O premium audio",
      "Hands-free liftgate",
      "Co-Pilot360 Assist+",
      "Panoramic vista roof",
    ],
    description: "Titanium hybrid trim — leather, B&O sound, panoramic roof. ~5.5L/100km combined.",
    photoSeed: "escape-white",
  },
  {
    id: "v-011",
    slug: "2020-volkswagen-tiguan-comfortline-oakville",
    vin: "3VV2B7AX6LM111111",
    year: 2020,
    make: "Volkswagen",
    model: "Tiguan",
    trim: "Comfortline 4MOTION",
    bodyType: "suv",
    fuel: "gas",
    drivetrain: "awd",
    transmission: "automatic",
    mileageKm: 71_240,
    exteriorColor: "Pure White",
    interiorColor: "Black Leatherette",
    priceCents: 2_499_500,
    daysOnLot: 25,
    location: "Oakville",
    badges: ["carfax-clean"],
    features: [
      "4MOTION all-wheel drive",
      "Third-row seating",
      "Panoramic sunroof",
      "Adaptive cruise control",
      "App-Connect (CarPlay/AA)",
    ],
    description: "Family-ready 7-seat Tiguan with 4MOTION and a panoramic roof.",
    photoSeed: "tiguan-white",
  },
  {
    id: "v-012",
    slug: "2023-nissan-sentra-sr-mississauga",
    vin: "3N1AB8DV9PY121212",
    year: 2023,
    make: "Nissan",
    model: "Sentra",
    trim: "SR",
    bodyType: "sedan",
    fuel: "gas",
    drivetrain: "fwd",
    transmission: "cvt",
    mileageKm: 18_540,
    exteriorColor: "Scarlet Ember Tintcoat",
    interiorColor: "Charcoal w/Orange",
    priceCents: 2_349_900,
    daysOnLot: 4,
    location: "Mississauga",
    badges: ["fresh-arrival", "low-km"],
    features: [
      "Sport-tuned suspension",
      "18-inch alloys",
      "Heated front seats",
      "Bose premium audio",
      "Intelligent cruise control",
    ],
    description: "Like-new Sentra SR with under 20,000 km. Bose audio, sport suspension, alloys.",
    photoSeed: "sentra-red",
  },
];

export type SampleVehicleSummary = Pick<
  SampleVehicle,
  | "id"
  | "slug"
  | "year"
  | "make"
  | "model"
  | "trim"
  | "priceCents"
  | "wasPriceCents"
  | "mileageKm"
  | "bodyType"
  | "drivetrain"
  | "transmission"
  | "fuel"
  | "exteriorColor"
  | "location"
  | "badges"
  | "photoSeed"
>;

export function getFeaturedSampleVehicles(limit = 8): SampleVehicleSummary[] {
  return SAMPLE_VEHICLES.slice(0, limit);
}

export function getSampleVehicleBySlug(slug: string): SampleVehicle | undefined {
  return SAMPLE_VEHICLES.find((v) => v.slug === slug);
}

export function getSimilarSampleVehicles(
  vehicle: SampleVehicle,
  limit = 4,
): SampleVehicleSummary[] {
  return SAMPLE_VEHICLES.filter(
    (v) => v.id !== vehicle.id && (v.bodyType === vehicle.bodyType || v.make === vehicle.make),
  ).slice(0, limit);
}
