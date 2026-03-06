export const demoOrderJson = {
  orderId: 'ORDER-DEMO-MULTI-001',
  sawKerfMm: 4, // 锯片厚度
  products: [
    {
      id: 'P1',
      minLength: 500,
      maxLength: 500,
      minWidth: 100,
      maxWidth: 100,
      minHeight: 50,
      maxHeight: 50,
      refHeight: 50,
      refWidth: 100,
      qty: 10,
      value: 0.6,
      sections: [
        {
          id: 'S1',
          begin: 0,
          length: 500,
          zones: [
            {
              id: 'Z-all',
              begin: 0,
              length: 300,
              defectRules: [
                {
                  defectName: 'Knot',
                  maxCount: 3,
                  defectLength: 40,
                  defectHeight: 40,
                  referenceLength: 500
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'P2',
      minLength: 1000,
      maxLength: 1000,
      minWidth: 100,
      maxWidth: 100,
      minHeight: 50,
      maxHeight: 50,
      refHeight: 50,
      refWidth: 100,
      qty: 10,
      value: 0.8,
      sections: [
        {
          id: 'S1',
          begin: 0,
          length: 1000,
          zones: [
            {
              id: 'Z-all',
              begin: 0,
              length: 300,
              defectRules: [
                {
                  defectName: 'Knot',
                  maxCount: 3,
                  defectLength: 40,
                  defectHeight: 40,
                  referenceLength: 1000
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'P3',
      minLength: 2000,
      maxLength: 2000,
      minWidth: 100,
      maxWidth: 100,
      minHeight: 50,
      maxHeight: 50,
      refHeight: 50,
      refWidth: 100,
      qty: 10,
      value: 1.0,
      sections: [
        {
          id: 'S1',
          begin: 0,
          length: 2000,
          zones: [
            {
              id: 'Z-all',
              begin: 0,
              length: 300,
              defectRules: [
                {
                  defectName: 'Knot',
                  maxCount: 3,
                  defectLength: 40,
                  defectHeight: 40,
                  referenceLength: 2000
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

export const defectnames = [
  "crack",
  "resin",
  "black knot",
  "wormhole"
];

export const demoWoods = [
  {
    "woodId": "WOOD-DEMO-001",
    "length": 1798.08,
    "width": 62.04,
    "height": 18,
    "imgwidth":3746,
    "imgheight":129,
    "defectDetails": {
      "top": [
       {"bbox":[135,1,12,142],"class":"crack"},
    {"bbox":[80,416,49,61],"class":"resin"},
    {"bbox":[0,555,13,147],"class":"crack"},
    {"bbox":[0,555,11,146],"class":"crack"},
    {"bbox":[0,693,14,146],"class":"crack"},
    {"bbox":[0,693,11,146],"class":"crack"},
    {"bbox":[0,832,16,147],"class":"crack"},
    {"bbox":[0,832,12,147],"class":"crack"},
    {"bbox":[0,971,14,148],"class":"crack"},
    {"bbox":[0,971,11,147],"class":"crack"},
    {"bbox":[0,971,24,147],"class":"crack"},
    {"bbox":[0,1110,18,147],"class":"crack"},
    {"bbox":[0,1110,11,147],"class":"crack"},
    {"bbox":[0,1248,18,148],"class":"crack"},
    {"bbox":[0,1248,14,148],"class":"crack"},
    {"bbox":[0,1387,16,147],"class":"crack"},
    {"bbox":[0,1387,13,147],"class":"crack"},
    {"bbox":[0,1387,24,147],"class":"crack"},
    {"bbox":[0,1526,18,147],"class":"crack"},
    {"bbox":[0,1665,17,146],"class":"crack"},
    {"bbox":[0,1803,19,146],"class":"crack"},
    {"bbox":[0,1804,14,146],"class":"crack"},
    {"bbox":[0,1942,17,147],"class":"crack"},
    {"bbox":[0,2081,18,147],"class":"crack"},
    {"bbox":[0,2220,18,147],"class":"crack"},
    {"bbox":[0,2220,14,147],"class":"crack"},
    {"bbox":[0,2358,12,147],"class":"crack"},
    {"bbox":[0,2497,10,138],"class":"resin"},
    {"bbox":[0,2636,10,146],"class":"crack"},
    {"bbox":[0,2636,13,147],"class":"crack"},
    {"bbox":[0,2775,16,147],"class":"crack"},
    {"bbox":[0,2776,12,146],"class":"crack"},
    {"bbox":[73,2913,57,76],"class":"black knot"},
    {"bbox":[0,2914,9,146],"class":"crack"},
    {"bbox":[0,2913,12,147],"class":"crack"},
    {"bbox":[0,3052,14,146],"class":"crack"},
    {"bbox":[37,3164,50,36],"class":"black knot"},
    {"bbox":[37,3163,51,36],"class":"resin"},
    {"bbox":[0,3053,11,146],"class":"crack"},
    {"bbox":[30,3191,56,25],"class":"black knot"},
    {"bbox":[87,3667,14,15],"class":"black knot"},
    {"bbox":[89,3668,11,11],"class":"wormhole"}
      ],
      "right": [],
      "bottom": [
    {"bbox":[10,1303,15,13],"class":"black knot"},
    {"bbox":[9,1671,14,14],"class":"black knot"},
    {"bbox":[44,2560,12,10],"class":"black knot"},
    {"bbox":[57,3193,42,52],"class":"black knot"},
    {"bbox":[99,3668,10,12],"class":"black knot"}
      ],
      "left": []
    }
  },
  {
    "woodId": "WOOD-DEMO-002",
    "length": 1795.2,
    "width": 61.44,
    "height": 17.3,
    "imgwidth":3740,
    "imgheight":128,
    "defectDetails": {
      "top": [
       {"bbox":[124,930,15,110],"class":"resin"},
    {"bbox":[0,1312,12,140],"class":"crack"},
    {"bbox":[0,1312,9,140],"class":"crack"},
    {"bbox":[0,1443,12,139],"class":"crack"},
    {"bbox":[0,1444,10,139],"class":"crack"},
    {"bbox":[0,1575,14,140],"class":"crack"},
    {"bbox":[0,1575,11,139],"class":"crack"},
    {"bbox":[130,1575,8,138],"class":"crack"},
    {"bbox":[0,1706,14,139],"class":"crack"},
    {"bbox":[0,1706,11,138],"class":"crack"},
    {"bbox":[0,1837,16,139],"class":"crack"},
    {"bbox":[0,1837,12,139],"class":"crack"},
    {"bbox":[130,1838,9,137],"class":"crack"},
    {"bbox":[0,1968,17,139],"class":"crack"},
    {"bbox":[0,1968,13,139],"class":"crack"},
    {"bbox":[0,2100,12,139],"class":"crack"},
    {"bbox":[16,2651,31,42],"class":"black knot"}
      ],
      "right": [],
      "bottom": [
     {"bbox":[29,944,11,25],"class":"resin"},
    {"bbox":[0,1965,15,131],"class":"crack"},
    {"bbox":[24,2649,22,25],"class":"black knot"}
      ],
      "left": []
    }
  },
  {
    "woodId": "WOOD-DEMO-003",
    "length": 1800,
    "width": 62.44,
    "height": 17.5,
    "imgwidth":3750,
    "imgheight":130,
    "defectDetails": {
      "top": [
       {"bbox":[133,183,16,49],"class":"resin"},
    {"bbox":[134,284,22,19],"class":"resin"},
    {"bbox":[81,358,38,37],"class":"black knot"},
    {"bbox":[105,294,50,111],"class":"resin"},
    {"bbox":[122,743,33,47],"class":"black knot"},
    {"bbox":[12,896,15,16],"class":"black knot"},
    {"bbox":[55,1192,38,38],"class":"black knot"},
    {"bbox":[110,1347,8,9],"class":"wormhole"},
    {"bbox":[136,1347,10,21],"class":"black knot"},
    {"bbox":[0,1471,15,156],"class":"crack"},
    {"bbox":[0,1472,12,156],"class":"crack"},
    {"bbox":[85,1750,38,25],"class":"black knot"},
    {"bbox":[0,1619,16,156],"class":"crack"},
    {"bbox":[0,1619,12,156],"class":"crack"},
    {"bbox":[0,1766,17,156],"class":"crack"},
    {"bbox":[78,1766,49,25],"class":"black knot"},
    {"bbox":[0,1766,13,156],"class":"crack"},
    {"bbox":[0,1913,13,157],"class":"crack"},
    {"bbox":[106,2401,30,45],"class":"resin"},
    {"bbox":[107,2401,29,45],"class":"black knot"},
    {"bbox":[59,2581,40,38],"class":"black knot"},
    {"bbox":[22,3233,21,14],"class":"black knot"},
    {"bbox":[16,3238,30,17],"class":"black knot"},
    {"bbox":[0,3238,8,156],"class":"crack"},
    {"bbox":[102,3548,38,35],"class":"black knot"}
      ],
      "right": [],
      "bottom": [
 {"bbox":[85,340,39,39],"class":"black knot"},
    {"bbox":[35,899,15,15],"class":"black knot"},
    {"bbox":[114,1028,8,11],"class":"wormhole"},
    {"bbox":[113,1028,10,13],"class":"wormhole"},
    {"bbox":[9,1667,11,6],"class":"black knot"},
    {"bbox":[10,1666,10,14],"class":"black knot"},
    {"bbox":[72,1731,44,38],"class":"black knot"},
    {"bbox":[0,1803,11,147],"class":"crack"},
    {"bbox":[0,1803,13,147],"class":"crack"},
    {"bbox":[0,1943,9,146],"class":"crack"},
    {"bbox":[0,2081,10,146],"class":"crack"},
    {"bbox":[98,2388,30,36],"class":"black knot"},
    {"bbox":[34,3221,23,22],"class":"black knot"},
    {"bbox":[43,3413,6,7],"class":"wormhole"},
    {"bbox":[57,3493,6,10],"class":"wormhole"},
    {"bbox":[91,3536,37,25],"class":"black knot"}
      ],
      "left": []
    }
  },
  {
    "woodId": "WOOD-DEMO-004",
    "length": 1792.8,
    "width": 62.8,
    "height": 17.5,
    "imgwidth":3735,
    "imgheight":135,
    "defectDetails": {
      "top": [
       {"bbox":[60,114,28,28],"class":"black knot"},
    {"bbox":[85,232,35,39],"class":"black knot"},
    {"bbox":[84,674,42,19],"class":"black knot"},
    {"bbox":[88,684,39,33],"class":"black knot"},
    {"bbox":[1,821,13,145],"class":"crack"},
    {"bbox":[0,958,13,146],"class":"crack"},
    {"bbox":[118,958,23,28],"class":"black knot"},
    {"bbox":[0,958,10,145],"class":"crack"},
    {"bbox":[91,1190,24,25],"class":"black knot"},
    {"bbox":[1,1231,12,145],"class":"crack"},
    {"bbox":[1,1368,12,145],"class":"crack"},
    {"bbox":[134,1368,10,144],"class":"crack"},
    {"bbox":[0,1642,24,145],"class":"crack"},
    {"bbox":[1,1779,12,145],"class":"crack"},
    {"bbox":[1,1916,12,145],"class":"crack"},
    {"bbox":[0,1916,10,145],"class":"crack"},
    {"bbox":[1,2053,13,146],"class":"crack"},
    {"bbox":[1,2190,13,145],"class":"crack"},
    {"bbox":[0,2190,11,145],"class":"crack"},
    {"bbox":[132,2190,13,143],"class":"crack"},
    {"bbox":[1,2326,14,145],"class":"crack"},
    {"bbox":[0,2326,11,145],"class":"crack"},
    {"bbox":[134,2326,10,143],"class":"crack"},
    {"bbox":[0,2463,18,145],"class":"crack"},
    {"bbox":[0,2601,12,145],"class":"crack"},
    {"bbox":[94,2675,30,30],"class":"black knot"},
    {"bbox":[71,2825,16,17],"class":"black knot"},
    {"bbox":[69,3050,43,43],"class":"black knot"},
    {"bbox":[0,3148,15,145],"class":"crack"},
    {"bbox":[0,3148,11,145],"class":"crack"},
    {"bbox":[113,3148,32,143],"class":"crack"},
    {"bbox":[0,3285,17,145],"class":"crack"},
    {"bbox":[0,3285,14,145],"class":"crack"},
    {"bbox":[132,3285,12,144],"class":"crack"},
    {"bbox":[0,3421,15,146],"class":"crack"},
    {"bbox":[131,3421,13,143],"class":"crack"},
    {"bbox":[0,3421,11,146],"class":"crack"},
    {"bbox":[123,3421,22,145],"class":"crack"},
    {"bbox":[0,3558,15,145],"class":"crack"},
    {"bbox":[0,3558,11,145],"class":"crack"},
    {"bbox":[136,3558,9,142],"class":"crack"}
      ],
      "right": [],
      "bottom": [
    {"bbox":[43,96,21,22],"class":"black knot"},
    {"bbox":[70,209,29,29],"class":"black knot"},
    {"bbox":[81,654,31,39],"class":"black knot"},
    {"bbox":[119,968,12,12],"class":"black knot"},
    {"bbox":[84,1200,13,11],"class":"black knot"},
    {"bbox":[97,2677,20,19],"class":"black knot"},
    {"bbox":[63,3042,39,26],"class":"resin"},
    {"bbox":[63,3042,40,26],"class":"black knot"},
    {"bbox":[0,3442,17,136],"class":"crack"},
    {"bbox":[0,3697,14,36],"class":"crack"}
      ],
      "left": []
    }
  },
  {
    "woodId": "WOOD-DEMO-005",
    "length": 1793.28,
    "width": 62.8,
    "height": 18.5,
    "imgwidth":3736,
    "imgheight":135,
    "defectDetails": {
      "top": [
     {"bbox":[11,141,25,37],"class":"black knot"},
    {"bbox":[134,469,8,20],"class":"black knot"},
    {"bbox":[78,637,43,39],"class":"black knot"},
    {"bbox":[73,670,48,11],"class":"black knot"},
    {"bbox":[80,903,13,12],"class":"wormhole"},
    {"bbox":[98,1034,24,25],"class":"black knot"},
    {"bbox":[127,1828,15,33],"class":"black knot"},
    {"bbox":[0,1743,13,142],"class":"crack"},
    {"bbox":[0,1876,12,142],"class":"crack"},
    {"bbox":[0,1876,9,142],"class":"crack"},
    {"bbox":[0,2010,15,141],"class":"crack"},
    {"bbox":[28,2047,23,21],"class":"black knot"},
    {"bbox":[0,2145,19,142],"class":"crack"},
    {"bbox":[113,2145,29,141],"class":"crack"},
    {"bbox":[124,2145,17,140],"class":"crack"},
    {"bbox":[0,2279,15,142],"class":"crack"},
    {"bbox":[0,2279,12,142],"class":"crack"},
    {"bbox":[0,2413,11,141],"class":"crack"},
    {"bbox":[92,2526,23,23],"class":"black knot"},
    {"bbox":[117,2413,25,141],"class":"crack"},
    {"bbox":[110,2755,19,19],"class":"black knot"},
    {"bbox":[17,2722,21,15],"class":"black knot"},
    {"bbox":[81,3009,38,29],"class":"black knot"},
    {"bbox":[71,3225,10,10],"class":"wormhole"},
    {"bbox":[94,3430,34,28],"class":"black knot"},
    {"bbox":[93,3705,35,28],"class":"black knot"}
      ],
      "right": [],
      "bottom": [
    {"bbox":[14,138,53,36],"class":"black knot"},
    {"bbox":[113,474,15,14],"class":"black knot"},
    {"bbox":[75,634,58,38],"class":"black knot"},
    {"bbox":[78,769,13,13],"class":"black knot"},
    {"bbox":[7,1835,20,15],"class":"black knot"},
    {"bbox":[55,2051,16,16],"class":"black knot"},
    {"bbox":[95,2526,16,13],"class":"black knot"},
    {"bbox":[96,2531,14,11],"class":"black knot"},
    {"bbox":[50,2712,21,18],"class":"black knot"},
    {"bbox":[79,3007,31,27],"class":"black knot"}
      ],
      "left": []
    }
  },
  {
    "woodId": "WOOD-DEMO-006",
    "length": 1794.72,
    "width": 62.8,
    "height": 18.4,
    "imgwidth":3739,
    "imgheight":135,
    "defectDetails": {
      "top": [
      {"bbox":[20,268,33,23],"class":"black knot"},
    {"bbox":[92,587,24,25],"class":"black knot"},
    {"bbox":[131,1207,11,139],"class":"crack"},
    {"bbox":[132,1341,9,141],"class":"crack"},
    {"bbox":[130,1474,11,142],"class":"crack"},
    {"bbox":[15,1725,42,26],"class":"black knot"},
    {"bbox":[131,1608,11,140],"class":"crack"},
    {"bbox":[124,1609,17,142],"class":"crack"},
    {"bbox":[0,1742,13,142],"class":"crack"},
    {"bbox":[9,1742,48,16],"class":"black knot"},
    {"bbox":[122,1743,20,142],"class":"crack"},
    {"bbox":[0,1742,10,142],"class":"crack"},
    {"bbox":[0,1876,16,142],"class":"crack"},
    {"bbox":[0,1876,12,142],"class":"crack"},
    {"bbox":[0,2010,17,143],"class":"crack"},
    {"bbox":[0,2010,12,143],"class":"crack"},
    {"bbox":[0,2145,12,141],"class":"crack"},
    {"bbox":[0,2145,15,136],"class":"crack"},
    {"bbox":[109,2765,24,34],"class":"black knot"},
    {"bbox":[0,3217,15,142],"class":"crack"},
    {"bbox":[0,3217,12,142],"class":"crack"},
    {"bbox":[0,3351,15,143],"class":"crack"},
    {"bbox":[0,3351,12,143],"class":"crack"},
    {"bbox":[0,3486,13,140],"class":"crack"},
    {"bbox":[0,3485,9,142],"class":"crack"},
    {"bbox":[29,3663,18,67],"class":"resin"},
    {"bbox":[0,3619,10,117],"class":"crack"},
    {"bbox":[0,3619,13,118],"class":"crack"},
    {"bbox":[27,3662,19,68],"class":"crack"}
      ],
      "right": [],
      "bottom": [
   {"bbox":[0,2244,6,132],"class":"crack"},
    {"bbox":[3,2867,18,77],"class":"crack"},
    {"bbox":[20,3286,19,87],"class":"crack"},
    {"bbox":[17,3366,20,29],"class":"crack"}
      ],
      "left": []
    }
  },
  {
    "woodId": "WOOD-DEMO-007",
    "length": 1797.12,
    "width": 62.8,
    "height": 18.4,
    "imgwidth":3744,
    "imgheight":135,
    "defectDetails": {
      "top": [
        {"bbox":[122,133,17,30],"class":"black knot"},
    {"bbox":[127,143,12,17],"class":"black knot"},
    {"bbox":[0,918,13,139],"class":"crack"},
    {"bbox":[0,1050,12,140],"class":"crack"},
    {"bbox":[0,1181,17,139],"class":"crack"},
    {"bbox":[0,1181,14,139],"class":"crack"},
    {"bbox":[129,1181,9,138],"class":"crack"},
    {"bbox":[0,1312,13,139],"class":"crack"},
    {"bbox":[129,1312,9,138],"class":"crack"},
    {"bbox":[0,1312,10,139],"class":"crack"},
    {"bbox":[0,1443,14,139],"class":"crack"},
    {"bbox":[0,1443,11,139],"class":"crack"},
    {"bbox":[131,1444,8,137],"class":"crack"},
    {"bbox":[0,1575,14,139],"class":"crack"},
    {"bbox":[0,1575,11,139],"class":"crack"},
    {"bbox":[129,1575,9,137],"class":"crack"},
    {"bbox":[0,1706,15,139],"class":"crack"},
    {"bbox":[0,1706,12,139],"class":"crack"},
    {"bbox":[129,1706,10,138],"class":"crack"},
    {"bbox":[0,1837,17,138],"class":"crack"},
    {"bbox":[129,1837,9,138],"class":"crack"},
    {"bbox":[0,1968,18,139],"class":"crack"},
    {"bbox":[0,1968,14,139],"class":"crack"},
    {"bbox":[0,2100,17,139],"class":"crack"},
    {"bbox":[0,2100,13,139],"class":"crack"},
    {"bbox":[0,2231,17,138],"class":"crack"},
    {"bbox":[0,2231,11,140],"class":"crack"},
    {"bbox":[0,2362,12,138],"class":"crack"},
    {"bbox":[0,3555,8,128],"class":"crack"},
    {"bbox":[0,3544,11,138],"class":"crack"},
    {"bbox":[0,3675,10,68],"class":"crack"}
      ],
      "right": [],
      "bottom": [
  {"bbox":[98,146,15,14],"class":"black knot"},
    {"bbox":[0,3684,9,56],"class":"crack"}
      ],
      "left": []
    }
  },
  {
    "woodId": "WOOD-DEMO-008",
    "length": 1798.08,
    "width": 62.8,
    "height": 18.4,
    "imgwidth":3746,
    "imgheight":135,
    "defectDetails": {
      "top": [
   {"bbox":[121,775,15,16],"class":"black knot"},
    {"bbox":[120,774,17,21],"class":"black knot"},
    {"bbox":[0,1876,15,143],"class":"crack"},
    {"bbox":[0,1876,12,142],"class":"crack"},
    {"bbox":[0,2011,11,141],"class":"crack"},
    {"bbox":[1,3313,24,32],"class":"black knot"},
    {"bbox":[121,3315,6,8],"class":"wormhole"}
      ],
      "right": [],
      "bottom": [
   {"bbox":[122,17,13,34],"class":"black knot"},
    {"bbox":[30,421,34,32],"class":"black knot"},
    {"bbox":[101,779,11,13],"class":"black knot"},
    {"bbox":[66,1275,33,25],"class":"black knot"},
    {"bbox":[91,2076,20,20],"class":"black knot"},
    {"bbox":[0,2167,8,134],"class":"crack"},
    {"bbox":[46,3400,17,15],"class":"black knot"}
      ],
      "left": []
    }
  },
  {
    "woodId": "WOOD-DEMO-009",
    "length": 1794.24,
    "width": 62.8,
    "height": 18.4,
    "imgwidth":3738,
    "imgheight":135,
    "defectDetails": {
      "top": [
    {"bbox":[97,263,22,15],"class":"black knot"},
    {"bbox":[63,384,12,12],"class":"wormhole"},
    {"bbox":[98,270,20,14],"class":"black knot"},
    {"bbox":[102,563,31,33],"class":"black knot"},
    {"bbox":[83,1014,12,14],"class":"wormhole"},
    {"bbox":[83,1015,10,12],"class":"wormhole"},
    {"bbox":[133,1080,9,141],"class":"crack"},
    {"bbox":[71,1310,31,34],"class":"black knot"},
    {"bbox":[133,1215,9,140],"class":"crack"},
    {"bbox":[131,1350,11,140],"class":"crack"},
    {"bbox":[62,1536,40,25],"class":"black knot"},
    {"bbox":[0,1620,14,143],"class":"crack"},
    {"bbox":[0,1620,11,143],"class":"crack"},
    {"bbox":[0,1755,15,143],"class":"crack"},
    {"bbox":[0,1890,15,143],"class":"crack"},
    {"bbox":[0,2025,11,142],"class":"crack"},
    {"bbox":[76,2044,38,36],"class":"black knot"},
    {"bbox":[76,2032,39,51],"class":"black knot"},
    {"bbox":[34,2814,17,16],"class":"black knot"},
    {"bbox":[115,3417,17,28],"class":"black knot"}
      ],
      "right": [],
      "bottom": [
   {"bbox":[91,266,15,18],"class":"black knot"},
    {"bbox":[99,546,20,23],"class":"black knot"},
    {"bbox":[57,1302,19,22],"class":"black knot"},
    {"bbox":[19,1515,47,42],"class":"black knot"},
    {"bbox":[118,1828,9,10],"class":"wormhole"},
    {"bbox":[94,3409,22,25],"class":"black knot"},
    {"bbox":[107,3699,18,24],"class":"black knot"}
      ],
      "left": []
    }
  },
  {
    "woodId": "WOOD-DEMO-010",
    "length": 1794.24,
    "width": 62.8,
    "height": 18.4,
    "imgwidth":3738,
    "imgheight":135,
    "defectDetails": {
      "top": [
      {"bbox":[117,206,29,50],"class":"black knot"},
    {"bbox":[141,427,10,150],"class":"crack"},
    {"bbox":[139,570,11,150],"class":"crack"},
    {"bbox":[126,855,25,149],"class":"crack"},
    {"bbox":[127,997,23,152],"class":"crack"},
    {"bbox":[1,1710,14,151],"class":"crack"},
    {"bbox":[49,1916,26,27],"class":"black knot"},
    {"bbox":[1,1852,13,152],"class":"crack"},
    {"bbox":[1,1995,15,151],"class":"crack"},
    {"bbox":[0,1995,13,151],"class":"crack"},
    {"bbox":[0,2137,15,151],"class":"crack"},
    {"bbox":[0,2137,12,151],"class":"crack"},
    {"bbox":[0,2280,18,151],"class":"crack"},
    {"bbox":[0,2422,18,151],"class":"crack"},
    {"bbox":[103,2480,16,15],"class":"black knot"},
    {"bbox":[0,2423,14,150],"class":"crack"},
    {"bbox":[0,2565,13,150],"class":"crack"},
    {"bbox":[112,2628,28,41],"class":"black knot"},
    {"bbox":[0,2579,10,137],"class":"crack"},
    {"bbox":[0,2707,8,150],"class":"crack"},
    {"bbox":[83,2949,35,32],"class":"black knot"},
    {"bbox":[0,3135,17,151],"class":"crack"},
    {"bbox":[0,3135,13,151],"class":"crack"},
    {"bbox":[127,3420,24,152],"class":"crack"},
    {"bbox":[139,3562,11,150],"class":"crack"},
    {"bbox":[130,3705,21,32],"class":"crack"}
      ],
      "right": [],
      "bottom": [
     {"bbox":[117,222,12,10],"class":"black knot"},
    {"bbox":[28,1920,19,20],"class":"black knot"},
    {"bbox":[87,2483,11,12],"class":"black knot"},
    {"bbox":[72,2937,33,36],"class":"black knot"}
      ],
      "left": []
    }
  }
];

