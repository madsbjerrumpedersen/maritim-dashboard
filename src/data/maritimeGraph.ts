// Define the graph structure types

  export type NodeId = string;

  

  export interface Neighbor {

    nodeId: NodeId;

    distance: number;

  }

  

  export interface Node {

    id: NodeId;

    lat: number;

    lng: number;

    isCity: boolean;

    neighbors: Neighbor[];

  }

  

  export const MARITIME_NODES: Record<NodeId, Node> = {
  "Aarhus": {

      id: "Aarhus",

      lat: 56.16,

      lng: 10.25,

      isCity: true,

      neighbors: [

        { nodeId: "WP_Aarhus_Kattegat_Anholt_0", distance: 9.56 },

      ]

    },

    "BabElMandeb": {

      id: "BabElMandeb",

      lat: 12.5,

      lng: 43.5,

      isCity: false,

      neighbors: [

        { nodeId: "WP_BabElMandeb_Suez_South_0", distance: 255.57 },

        { nodeId: "WP_BabElMandeb_Dubai_0", distance: 563.93 },

        { nodeId: "WP_BabElMandeb_Mumbai_0", distance: 678.01 },

        { nodeId: "WP_BabElMandeb_SriLanka_South_0", distance: 499.6 },

      ]

    },

    "Bremerhaven": {

      id: "Bremerhaven",

      lat: 53.543,

      lng: 8.5635,

      isCity: true,

      neighbors: [

        { nodeId: "GermanBight", distance: 48.76 },

      ]

    },

    "Busan": {

      id: "Busan",

      lat: 35.05,

      lng: 129.1,

      isCity: true,

      neighbors: [

        { nodeId: "WP_Busan_Shanghai_0", distance: 280.55 },

      ]

    },

    "Cape Town": {

      id: "Cape Town",

      lat: -33.85,

      lng: 18.35,

      isCity: true,

      neighbors: [

        { nodeId: "WP_Cape Town_HornOfBrazil_0", distance: 1629.53 },

        { nodeId: "WP_Cape Town_Gibraltar_West_0", distance: 2039.1 },

        { nodeId: "node_1764702149846", distance: 36 },

      ]

    },

    "CapeHatteras": {

      id: "CapeHatteras",

      lat: 35,

      lng: -75,

      isCity: false,

      neighbors: [

        { nodeId: "New York", distance: 330.98 },

        { nodeId: "WP_CapeHatteras_FloridaStraits_0", distance: 333.91 },

      ]

    },

    "Copenhagen": {

      id: "Copenhagen",

      lat: 55.7,

      lng: 12.64,

      isCity: true,

      neighbors: [

        { nodeId: "Sound_North", distance: 20.88 },

      ]

    },

    "Dubai": {

      id: "Dubai",

      lat: 25.05,

      lng: 54.95,

      isCity: true,

      neighbors: [

        { nodeId: "WP_BabElMandeb_Dubai_1", distance: 121.28 },

        { nodeId: "WP_Dubai_SriLanka_South_0", distance: 423.97 },

      ]

    },

    "EnglishChannel_East": {

      id: "EnglishChannel_East",

      lat: 51.1,

      lng: 1.5,

      isCity: false,

      neighbors: [

        { nodeId: "Rotterdam", distance: 103.74 },

        { nodeId: "WP_EnglishChannel_East_EnglishChannel_West_0", distance: 69.4 },

      ]

    },

    "EnglishChannel_West": {

      id: "EnglishChannel_West",

      lat: 48.6,

      lng: -6.3,

      isCity: false,

      neighbors: [

        { nodeId: "WP_EnglishChannel_East_EnglishChannel_West_1", distance: 148.9 },

        { nodeId: "WP_EnglishChannel_West_Portugal_South_0", distance: 364.21 },

        { nodeId: "WP_EnglishChannel_West_NorthAtlantic_Mid_0", distance: 340.99 },

      ]

    },

    "FloridaStraits": {

      id: "FloridaStraits",

      lat: 24.5,

      lng: -80.5,

      isCity: false,

      neighbors: [

        { nodeId: "WP_CapeHatteras_FloridaStraits_0", distance: 358.61 },

        { nodeId: "WP_FloridaStraits_Panama_Carib_0", distance: 286.56 },

      ]

    },

    "GermanBight": {

      id: "GermanBight",

      lat: 54.0852,

      lng: 7.5394,

      isCity: false,

      neighbors: [

        { nodeId: "WP_GermanBight_Skagen_0", distance: 175.86 },

        { nodeId: "Bremerhaven", distance: 48.76 },

        { nodeId: "WP_GermanBight_Rotterdam_0", distance: 105.16 },

      ]

    },

    "Gibraltar_East": {

      id: "Gibraltar_East",

      lat: 36,

      lng: -5,

      isCity: false,

      neighbors: [

        { nodeId: "Gibraltar_West", distance: 48.97 },

        { nodeId: "WP_Gibraltar_East_Suez_North_0", distance: 161.49 },

      ]

    },

    "Gibraltar_West": {

      id: "Gibraltar_West",

      lat: 35.9,

      lng: -6,

      isCity: false,

      neighbors: [

        { nodeId: "Portugal_South", distance: 172.54 },

        { nodeId: "Gibraltar_East", distance: 48.97 },

        { nodeId: "node_1764702664078", distance: 924 },

      ]

    },

    "GoodHope": {

      id: "GoodHope",

      lat: -35,

      lng: 19,

      isCity: false,

      neighbors: [

        { nodeId: "WP_GoodHope_Sydney_0", distance: 3099.75 },

        { nodeId: "node_1764702149846", distance: 62 },

      ]

    },

    "Hong Kong": {

      id: "Hong Kong",

      lat: 22.15,

      lng: 114.25,

      isCity: true,

      neighbors: [

        { nodeId: "WP_Hong Kong_SouthChinaSea_South_0", distance: 449.69 },

        { nodeId: "WP_Hong Kong_Taiwan_North_0", distance: 248.62 },

      ]

    },

    "HornOfBrazil": {

      id: "HornOfBrazil",

      lat: -4.521666342614791,

      lng: -33.66210937500001,

      isCity: false,

      neighbors: [

        { nodeId: "WP_EnglishChannel_West_HornOfBrazil_1", distance: 941.69 },

        { nodeId: "WP_HornOfBrazil_New York_0", distance: 1585.26 },

        { nodeId: "WP_HornOfBrazil_Santos_0", distance: 600.99 },

        { nodeId: "WP_Cape Town_HornOfBrazil_0", distance: 1765.96 },

      ]

    },

    "Kattegat_Anholt": {

      id: "Kattegat_Anholt",

      lat: 56.683391113557796,

      lng: 12.035522460937502,

      isCity: false,

      neighbors: [

        { nodeId: "Sound_North", distance: 47.91 },

        { nodeId: "WP_Aarhus_Kattegat_Anholt_2", distance: 20.59 },

        { nodeId: "Skagen", distance: 77.38 },

      ]

    },

    "Los Angeles": {

      id: "Los Angeles",

      lat: 33.7,

      lng: -118.28,

      isCity: true,

      neighbors: [

        { nodeId: "WP_Los Angeles_Pacific_Mid_0", distance: 587.2 },

        { nodeId: "WP_Los Angeles_Panama_Pacific_0", distance: 1583.14 },

      ]

    },

    "LuzonStrait": {

      id: "LuzonStrait",

      lat: 20,

      lng: 120,

      isCity: false,

      neighbors: [

        { nodeId: "WP_LuzonStrait_SouthChinaSea_South_0", distance: 296.65 },

        { nodeId: "WP_LuzonStrait_Tokyo_0", distance: 504.69 },

        { nodeId: "WP_LuzonStrait_Pacific_Mid_0", distance: 1130.51 },

        { nodeId: "WP_LuzonStrait_Sydney_0", distance: 1291.44 },

      ]

    },

    "Malacca_North": {

      id: "Malacca_North",

      lat: 6.1,

      lng: 95,

      isCity: false,

      neighbors: [

        { nodeId: "WP_Malacca_North_SriLanka_South_0", distance: 416.8 },

        { nodeId: "WP_Malacca_North_Singapore_West_0", distance: 188.61 },

      ]

    },

    "Mumbai": {

      id: "Mumbai",

      lat: 18.9,

      lng: 72.75,

      isCity: true,

      neighbors: [

        { nodeId: "WP_BabElMandeb_Mumbai_0", distance: 1065.87 },

        { nodeId: "SriLanka_South", distance: 919.11 },

      ]

    },

    "New York": {

      id: "New York",

      lat: 40.45,

      lng: -73.9,

      isCity: true,

      neighbors: [

        { nodeId: "WP_New York_NorthAtlantic_Mid_0", distance: 409.88 },

        { nodeId: "CapeHatteras", distance: 330.98 },

        { nodeId: "WP_HornOfBrazil_New York_1", distance: 800.29 },

      ]

    },

    "NorthAtlantic_Mid": {

      id: "NorthAtlantic_Mid",

      lat: 48,

      lng: -35,

      isCity: false,

      neighbors: [

        { nodeId: "WP_EnglishChannel_West_NorthAtlantic_Mid_0", distance: 832.31 },

        { nodeId: "WP_New York_NorthAtlantic_Mid_1", distance: 670.33 },

      ]

    },

    "Panama_Carib": {

      id: "Panama_Carib",

      lat: 9.4,

      lng: -79.9,

      isCity: false,

      neighbors: [

        { nodeId: "WP_FloridaStraits_Panama_Carib_1", distance: 340.76 },

        { nodeId: "node_1764702113419", distance: 38 },

      ]

    },

    "Panama_Pacific": {

      id: "Panama_Pacific",

      lat: 6.118707747190845,

      lng: -79.78271484375001,

      isCity: false,

      neighbors: [

        { nodeId: "WP_Los Angeles_Panama_Pacific_1", distance: 626.77 },

        { nodeId: "node_1764702113419", distance: 228 },

      ]

    },

    "Portugal_South": {

      id: "Portugal_South",

      lat: 36.5,

      lng: -9.5,

      isCity: false,

      neighbors: [

        { nodeId: "WP_EnglishChannel_West_Portugal_South_0", distance: 424.17 },

        { nodeId: "Gibraltar_West", distance: 172.54 },

        { nodeId: "WP_EnglishChannel_West_HornOfBrazil_0", distance: 869 },

      ]

    },

    "Rotterdam": {

      id: "Rotterdam",

      lat: 51.9883,

      lng: 3.9207,

      isCity: true,

      neighbors: [

        { nodeId: "WP_GermanBight_Rotterdam_0", distance: 115.31 },

        { nodeId: "EnglishChannel_East", distance: 103.74 },

      ]

    },

    "San Francisco": {

      id: "San Francisco",

      lat: 37.8,

      lng: -122.55,

      isCity: true,

      neighbors: [

        { nodeId: "WP_Pacific_Mid_San Francisco_0", distance: 214.08 },

      ]

    },

    "Santos": {

      id: "Santos",

      lat: -24.05,

      lng: -46.3,

      isCity: true,

      neighbors: [

        { nodeId: "WP_HornOfBrazil_Santos_0", distance: 817.89 },

      ]

    },

    "Shanghai": {

      id: "Shanghai",

      lat: 30.62,

      lng: 122.07,

      isCity: true,

      neighbors: [

        { nodeId: "Taiwan_North", distance: 276.53 },

        { nodeId: "WP_Busan_Shanghai_0", distance: 167.97 },

        { nodeId: "WP_Shanghai_Tokyo_0", distance: 308.25 },

      ]

    },

    "Singapore": {

      id: "Singapore",

      lat: 1.2,

      lng: 103.85,

      isCity: true,

      neighbors: [

        { nodeId: "Singapore_West", distance: 21.21 },

        { nodeId: "Singapore_East", distance: 27.46 },

      ]

    },

    "Singapore_East": {

      id: "Singapore_East",

      lat: 1.323734761011294,

      lng: 104.45526123046876,

      isCity: false,

      neighbors: [

        { nodeId: "Singapore", distance: 27.46 },

        { nodeId: "SouthChinaSea_South", distance: 150.84 },

      ]

    },

    "Singapore_West": {

      id: "Singapore_West",

      lat: 1.082088987706367,

      lng: 103.58459472656251,

      isCity: false,

      neighbors: [

        { nodeId: "WP_Malacca_North_Singapore_West_2", distance: 162.9 },

        { nodeId: "Singapore", distance: 21.21 },

      ]

    },

    "Skagen": {

      id: "Skagen",

      lat: 57.9615,

      lng: 10.7089,

      isCity: false,

      neighbors: [

        { nodeId: "Kattegat_Anholt", distance: 77.38 },

        { nodeId: "WP_GermanBight_Skagen_0", distance: 93.52 },

        { nodeId: "node_1764701935054", distance: 62 },

      ]

    },

    "Sound_North": {

      id: "Sound_North",

      lat: 56.0462,

      lng: 12.6418,

      isCity: false,

      neighbors: [

        { nodeId: "Copenhagen", distance: 20.88 },

        { nodeId: "Kattegat_Anholt", distance: 47.91 },

      ]

    },

    "SouthChinaSea_South": {

      id: "SouthChinaSea_South",

      lat: 3.5,

      lng: 105.5,

      isCity: false,

      neighbors: [

        { nodeId: "Singapore_East", distance: 150.84 },

        { nodeId: "WP_Hong Kong_SouthChinaSea_South_1", distance: 427.63 },

        { nodeId: "WP_LuzonStrait_SouthChinaSea_South_0", distance: 297.91 },

      ]

    },

    "SriLanka_South": {

      id: "SriLanka_South",

      lat: 5.6,

      lng: 80.4,

      isCity: false,

      neighbors: [

        { nodeId: "WP_BabElMandeb_SriLanka_South_1", distance: 622.84 },

        { nodeId: "Mumbai", distance: 919.11 },

        { nodeId: "WP_Dubai_SriLanka_South_0", distance: 1422.87 },

        { nodeId: "WP_Malacca_North_SriLanka_South_0", distance: 455.98 },

        { nodeId: "WP_GoodHope_SriLanka_South_0", distance: 2328.09 },

      ]

    },

    "Suez_North": {

      id: "Suez_North",

      lat: 31.5,

      lng: 32.3,

      isCity: false,

      neighbors: [

        { nodeId: "WP_Gibraltar_East_Suez_North_3", distance: 426.94 },

        { nodeId: "Suez_South", distance: 119.63 },

      ]

    },

    "Suez_South": {

      id: "Suez_South",

      lat: 29.5161,

      lng: 32.514,

      isCity: false,

      neighbors: [

        { nodeId: "Suez_North", distance: 119.63 },

        { nodeId: "WP_BabElMandeb_Suez_South_0", distance: 388.39 },

      ]

    },

    "Sydney": {

      id: "Sydney",

      lat: -33.82,

      lng: 151.35,

      isCity: true,

      neighbors: [

        { nodeId: "node_1764702184324", distance: 777 },

        { nodeId: "node_1764702194323", distance: 340 },

      ]

    },

    "Taiwan_North": {

      id: "Taiwan_North",

      lat: 25.5,

      lng: 122,

      isCity: false,

      neighbors: [

        { nodeId: "WP_Hong Kong_Taiwan_North_0", distance: 228.56 },

        { nodeId: "Shanghai", distance: 276.53 },

      ]

    },

    "Tokyo": {

      id: "Tokyo",

      lat: 35.6,

      lng: 139.9,

      isCity: true,

      neighbors: [

        { nodeId: "WP_Shanghai_Tokyo_1", distance: 278.08 },

        { nodeId: "WP_LuzonStrait_Tokyo_0", distance: 843.17 },

        { nodeId: "WP_Pacific_Mid_Tokyo_0", distance: 934.33 },

      ]

    },

    "WP_Aarhus_Kattegat_Anholt_0": {

      id: "WP_Aarhus_Kattegat_Anholt_0",

      lat: 56.0498,

      lng: 10.4562,

      isCity: false,

      neighbors: [

        { nodeId: "Aarhus", distance: 9.56 },

        { nodeId: "WP_Aarhus_Kattegat_Anholt_1", distance: 13.74 },

      ]

    },

    "WP_Aarhus_Kattegat_Anholt_1": {

      id: "WP_Aarhus_Kattegat_Anholt_1",

      lat: 56.049033533749586,

      lng: 10.840759277343752,

      isCity: false,

      neighbors: [

        { nodeId: "WP_Aarhus_Kattegat_Anholt_0", distance: 13.74 },

        { nodeId: "WP_Aarhus_Kattegat_Anholt_2", distance: 25.44 },

      ]

    },

    "WP_Aarhus_Kattegat_Anholt_2": {

      id: "WP_Aarhus_Kattegat_Anholt_2",

      lat: 56.36525013685609,

      lng: 11.310424804687502,

      isCity: false,

      neighbors: [

        { nodeId: "WP_Aarhus_Kattegat_Anholt_1", distance: 25.44 },

        { nodeId: "Kattegat_Anholt", distance: 20.59 },

        { nodeId: "node_1764701935054", distance: 39 },

      ]

    },

    "WP_BabElMandeb_Dubai_0": {

      id: "WP_BabElMandeb_Dubai_0",

      lat: 13.5819,

      lng: 53.0777,

      isCity: false,

      neighbors: [

        { nodeId: "BabElMandeb", distance: 563.93 },

        { nodeId: "WP_BabElMandeb_Dubai_1", distance: 791.24 },

      ]

    },

    "WP_BabElMandeb_Dubai_1": {

      id: "WP_BabElMandeb_Dubai_1",

      lat: 26.5,

      lng: 56.5,

      isCity: false,

      neighbors: [

        { nodeId: "WP_BabElMandeb_Dubai_0", distance: 791.24 },

        { nodeId: "Dubai", distance: 121.28 },

      ]

    },

    "WP_BabElMandeb_Mumbai_0": {

      id: "WP_BabElMandeb_Mumbai_0",

      lat: 14,

      lng: 55,

      isCity: false,

      neighbors: [

        { nodeId: "BabElMandeb", distance: 678.01 },

        { nodeId: "Mumbai", distance: 1065.87 },

      ]

    },

    "WP_BabElMandeb_SriLanka_South_0": {

      id: "WP_BabElMandeb_SriLanka_South_0",

      lat: 12,

      lng: 52,

      isCity: false,

      neighbors: [

        { nodeId: "BabElMandeb", distance: 499.6 },

        { nodeId: "WP_BabElMandeb_SriLanka_South_1", distance: 1090.28 },

      ]

    },

    "WP_BabElMandeb_SriLanka_South_1": {

      id: "WP_BabElMandeb_SriLanka_South_1",

      lat: 8,

      lng: 70,

      isCity: false,

      neighbors: [

        { nodeId: "WP_BabElMandeb_SriLanka_South_0", distance: 1090.28 },

        { nodeId: "SriLanka_South", distance: 622.84 },

      ]

    },

    "WP_BabElMandeb_Suez_South_0": {

      id: "WP_BabElMandeb_Suez_South_0",

      lat: 16,

      lng: 41,

      isCity: false,

      neighbors: [

        { nodeId: "BabElMandeb", distance: 255.57 },

        { nodeId: "WP_BabElMandeb_Suez_South_1", distance: 560.3 },

      ]

    },

    "WP_BabElMandeb_Suez_South_1": {

      id: "WP_BabElMandeb_Suez_South_1",

      lat: 24,

      lng: 36,

      isCity: false,

      neighbors: [

        { nodeId: "WP_BabElMandeb_Suez_South_0", distance: 560.3 },

        { nodeId: "Suez_South", distance: 388.39 },

      ]

    },

    "WP_Busan_Shanghai_0": {

      id: "WP_Busan_Shanghai_0",

      lat: 32,

      lng: 125,

      isCity: false,

      neighbors: [

        { nodeId: "Busan", distance: 280.55 },

        { nodeId: "Shanghai", distance: 167.97 },

      ]

    },

    "WP_Cape Town_Gibraltar_West_0": {

      id: "WP_Cape Town_Gibraltar_West_0",

      lat: -10,

      lng: -10,

      isCity: false,

      neighbors: [

        { nodeId: "Cape Town", distance: 2039.1 },

        { nodeId: "WP_Cape Town_Gibraltar_West_1", distance: 1262.03 },

      ]

    },

    "WP_Cape Town_Gibraltar_West_1": {

      id: "WP_Cape Town_Gibraltar_West_1",

      lat: 10,

      lng: -20,

      isCity: false,

      neighbors: [

        { nodeId: "WP_Cape Town_Gibraltar_West_0", distance: 1262.03 },

        { nodeId: "node_1764702664078", distance: 1012 },

      ]

    },

    "WP_Cape Town_HornOfBrazil_0": {

      id: "WP_Cape Town_HornOfBrazil_0",

      lat: -20,

      lng: -10,

      isCity: false,

      neighbors: [

        { nodeId: "Cape Town", distance: 1629.53 },

        { nodeId: "HornOfBrazil", distance: 1765.96 },

        { nodeId: "WP_HornOfBrazil_Santos_0", distance: 1250 },

      ]

    },

    "WP_CapeHatteras_FloridaStraits_0": {

      id: "WP_CapeHatteras_FloridaStraits_0",

      lat: 30,

      lng: -78,

      isCity: false,

      neighbors: [

        { nodeId: "CapeHatteras", distance: 333.91 },

        { nodeId: "FloridaStraits", distance: 358.61 },

      ]

    },

    "WP_Dubai_SriLanka_South_0": {

      id: "WP_Dubai_SriLanka_South_0",

      lat: 22,

      lng: 62,

      isCity: false,

      neighbors: [

        { nodeId: "Dubai", distance: 423.97 },

        { nodeId: "SriLanka_South", distance: 1422.87 },

      ]

    },

    "WP_EnglishChannel_East_EnglishChannel_West_0": {

      id: "WP_EnglishChannel_East_EnglishChannel_West_0",

      lat: 50.5,

      lng: 0,

      isCity: false,

      neighbors: [

        { nodeId: "EnglishChannel_East", distance: 69.4 },

        { nodeId: "WP_EnglishChannel_East_EnglishChannel_West_1", distance: 122.63 },

      ]

    },

    "WP_EnglishChannel_East_EnglishChannel_West_1": {

      id: "WP_EnglishChannel_East_EnglishChannel_West_1",

      lat: 49.8,

      lng: -3,

      isCity: false,

      neighbors: [

        { nodeId: "WP_EnglishChannel_East_EnglishChannel_West_0", distance: 122.63 },

        { nodeId: "EnglishChannel_West", distance: 148.9 },

      ]

    },

    "WP_EnglishChannel_West_HornOfBrazil_0": {

      id: "WP_EnglishChannel_West_HornOfBrazil_0",

      lat: 30,

      lng: -25,

      isCity: false,

      neighbors: [

        { nodeId: "WP_EnglishChannel_West_HornOfBrazil_1", distance: 1227.98 },

        { nodeId: "Portugal_South", distance: 869 },

        { nodeId: "WP_EnglishChannel_West_Portugal_South_0", distance: 1051 },

        { nodeId: "node_1764702664078", distance: 299 },

      ]

    },

    "WP_EnglishChannel_West_HornOfBrazil_1": {

      id: "WP_EnglishChannel_West_HornOfBrazil_1",

      lat: 10,

      lng: -30,

      isCity: false,

      neighbors: [

        { nodeId: "WP_EnglishChannel_West_HornOfBrazil_0", distance: 1227.98 },

        { nodeId: "HornOfBrazil", distance: 941.69 },

      ]

    },

    "WP_EnglishChannel_West_NorthAtlantic_Mid_0": {

      id: "WP_EnglishChannel_West_NorthAtlantic_Mid_0",

      lat: 49,

      lng: -15,

      isCity: false,

      neighbors: [

        { nodeId: "EnglishChannel_West", distance: 340.99 },

        { nodeId: "NorthAtlantic_Mid", distance: 832.31 },

      ]

    },

    "WP_EnglishChannel_West_Portugal_South_0": {

      id: "WP_EnglishChannel_West_Portugal_South_0",

      lat: 43.5,

      lng: -11,

      isCity: false,

      neighbors: [

        { nodeId: "EnglishChannel_West", distance: 364.21 },

        { nodeId: "Portugal_South", distance: 424.17 },

        { nodeId: "WP_EnglishChannel_West_HornOfBrazil_0", distance: 1051 },

      ]

    },

    "WP_FloridaStraits_Panama_Carib_0": {

      id: "WP_FloridaStraits_Panama_Carib_0",

      lat: 22,

      lng: -85,

      isCity: false,

      neighbors: [

        { nodeId: "FloridaStraits", distance: 286.56 },

        { nodeId: "WP_FloridaStraits_Panama_Carib_1", distance: 477.79 },

      ]

    },

    "WP_FloridaStraits_Panama_Carib_1": {

      id: "WP_FloridaStraits_Panama_Carib_1",

      lat: 15,

      lng: -81,

      isCity: false,

      neighbors: [

        { nodeId: "WP_FloridaStraits_Panama_Carib_0", distance: 477.79 },

        { nodeId: "Panama_Carib", distance: 340.76 },

      ]

    },

    "WP_GermanBight_Rotterdam_0": {

      id: "WP_GermanBight_Rotterdam_0",

      lat: 53.5403,

      lng: 4.7571,

      isCity: false,

      neighbors: [

        { nodeId: "GermanBight", distance: 105.16 },

        { nodeId: "Rotterdam", distance: 115.31 },

      ]

    },

    "WP_GermanBight_Skagen_0": {

      id: "WP_GermanBight_Skagen_0",

      lat: 57,

      lng: 8,

      isCity: false,

      neighbors: [

        { nodeId: "GermanBight", distance: 175.86 },

        { nodeId: "Skagen", distance: 93.52 },

      ]

    },

    "WP_Gibraltar_East_Suez_North_0": {

      id: "WP_Gibraltar_East_Suez_North_0",

      lat: 37.5,

      lng: 5,

      isCity: false,

      neighbors: [

        { nodeId: "Gibraltar_East", distance: 161.49 },

        { nodeId: "WP_Gibraltar_East_Suez_North_1", distance: 286.36 },

      ]

    },

    "WP_Gibraltar_East_Suez_North_1": {

      id: "WP_Gibraltar_East_Suez_North_1",

      lat: 37.6,

      lng: 11,

      isCity: false,

      neighbors: [

        { nodeId: "WP_Gibraltar_East_Suez_North_0", distance: 286.36 },

        { nodeId: "WP_Gibraltar_East_Suez_North_2", distance: 276.72 },

      ]

    },

    "WP_Gibraltar_East_Suez_North_2": {

      id: "WP_Gibraltar_East_Suez_North_2",

      lat: 35.5,

      lng: 16,

      isCity: false,

      neighbors: [

        { nodeId: "WP_Gibraltar_East_Suez_North_1", distance: 276.72 },

        { nodeId: "WP_Gibraltar_East_Suez_North_3", distance: 462.41 },

      ]

    },

    "WP_Gibraltar_East_Suez_North_3": {

      id: "WP_Gibraltar_East_Suez_North_3",

      lat: 33.5,

      lng: 25,

      isCity: false,

      neighbors: [

        { nodeId: "WP_Gibraltar_East_Suez_North_2", distance: 462.41 },

        { nodeId: "Suez_North", distance: 426.94 },

      ]

    },

    "WP_GoodHope_SriLanka_South_0": {

      id: "WP_GoodHope_SriLanka_South_0",

      lat: -20,

      lng: 50,

      isCity: false,

      neighbors: [

        { nodeId: "SriLanka_South", distance: 2328.09 },

      ]

    },

    "WP_GoodHope_Sydney_0": {

      id: "WP_GoodHope_Sydney_0",

      lat: -40,

      lng: 80,

      isCity: false,

      neighbors: [

        { nodeId: "GoodHope", distance: 3099.75 },

        { nodeId: "WP_GoodHope_Sydney_1", distance: 1838.74 },

      ]

    },

    "WP_GoodHope_Sydney_1": {

      id: "WP_GoodHope_Sydney_1",

      lat: -40,

      lng: 120,

      isCity: false,

      neighbors: [

        { nodeId: "WP_GoodHope_Sydney_0", distance: 1838.74 },

        { nodeId: "node_1764702184324", distance: 1369 },

      ]

    },

    "WP_Hong Kong_SouthChinaSea_South_0": {

      id: "WP_Hong Kong_SouthChinaSea_South_0",

      lat: 15,

      lng: 112,

      isCity: false,

      neighbors: [

        { nodeId: "Hong Kong", distance: 449.69 },

        { nodeId: "WP_Hong Kong_SouthChinaSea_South_1", distance: 509.05 },

      ]

    },

    "WP_Hong Kong_SouthChinaSea_South_1": {

      id: "WP_Hong Kong_SouthChinaSea_South_1",

      lat: 7,

      lng: 109,

      isCity: false,

      neighbors: [

        { nodeId: "WP_Hong Kong_SouthChinaSea_South_0", distance: 509.05 },

        { nodeId: "SouthChinaSea_South", distance: 427.63 },

      ]

    },

    "WP_Hong Kong_Taiwan_North_0": {

      id: "WP_Hong Kong_Taiwan_North_0",

      lat: 24,

      lng: 118.5,

      isCity: false,

      neighbors: [

        { nodeId: "Hong Kong", distance: 248.62 },

        { nodeId: "Taiwan_North", distance: 228.56 },

      ]

    },

    "WP_HornOfBrazil_New York_0": {

      id: "WP_HornOfBrazil_New York_0",

      lat: 10,

      lng: -50,

      isCity: false,

      neighbors: [

        { nodeId: "HornOfBrazil", distance: 1585.26 },

        { nodeId: "WP_HornOfBrazil_New York_1", distance: 1337.7 },

      ]

    },

    "WP_HornOfBrazil_New York_1": {

      id: "WP_HornOfBrazil_New York_1",

      lat: 30,

      lng: -60,

      isCity: false,

      neighbors: [

        { nodeId: "WP_HornOfBrazil_New York_0", distance: 1337.7 },

        { nodeId: "New York", distance: 800.29 },

      ]

    },

    "WP_HornOfBrazil_Santos_0": {

      id: "WP_HornOfBrazil_Santos_0",

      lat: -22.998851594142923,

      lng: -32.16796875000001,

      isCity: false,

      neighbors: [

        { nodeId: "HornOfBrazil", distance: 600.99 },

        { nodeId: "Santos", distance: 817.89 },

        { nodeId: "WP_Cape Town_HornOfBrazil_0", distance: 1250 },

      ]

    },

    "WP_Los Angeles_Pacific_Mid_0": {

      id: "WP_Los Angeles_Pacific_Mid_0",

      lat: 33.394759218577995,

      lng: -121.11328125000001,

      isCity: false,

      neighbors: [

        { nodeId: "Los Angeles", distance: 587.2 },

        { nodeId: "WP_Pacific_Mid_San Francisco_0", distance: 284 },

      ]

    },

    "WP_Los Angeles_Panama_Pacific_0": {

      id: "WP_Los Angeles_Panama_Pacific_0",

      lat: 19.932041306115536,

      lng: -116.01562500000001,

      isCity: false,

      neighbors: [

        { nodeId: "Los Angeles", distance: 1583.14 },

        { nodeId: "WP_Los Angeles_Panama_Pacific_1", distance: 1290.6 },

      ]

    },

    "WP_Los Angeles_Panama_Pacific_1": {

      id: "WP_Los Angeles_Panama_Pacific_1",

      lat: 10,

      lng: -90,

      isCity: false,

      neighbors: [

        { nodeId: "WP_Los Angeles_Panama_Pacific_0", distance: 1290.6 },

        { nodeId: "Panama_Pacific", distance: 626.77 },

      ]

    },

    "WP_LuzonStrait_Pacific_Mid_0": {

      id: "WP_LuzonStrait_Pacific_Mid_0",

      lat: 22,

      lng: 140,

      isCity: false,

      neighbors: [

        { nodeId: "LuzonStrait", distance: 1130.51 },

      ]

    },

    "WP_LuzonStrait_SouthChinaSea_South_0": {

      id: "WP_LuzonStrait_SouthChinaSea_South_0",

      lat: 16,

      lng: 116,

      isCity: false,

      neighbors: [

        { nodeId: "LuzonStrait", distance: 322.89 },

        { nodeId: "WP_LuzonStrait_SouthChinaSea_South_1", distance: 300.86 },

      ]

    },

    "WP_LuzonStrait_SouthChinaSea_South_1": {

      id: "WP_LuzonStrait_SouthChinaSea_South_1",

      lat: 12,

      lng: 113,

      isCity: false,

      neighbors: [

        { nodeId: "WP_LuzonStrait_SouthChinaSea_South_0", distance: 300.86 },

        { nodeId: "SouthChinaSea_South", distance: 297.91 },

      ]

    },

    "WP_LuzonStrait_Sydney_0": {

      id: "WP_LuzonStrait_Sydney_0",

      lat: 0,

      lng: 145,

      isCity: false,

      neighbors: [

        { nodeId: "LuzonStrait", distance: 1291.44 },

        { nodeId: "WP_LuzonStrait_Sydney_1", distance: 911.03 },

      ]

    },

    "WP_LuzonStrait_Sydney_1": {

      id: "WP_LuzonStrait_Sydney_1",

      lat: -10,

      lng: 152,

      isCity: false,

      neighbors: [

        { nodeId: "WP_LuzonStrait_Sydney_0", distance: 911.03 },

        { nodeId: "node_1764702194323", distance: 1251 },

      ]

    },

    "WP_LuzonStrait_Tokyo_0": {

      id: "WP_LuzonStrait_Tokyo_0",

      lat: 25,

      lng: 128,

      isCity: false,

      neighbors: [

        { nodeId: "LuzonStrait", distance: 504.69 },

        { nodeId: "Tokyo", distance: 843.17 },

      ]

    },

    "WP_Malacca_North_Singapore_West_0": {

      id: "WP_Malacca_North_Singapore_West_0",

      lat: 5.2,

      lng: 98,

      isCity: false,

      neighbors: [

        { nodeId: "Malacca_North", distance: 188.61 },

        { nodeId: "WP_Malacca_North_Singapore_West_1", distance: 151.03 },

      ]

    },

    "WP_Malacca_North_Singapore_West_1": {

      id: "WP_Malacca_North_Singapore_West_1",

      lat: 3.8,

      lng: 100.2,

      isCity: false,

      neighbors: [

        { nodeId: "WP_Malacca_North_Singapore_West_0", distance: 151.03 },

        { nodeId: "WP_Malacca_North_Singapore_West_2", distance: 83.42 },

      ]

    },

    "WP_Malacca_North_Singapore_West_2": {

      id: "WP_Malacca_North_Singapore_West_2",

      lat: 2.8,

      lng: 101.2,

      isCity: false,

      neighbors: [

        { nodeId: "WP_Malacca_North_Singapore_West_1", distance: 83.42 },

        { nodeId: "Singapore_West", distance: 162.9 },

      ]

    },

    "WP_Malacca_North_SriLanka_South_0": {

      id: "WP_Malacca_North_SriLanka_South_0",

      lat: 6,

      lng: 88,

      isCity: false,

      neighbors: [

        { nodeId: "Malacca_North", distance: 416.8 },

        { nodeId: "SriLanka_South", distance: 455.98 },

      ]

    },

    "WP_New York_NorthAtlantic_Mid_0": {

      id: "WP_New York_NorthAtlantic_Mid_0",

      lat: 41,

      lng: -65,

      isCity: false,

      neighbors: [

        { nodeId: "New York", distance: 409.88 },

        { nodeId: "WP_New York_NorthAtlantic_Mid_1", distance: 814.41 },

      ]

    },

    "WP_New York_NorthAtlantic_Mid_1": {

      id: "WP_New York_NorthAtlantic_Mid_1",

      lat: 45,

      lng: -48,

      isCity: false,

      neighbors: [

        { nodeId: "WP_New York_NorthAtlantic_Mid_0", distance: 814.41 },

        { nodeId: "NorthAtlantic_Mid", distance: 670.33 },

      ]

    },

    "WP_Pacific_Mid_San Francisco_0": {

      id: "WP_Pacific_Mid_San Francisco_0",

      lat: 37.54457732085584,

      lng: -123.90380859375001,

      isCity: false,

      neighbors: [

        { nodeId: "San Francisco", distance: 214.08 },

        { nodeId: "WP_Los Angeles_Pacific_Mid_0", distance: 284 },

      ]

    },

    "WP_Pacific_Mid_Tokyo_0": {

      id: "WP_Pacific_Mid_Tokyo_0",

      lat: 40,

      lng: 180,

      isCity: false,

      neighbors: [

        { nodeId: "WP_Pacific_Mid_Tokyo_1", distance: 1486.31 },

      ]

    },

    "WP_Pacific_Mid_Tokyo_1": {

      id: "WP_Pacific_Mid_Tokyo_1",

      lat: 36,

      lng: 150,

      isCity: false,

      neighbors: [

        { nodeId: "WP_Pacific_Mid_Tokyo_0", distance: 1486.31 },

        { nodeId: "Tokyo", distance: 934.33 },

      ]

    },

    "WP_Shanghai_Tokyo_0": {

      id: "WP_Shanghai_Tokyo_0",

      lat: 31,

      lng: 128,

      isCity: false,

      neighbors: [

        { nodeId: "Shanghai", distance: 308.25 },

        { nodeId: "WP_Shanghai_Tokyo_1", distance: 373.88 },

      ]

    },

    "WP_Shanghai_Tokyo_1": {

      id: "WP_Shanghai_Tokyo_1",

      lat: 33,

      lng: 135,

      isCity: false,

      neighbors: [

        { nodeId: "WP_Shanghai_Tokyo_0", distance: 373.88 },

        { nodeId: "Tokyo", distance: 278.08 },

      ]

    },

    "node_1764701935054": {

      id: "node_1764701935054",

      lat: 56.93298739609707,

      lng: 10.7281494140625,

      isCity: false,

      neighbors: [

        { nodeId: "WP_Aarhus_Kattegat_Anholt_2", distance: 39 },

        { nodeId: "Skagen", distance: 62 },

      ]

    },

    "node_1764702113419": {

      id: "node_1764702113419",

      lat: 8.886428472675608,

      lng: -79.53552246093751,

      isCity: false,

      neighbors: [

        { nodeId: "Panama_Carib", distance: 38 },

        { nodeId: "Panama_Pacific", distance: 228 },

      ]

    },

    "node_1764702149846": {

      id: "node_1764702149846",

      lat: -34.37517887533528,

      lng: 17.995605468750004,

      isCity: false,

      neighbors: [

        { nodeId: "Cape Town", distance: 36 },

        { nodeId: "GoodHope", distance: 62 },

      ]

    },

    "node_1764702184324": {

      id: "node_1764702184324",

      lat: -46.73986059969268,

      lng: 150.20507812500003,

      isCity: false,

      neighbors: [

        { nodeId: "WP_GoodHope_Sydney_1", distance: 1369 },

        { nodeId: "node_1764702194323", distance: 1028 },

        { nodeId: "Sydney", distance: 777 },

      ]

    },

    "node_1764702194323": {

      id: "node_1764702194323",

      lat: -30.372875188118016,

      lng: 156.66503906250003,

      isCity: false,

      neighbors: [

        { nodeId: "node_1764702184324", distance: 1028 },

        { nodeId: "Sydney", distance: 340 },

        { nodeId: "WP_LuzonStrait_Sydney_1", distance: 1251 },

      ]

    },

    "node_1764702664078": {

      id: "node_1764702664078",

      lat: 28.149846669712613,

      lng: -20.434570312500004,

      isCity: false,

      neighbors: [

        { nodeId: "WP_Cape Town_Gibraltar_West_1", distance: 1012 },

        { nodeId: "WP_EnglishChannel_West_HornOfBrazil_0", distance: 299 },

        { nodeId: "Gibraltar_West", distance: 924 },

      ]

    },

  };

  