export const hostels = [
  {
    id: "1",
    name: "Al-Hikmah Male Hostel A",
    type: "male",
    location: "Main Campus",
    description:
      "Standard male hostel with basic amenities for undergraduate students.",
    price: 80000,
    capacity: 200,
    available: 45,
    features: ["Bunk beds", "Study tables", "Common room", "Security"],
    image: "/placeholder.svg?height=300&width=500",
    rooms: [
      {
        id: "A101",
        type: "2-person",
        floor: "Ground Floor",
        price: 80000,
        available: true,
        amenities: ["Bunk bed", "Study table", "Wardrobe", "Fan"],
        description: "Standard 2-person room with basic amenities",
        dimensions: "4m x 5m (20 sq.m)",
        orientation: "South-facing",
      },
      {
        id: "A102",
        type: "2-person",
        floor: "Ground Floor",
        price: 80000,
        available: true,
        amenities: ["Bunk bed", "Study table", "Wardrobe", "Fan"],
        description: "Standard 2-person room with basic amenities",
        dimensions: "4m x 5m (20 sq.m)",
        orientation: "North-facing",
      },
      {
        id: "A201",
        type: "4-person",
        floor: "First Floor",
        price: 70000,
        available: true,
        amenities: ["Bunk beds", "Study tables", "Wardrobes", "Fan"],
        description: "Spacious 4-person room with shared facilities",
        dimensions: "6m x 6m (36 sq.m)",
        orientation: "East-facing",
      },
      {
        id: "A202",
        type: "4-person",
        floor: "First Floor",
        price: 70000,
        available: false,
        amenities: ["Bunk beds", "Study tables", "Wardrobes", "Fan"],
        description: "Spacious 4-person room with shared facilities",
        dimensions: "6m x 6m (36 sq.m)",
        orientation: "West-facing",
      },
    ],
  },
  {
    id: "2",
    name: "Al-Hikmah Male Hostel B",
    type: "male",
    location: "Main Campus",
    description:
      "Premium male hostel with enhanced facilities for undergraduate students.",
    price: 100000,
    capacity: 150,
    available: 20,
    features: [
      "Bunk beds",
      "Study tables",
      "Common room",
      "WiFi",
      "TV room",
      "Security",
    ],
    image: "/placeholder.svg?height=300&width=500",
    rooms: [
      {
        id: "B101",
        type: "2-person",
        floor: "Ground Floor",
        price: 100000,
        available: true,
        amenities: ["Bunk bed", "Study table", "Wardrobe", "Fan", "WiFi"],
        description: "Premium 2-person room with enhanced amenities",
        dimensions: "4.5m x 5.5m (24.75 sq.m)",
        orientation: "South-facing",
      },
      {
        id: "B102",
        type: "2-person",
        floor: "Ground Floor",
        price: 100000,
        available: false,
        amenities: ["Bunk bed", "Study table", "Wardrobe", "Fan", "WiFi"],
        description: "Premium 2-person room with enhanced amenities",
        dimensions: "4.5m x 5.5m (24.75 sq.m)",
        orientation: "North-facing",
      },
      {
        id: "B201",
        type: "4-person",
        floor: "First Floor",
        price: 90000,
        available: true,
        amenities: ["Bunk beds", "Study tables", "Wardrobes", "Fan", "WiFi"],
        description: "Premium 4-person room with enhanced amenities",
        dimensions: "7m x 6m (42 sq.m)",
        orientation: "East-facing",
      },
    ],
  },
  {
    id: "3",
    name: "Al-Hikmah Female Hostel A",
    type: "female",
    location: "Main Campus",
    description:
      "Standard female hostel with basic amenities for undergraduate students.",
    price: 80000,
    capacity: 200,
    available: 30,
    features: ["Bunk beds", "Study tables", "Common room", "Security"],
    image: "/placeholder.svg?height=300&width=500",
    rooms: [
      {
        id: "FA101",
        type: "2-person",
        floor: "Ground Floor",
        price: 80000,
        available: true,
        amenities: ["Bunk bed", "Study table", "Wardrobe", "Fan"],
        description: "Standard 2-person room with basic amenities",
        dimensions: "4m x 5m (20 sq.m)",
        orientation: "South-facing",
      },
      {
        id: "FA102",
        type: "2-person",
        floor: "Ground Floor",
        price: 80000,
        available: true,
        amenities: ["Bunk bed", "Study table", "Wardrobe", "Fan"],
        description: "Standard 2-person room with basic amenities",
        dimensions: "4m x 5m (20 sq.m)",
        orientation: "North-facing",
      },
      {
        id: "FA201",
        type: "4-person",
        floor: "First Floor",
        price: 70000,
        available: true,
        amenities: ["Bunk beds", "Study tables", "Wardrobes", "Fan"],
        description: "Spacious 4-person room with shared facilities",
        dimensions: "6m x 6m (36 sq.m)",
        orientation: "East-facing",
      },
    ],
  },
  {
    id: "4",
    name: "Al-Hikmah Female Hostel B",
    type: "female",
    location: "Main Campus",
    description:
      "Premium female hostel with enhanced facilities for undergraduate students.",
    price: 100000,
    capacity: 150,
    available: 15,
    features: [
      "Bunk beds",
      "Study tables",
      "Common room",
      "WiFi",
      "TV room",
      "Security",
    ],
    image: "/placeholder.svg?height=300&width=500",
    rooms: [
      {
        id: "FB101",
        type: "2-person",
        floor: "Ground Floor",
        price: 100000,
        available: true,
        amenities: ["Bunk bed", "Study table", "Wardrobe", "Fan", "WiFi"],
        description: "Premium 2-person room with enhanced amenities",
        dimensions: "4.5m x 5.5m (24.75 sq.m)",
        orientation: "South-facing",
      },
      {
        id: "FB102",
        type: "2-person",
        floor: "Ground Floor",
        price: 100000,
        available: false,
        amenities: ["Bunk bed", "Study table", "Wardrobe", "Fan", "WiFi"],
        description: "Premium 2-person room with enhanced amenities",
        dimensions: "4.5m x 5.5m (24.75 sq.m)",
        orientation: "North-facing",
      },
      {
        id: "FB201",
        type: "4-person",
        floor: "First Floor",
        price: 90000,
        available: true,
        amenities: ["Bunk beds", "Study tables", "Wardrobes", "Fan", "WiFi"],
        description: "Premium 4-person room with enhanced amenities",
        dimensions: "7m x 6m (42 sq.m)",
        orientation: "East-facing",
      },
    ],
  },
  {
    id: "5",
    name: "Al-Hikmah Postgraduate Hostel",
    type: "male",
    location: "Postgraduate Campus",
    description:
      "Exclusive hostel for postgraduate students with premium facilities.",
    price: 120000,
    capacity: 100,
    available: 25,
    features: [
      "Single beds",
      "Study tables",
      "Private bathrooms",
      "WiFi",
      "Kitchen",
      "Security",
    ],
    image: "/placeholder.svg?height=300&width=500",
    rooms: [
      {
        id: "PG101",
        type: "1-person",
        floor: "Ground Floor",
        price: 120000,
        available: true,
        amenities: [
          "Single bed",
          "Study table",
          "Wardrobe",
          "Private bathroom",
          "WiFi",
          "AC",
        ],
        description:
          "Exclusive single room with private bathroom for postgraduate students",
        dimensions: "3.5m x 4m (14 sq.m)",
        orientation: "South-facing",
      },
      {
        id: "PG102",
        type: "1-person",
        floor: "Ground Floor",
        price: 120000,
        available: true,
        amenities: [
          "Single bed",
          "Study table",
          "Wardrobe",
          "Private bathroom",
          "WiFi",
          "AC",
        ],
        description:
          "Exclusive single room with private bathroom for postgraduate students",
        dimensions: "3.5m x 4m (14 sq.m)",
        orientation: "North-facing",
      },
      {
        id: "PG201",
        type: "2-person",
        floor: "First Floor",
        price: 100000,
        available: true,
        amenities: [
          "Single beds",
          "Study tables",
          "Wardrobes",
          "Shared bathroom",
          "WiFi",
          "AC",
        ],
        description:
          "Premium 2-person room with enhanced amenities for postgraduate students",
        dimensions: "5m x 5m (25 sq.m)",
        orientation: "East-facing",
      },
    ],
  },
  {
    id: "6",
    name: "Al-Hikmah International Students Hostel",
    type: "female",
    location: "Main Campus",
    description:
      "Dedicated hostel for international students with premium amenities.",
    price: 150000,
    capacity: 50,
    available: 10,
    features: [
      "Single beds",
      "Study tables",
      "Private bathrooms",
      "WiFi",
      "Kitchen",
      "AC",
      "Security",
    ],
    image: "/placeholder.svg?height=300&width=500",
    rooms: [
      {
        id: "INT101",
        type: "1-person",
        floor: "Ground Floor",
        price: 150000,
        available: true,
        amenities: [
          "Single bed",
          "Study table",
          "Wardrobe",
          "Private bathroom",
          "WiFi",
          "AC",
          "TV",
        ],
        description:
          "Luxury single room with private bathroom for international students",
        dimensions: "4m x 4.5m (18 sq.m)",
        orientation: "South-facing",
      },
      {
        id: "INT102",
        type: "1-person",
        floor: "Ground Floor",
        price: 150000,
        available: false,
        amenities: [
          "Single bed",
          "Study table",
          "Wardrobe",
          "Private bathroom",
          "WiFi",
          "AC",
          "TV",
        ],
        description:
          "Luxury single room with private bathroom for international students",
        dimensions: "4m x 4.5m (18 sq.m)",
        orientation: "North-facing",
      },
      {
        id: "INT201",
        type: "2-person",
        floor: "First Floor",
        price: 130000,
        available: true,
        amenities: [
          "Single beds",
          "Study tables",
          "Wardrobes",
          "Shared bathroom",
          "WiFi",
          "AC",
          "TV",
        ],
        description:
          "Luxury 2-person room with enhanced amenities for international students",
        dimensions: "5.5m x 6m (33 sq.m)",
        orientation: "East-facing",
      },
    ],
  },
];
