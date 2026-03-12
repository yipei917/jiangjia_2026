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
    "length": 2402.4,
    "width": 123.84,
    "height": 44.16,
    "imglength": 5005,
    "imgwidth": 258,
    "imgheight": 92,
    "defectDetails": {
      "top": [
        {"bbox":[85,1209,44,35],"class":"black knot"},
        {"bbox":[122,2624,48,27],"class":"resin"},
        {"bbox":[59,2591,38,27],"class":"resin"}
      ],
      "right": [
        {"bbox":[85,0,6,90],"class":"crack"},
        {"bbox":[0,1725,12,92],"class":"crack"},
        {"bbox":[0,1725,4,91],"class":"crack"},
        {"bbox":[86,2501,5,91],"class":"crack"},
        {"bbox":[64,2675,12,12],"class":"black knot"},
        {"bbox":[13,2862,28,29],"class":"black knot"},
        {"bbox":[0,3536,4,91],"class":"crack"},
        {"bbox":[0,3622,4,91],"class":"crack"},
        {"bbox":[50,3751,11,12],"class":"black knot"},
        {"bbox":[0,3709,4,91],"class":"crack"},
        {"bbox":[54,4527,25,48],"class":"black knot"},
        {"bbox":[0,4643,12,19],"class":"resin"},
        {"bbox":[57,4571,28,6],"class":"black knot"},
        {"bbox":[0,4657,4,23],"class":"resin"},
        {"bbox":[86,4657,5,91],"class":"crack"}
      ],
      "bottom": [
        {"bbox":[166,187,44,35],"class":"black knot"},
        {"bbox":[169,209,41,30],"class":"black knot"},
        {"bbox":[0,419,15,221],"class":"crack"},
        {"bbox":[1,418,18,223],"class":"crack"},
        {"bbox":[0,627,17,222],"class":"crack"},
        {"bbox":[0,837,16,222],"class":"crack"},
        {"bbox":[0,1045,13,222],"class":"crack"},
        {"bbox":[32,1254,49,50],"class":"black knot"},
        {"bbox":[0,1254,12,222],"class":"crack"},
        {"bbox":[0,1464,14,221],"class":"crack"},
        {"bbox":[54,1646,11,14],"class":"wormhole"},
        {"bbox":[1,1463,18,221],"class":"crack"},
        {"bbox":[137,1672,31,221],"class":"crack"},
        {"bbox":[0,1673,15,220],"class":"crack"},
        {"bbox":[119,1881,41,221],"class":"crack"},
        {"bbox":[1,2035,21,24],"class":"black knot"},
        {"bbox":[0,1882,13,221],"class":"crack"},
        {"bbox":[81,2090,70,143],"class":"black knot"},
        {"bbox":[0,2090,16,222],"class":"crack"},
        {"bbox":[1,2090,19,222],"class":"crack"},
        {"bbox":[88,2300,41,221],"class":"crack"},
        {"bbox":[0,2299,15,221],"class":"crack"},
        {"bbox":[1,2299,18,222],"class":"crack"},
        {"bbox":[71,2508,47,222],"class":"crack"},
        {"bbox":[0,2509,19,221],"class":"crack"},
        {"bbox":[61,2717,44,221],"class":"crack"},
        {"bbox":[156,2832,45,48],"class":"black knot"},
        {"bbox":[0,2718,17,221],"class":"crack"},
        {"bbox":[58,2927,30,94],"class":"crack"},
        {"bbox":[0,2927,13,221],"class":"crack"},
        {"bbox":[102,3382,53,67],"class":"black knot"},
        {"bbox":[0,3345,14,222],"class":"crack"},
        {"bbox":[0,3554,17,222],"class":"crack"},
        {"bbox":[1,3554,19,223],"class":"crack"},
        {"bbox":[61,3885,57,67],"class":"black knot"},
        {"bbox":[0,3763,17,215],"class":"crack"},
        {"bbox":[84,4390,17,14],"class":"black knot"},
        {"bbox":[86,4391,16,17],"class":"black knot"},
        {"bbox":[146,4979,27,16],"class":"black knot"}
      ],
      "left": [
        {"bbox":[0,322,4,85],"class":"crack"},
        {"bbox":[0,322,7,85],"class":"crack"},
        {"bbox":[0,403,4,85],"class":"crack"},
        {"bbox":[0,484,5,85],"class":"crack"},
        {"bbox":[0,564,5,85],"class":"crack"},
        {"bbox":[0,645,5,85],"class":"crack"},
        {"bbox":[0,886,5,84],"class":"crack"},
        {"bbox":[0,886,7,84],"class":"crack"},
        {"bbox":[0,967,5,85],"class":"crack"},
        {"bbox":[54,1092,13,12],"class":"black knot"},
        {"bbox":[0,1048,8,86],"class":"crack"},
        {"bbox":[0,1048,6,85],"class":"crack"},
        {"bbox":[0,1129,6,85],"class":"crack"},
        {"bbox":[0,1128,9,85],"class":"crack"},
        {"bbox":[0,1209,9,85],"class":"crack"},
        {"bbox":[0,1209,6,85],"class":"crack"},
        {"bbox":[0,1290,4,85],"class":"crack"},
        {"bbox":[0,1290,7,86],"class":"crack"},
        {"bbox":[0,1451,5,85],"class":"crack"},
        {"bbox":[0,1451,8,85],"class":"crack"},
        {"bbox":[0,1935,4,85],"class":"crack"},
        {"bbox":[0,2016,4,85],"class":"crack"},
        {"bbox":[0,2176,3,85],"class":"crack"},
        {"bbox":[0,2338,4,85],"class":"crack"},
        {"bbox":[0,2418,4,85],"class":"crack"},
        {"bbox":[0,2499,4,85],"class":"crack"},
        {"bbox":[0,2580,4,85],"class":"crack"},
        {"bbox":[0,2822,4,85],"class":"crack"},
        {"bbox":[0,2983,4,85],"class":"crack"},
        {"bbox":[49,3314,12,12],"class":"black knot"},
        {"bbox":[0,4273,4,85],"class":"crack"},
        {"bbox":[0,4434,4,85],"class":"crack"},
        {"bbox":[0,4515,10,86],"class":"crack"},
        {"bbox":[0,4515,6,86],"class":"crack"},
        {"bbox":[0,4595,4,85],"class":"crack"},
        {"bbox":[0,4595,7,85],"class":"crack"}
      ]
    }
  },
  {
    "woodId": "WOOD-DEMO-002",
    "length": 1546.56,
    "width": 124.32,
    "height": 44.64,
    "imglength": 3222,
    "imgwidth": 259,
    "imgheight": 93,
    "defectDetails": {
      "top": [
        {"bbox":[217,593,27,54],"class":"black knot"},
        {"bbox":[1,485,20,258],"class":"crack"},
        {"bbox":[0,728,15,258],"class":"crack"},
        {"bbox":[2,728,20,258],"class":"crack"},
        {"bbox":[0,972,13,257],"class":"crack"},
        {"bbox":[115,1666,75,48],"class":"black knot"},
        {"bbox":[120,1699,65,25],"class":"black knot"},
        {"bbox":[0,1701,19,257],"class":"crack"},
        {"bbox":[1,1699,23,258],"class":"crack"},
        {"bbox":[115,1699,74,32],"class":"black knot"},
        {"bbox":[0,1942,16,258],"class":"crack"},
        {"bbox":[2,1942,19,258],"class":"crack"},
        {"bbox":[109,2553,53,23],"class":"resin"},
        {"bbox":[0,2430,14,257],"class":"crack"},
        {"bbox":[57,2761,62,11],"class":"crack"}
      ],
      "right": [
        {"bbox":[0,0,6,92],"class":"crack"},
        {"bbox":[0,0,8,92],"class":"crack"},
        {"bbox":[64,183,11,9],"class":"black knot"},
        {"bbox":[48,440,9,7],"class":"black knot"},
        {"bbox":[0,610,5,92],"class":"crack"},
        {"bbox":[0,872,7,92],"class":"crack"},
        {"bbox":[0,871,9,92],"class":"crack"},
        {"bbox":[0,1046,8,93],"class":"crack"},
        {"bbox":[0,1046,6,93],"class":"crack"},
        {"bbox":[0,1133,7,92],"class":"crack"},
        {"bbox":[0,1133,9,92],"class":"crack"},
        {"bbox":[0,1221,6,92],"class":"crack"},
        {"bbox":[0,1220,8,93],"class":"crack"},
        {"bbox":[0,1307,5,92],"class":"crack"},
        {"bbox":[0,1307,8,93],"class":"crack"},
        {"bbox":[0,1395,6,93],"class":"crack"},
        {"bbox":[0,1395,8,93],"class":"crack"},
        {"bbox":[0,1482,6,92],"class":"crack"},
        {"bbox":[0,1482,8,93],"class":"crack"},
        {"bbox":[0,1569,5,92],"class":"crack"},
        {"bbox":[42,1744,8,20],"class":"resin"},
        {"bbox":[0,2964,5,92],"class":"crack"},
        {"bbox":[0,3051,8,38],"class":"crack"}
      ],
      "bottom": [
        {"bbox":[162,0,14,222],"class":"crack"},
        {"bbox":[171,588,42,55],"class":"black knot"},
        {"bbox":[100,1666,64,27],"class":"black knot"},
        {"bbox":[0,1470,13,223],"class":"crack"},
        {"bbox":[104,1671,55,22],"class":"black knot"},
        {"bbox":[108,1680,63,58],"class":"black knot"},
        {"bbox":[22,2897,33,29],"class":"black knot"},
        {"bbox":[90,3146,26,17],"class":"black knot"},
        {"bbox":[93,3150,23,18],"class":"black knot"}
      ],
      "left": [
        {"bbox":[43,795,8,10],"class":"black knot"},
        {"bbox":[0,1612,6,85],"class":"crack"},
        {"bbox":[0,1935,5,86],"class":"crack"},
        {"bbox":[0,2338,5,85],"class":"crack"},
        {"bbox":[0,2418,8,86],"class":"crack"},
        {"bbox":[0,2983,6,85],"class":"crack"},
        {"bbox":[0,3063,5,11],"class":"resin"},
        {"bbox":[80,3063,5,11],"class":"resin"}
      ]
    }
  },
  {
    "woodId": "WOOD-DEMO-003",
    "length": 1972.32,
    "width": 118.56,
    "height": 40.8,
    "imglength": 4109,
    "imgwidth": 247,
    "imgheight": 85,
    "defectDetails": {
      "top": [
        {"bbox":[0,364,11,54],"class":"resin"},
        {"bbox":[0,1577,146,58],"class":"resin"},
        {"bbox":[0,1583,52,51],"class":"resin"},
        {"bbox":[117,1699,49,30],"class":"resin"},
        {"bbox":[0,2315,13,246],"class":"crack"},
        {"bbox":[1,3241,23,247],"class":"crack"},
        {"bbox":[0,3242,19,245],"class":"crack"}
      ],
      "right": [
        {"bbox":[31,332,46,62],"class":"black knot"},
        {"bbox":[52,727,11,14],"class":"wormhole"},
        {"bbox":[135,806,31,214],"class":"crack"},
        {"bbox":[117,1008,36,213],"class":"crack"},
        {"bbox":[0,1114,21,25],"class":"black knot"},
        {"bbox":[78,1209,71,101],"class":"black knot"},
        {"bbox":[0,1209,11,215],"class":"crack"},
        {"bbox":[85,1215,65,208],"class":"crack"},
        {"bbox":[87,1410,39,214],"class":"crack"},
        {"bbox":[71,1612,43,214],"class":"crack"},
        {"bbox":[0,1613,14,213],"class":"crack"},
        {"bbox":[1,1612,16,214],"class":"crack"},
        {"bbox":[63,1814,40,214],"class":"crack"},
        {"bbox":[156,1914,41,46],"class":"black knot"},
        {"bbox":[56,2015,29,87],"class":"crack"},
        {"bbox":[99,2476,54,68],"class":"black knot"},
        {"bbox":[0,2419,10,214],"class":"crack"},
        {"bbox":[0,2621,17,213],"class":"crack"},
        {"bbox":[0,2822,17,213],"class":"crack"},
        {"bbox":[0,3024,17,213],"class":"crack"},
        {"bbox":[1,3023,22,214],"class":"crack"},
        {"bbox":[59,3023,61,22],"class":"black knot"},
        {"bbox":[0,3225,15,214],"class":"crack"},
        {"bbox":[83,3484,18,19],"class":"black knot"},
        {"bbox":[144,4086,26,18],"class":"black knot"}
      ],
      "bottom": [
        {"bbox":[86,1725,5,89],"class":"crack"},
        {"bbox":[65,1881,10,10],"class":"black knot"},
        {"bbox":[13,2070,29,26],"class":"black knot"},
        {"bbox":[16,2594,26,30],"class":"black knot"},
        {"bbox":[50,2971,11,11],"class":"black knot"},
        {"bbox":[85,3536,5,90],"class":"crack"},
        {"bbox":[54,3748,30,51],"class":"black knot"},
        {"bbox":[59,3720,8,8],"class":"black knot"},
        {"bbox":[0,3864,13,22],"class":"resin"},
        {"bbox":[0,3881,3,20],"class":"resin"}
      ],
      "left": [
        {"bbox":[53,299,13,12],"class":"black knot"},
        {"bbox":[0,318,8,84],"class":"crack"},
        {"bbox":[0,319,6,84],"class":"crack"},
        {"bbox":[0,478,5,83],"class":"crack"},
        {"bbox":[0,637,5,84],"class":"crack"},
        {"bbox":[0,637,7,85],"class":"crack"},
        {"bbox":[0,1992,4,84],"class":"crack"},
        {"bbox":[49,2547,11,7],"class":"black knot"},
        {"bbox":[48,2550,13,9],"class":"black knot"},
        {"bbox":[21,2938,5,7],"class":"black knot"},
        {"bbox":[0,3426,5,84],"class":"crack"}
      ]
    }
  },
  {
    "woodId": "WOOD-DEMO-004",
    "length": 1742.4,
    "width": 127.2,
    "height": 41.28,
    "imglength": 3630,
    "imgwidth": 265,
    "imgheight": 86,
    "defectDetails": {
      "top": [
        {"bbox":[182,427,61,65],"class":"black knot"},
        {"bbox":[95,1704,32,36],"class":"black knot"},
        {"bbox":[94,1695,36,47],"class":"black knot"},
        {"bbox":[52,2159,61,62],"class":"black knot"},
        {"bbox":[66,2187,36,28],"class":"black knot"},
        {"bbox":[85,3246,63,84],"class":"black knot"}
      ],
      "right": [
        {"bbox":[101,708,16,32],"class":"resin"},
        {"bbox":[0,645,18,227],"class":"crack"},
        {"bbox":[85,1252,13,20],"class":"wormhole"},
        {"bbox":[170,1361,38,38],"class":"black knot"},
        {"bbox":[0,1288,21,226],"class":"crack"},
        {"bbox":[52,1679,63,52],"class":"black knot"},
        {"bbox":[22,1579,20,19],"class":"black knot"},
        {"bbox":[0,1503,13,226],"class":"crack"},
        {"bbox":[77,1717,28,22],"class":"black knot"},
        {"bbox":[141,1969,16,26],"class":"wormhole"},
        {"bbox":[38,2165,60,59],"class":"black knot"},
        {"bbox":[30,2707,16,19],"class":"wormhole"},
        {"bbox":[29,2706,21,22],"class":"wormhole"},
        {"bbox":[138,2859,24,26],"class":"black knot"},
        {"bbox":[114,2986,29,30],"class":"black knot"},
        {"bbox":[111,3005,35,12],"class":"black knot"},
        {"bbox":[70,3256,50,58],"class":"black knot"},
        {"bbox":[86,3590,11,18],"class":"wormhole"}
      ],
      "bottom": [
        {"bbox":[0,0,9,90],"class":"crack"},
        {"bbox":[0,0,7,90],"class":"crack"},
        {"bbox":[84,0,6,90],"class":"crack"},
        {"bbox":[79,85,11,91],"class":"crack"},
        {"bbox":[84,255,5,90],"class":"crack"},
        {"bbox":[0,347,6,85],"class":"crack"},
        {"bbox":[0,426,7,90],"class":"crack"},
        {"bbox":[83,426,6,90],"class":"crack"},
        {"bbox":[0,511,8,90],"class":"crack"},
        {"bbox":[0,511,7,90],"class":"crack"},
        {"bbox":[0,597,8,90],"class":"crack"},
        {"bbox":[0,597,7,90],"class":"crack"},
        {"bbox":[0,767,8,90],"class":"crack"},
        {"bbox":[0,768,6,90],"class":"crack"},
        {"bbox":[0,1279,8,89],"class":"crack"},
        {"bbox":[83,1365,7,90],"class":"crack"},
        {"bbox":[0,1450,8,89],"class":"crack"},
        {"bbox":[0,1450,7,90],"class":"crack"},
        {"bbox":[0,1620,8,90],"class":"crack"},
        {"bbox":[0,1620,7,90],"class":"crack"},
        {"bbox":[0,1706,8,90],"class":"crack"},
        {"bbox":[0,1706,7,90],"class":"crack"},
        {"bbox":[0,1791,8,91],"class":"crack"},
        {"bbox":[0,1791,7,91],"class":"crack"},
        {"bbox":[0,1876,7,90],"class":"crack"},
        {"bbox":[0,2303,8,90],"class":"crack"},
        {"bbox":[0,2303,6,90],"class":"crack"},
        {"bbox":[0,2474,5,90],"class":"crack"},
        {"bbox":[0,2730,5,90],"class":"crack"},
        {"bbox":[0,2815,6,90],"class":"crack"},
        {"bbox":[0,2815,8,90],"class":"crack"},
        {"bbox":[83,2815,6,90],"class":"crack"},
        {"bbox":[0,2900,8,91],"class":"crack"},
        {"bbox":[0,2901,7,90],"class":"crack"},
        {"bbox":[0,2985,8,91],"class":"crack"},
        {"bbox":[0,2985,6,91],"class":"crack"},
        {"bbox":[0,3071,7,90],"class":"crack"},
        {"bbox":[0,3241,8,91],"class":"crack"},
        {"bbox":[0,3327,9,90],"class":"crack"},
        {"bbox":[0,3412,9,91],"class":"crack"},
        {"bbox":[0,3412,7,90],"class":"crack"}
      ],
      "left": [
        {"bbox":[0,0,4,84],"class":"crack"},
        {"bbox":[0,81,6,85],"class":"crack"},
        {"bbox":[0,80,10,85],"class":"crack"},
        {"bbox":[0,161,5,85],"class":"crack"},
        {"bbox":[0,403,7,85],"class":"crack"},
        {"bbox":[0,403,9,85],"class":"crack"},
        {"bbox":[0,806,4,85],"class":"crack"},
        {"bbox":[30,1170,5,8],"class":"wormhole"},
        {"bbox":[0,1290,5,84],"class":"crack"},
        {"bbox":[0,1290,7,85],"class":"crack"},
        {"bbox":[0,1451,4,85],"class":"crack"},
        {"bbox":[0,2580,6,85],"class":"crack"}
      ]
    }
  },
  {
    "woodId": "WOOD-DEMO-005",
    "length": 2340.96,
    "width": 124.32,
    "height": 44.64,
    "imglength": 4877,
    "imgwidth": 259,
    "imgheight": 86,
    "defectDetails": {
      "top": [
        {"bbox":[170,598,17,22],"class":"wormhole"},
        {"bbox":[0,486,21,257],"class":"crack"},
        {"bbox":[156,1013,14,18],"class":"wormhole"},
        {"bbox":[154,1011,19,24],"class":"wormhole"},
        {"bbox":[0,972,17,258],"class":"crack"},
        {"bbox":[212,1405,13,16],"class":"wormhole"},
        {"bbox":[126,1410,20,24],"class":"wormhole"},
        {"bbox":[0,1942,16,259],"class":"crack"},
        {"bbox":[218,2266,17,21],"class":"wormhole"},
        {"bbox":[49,2577,127,72],"class":"resin"},
        {"bbox":[213,2671,14,15],"class":"wormhole"},
        {"bbox":[0,2430,14,257],"class":"crack"},
        {"bbox":[162,2888,59,40],"class":"black knot"},
        {"bbox":[214,2671,14,18],"class":"wormhole"},
        {"bbox":[213,2813,19,20],"class":"wormhole"},
        {"bbox":[210,2810,25,26],"class":"black knot"},
        {"bbox":[214,2671,18,22],"class":"wormhole"},
        {"bbox":[131,2913,93,28],"class":"black knot"},
        {"bbox":[157,3104,16,18],"class":"wormhole"},
        {"bbox":[156,3103,19,23],"class":"wormhole"},
        {"bbox":[151,2913,69,25],"class":"black knot"},
        {"bbox":[0,3157,16,257],"class":"crack"},
        {"bbox":[1,3156,21,258],"class":"crack"},
        {"bbox":[102,3554,12,17],"class":"wormhole"},
        {"bbox":[100,3553,15,20],"class":"wormhole"},
        {"bbox":[177,3809,20,23],"class":"wormhole"},
        {"bbox":[180,3811,16,19],"class":"wormhole"},
        {"bbox":[177,3744,14,20],"class":"wormhole"},
        {"bbox":[174,3742,21,25],"class":"wormhole"},
        {"bbox":[1,3885,22,258],"class":"crack"},
        {"bbox":[0,3885,20,258],"class":"crack"},
        {"bbox":[181,4147,28,30],"class":"black knot"},
        {"bbox":[171,4411,60,68],"class":"black knot"},
        {"bbox":[66,4830,11,15],"class":"wormhole"},
        {"bbox":[116,4627,14,18],"class":"wormhole"}
      ],
      "right": [
        {"bbox":[0,423,16,220],"class":"crack"},
        {"bbox":[0,630,15,223],"class":"crack"},
        {"bbox":[0,841,15,222],"class":"crack"},
        {"bbox":[0,1050,14,223],"class":"crack"},
        {"bbox":[0,1260,12,224],"class":"crack"},
        {"bbox":[0,1471,14,222],"class":"crack"},
        {"bbox":[0,1681,14,222],"class":"crack"},
        {"bbox":[0,1891,16,222],"class":"crack"},
        {"bbox":[0,2100,14,220],"class":"crack"},
        {"bbox":[0,2310,13,224],"class":"crack"},
        {"bbox":[0,2520,14,223],"class":"crack"},
        {"bbox":[125,2907,59,46],"class":"black knot"},
        {"bbox":[168,2815,20,24],"class":"black knot"},
        {"bbox":[0,2730,16,223],"class":"crack"},
        {"bbox":[1,2730,19,223],"class":"crack"},
        {"bbox":[112,2940,71,20],"class":"black knot"},
        {"bbox":[0,2941,15,222],"class":"crack"},
        {"bbox":[0,3151,16,222],"class":"crack"},
        {"bbox":[0,3360,14,224],"class":"crack"},
        {"bbox":[1,3360,18,224],"class":"crack"},
        {"bbox":[0,3570,13,221],"class":"crack"},
        {"bbox":[1,3570,19,221],"class":"crack"},
        {"bbox":[3,3766,34,27],"class":"black knot"},
        {"bbox":[6,3780,31,23],"class":"black knot"},
        {"bbox":[0,3780,12,223],"class":"crack"},
        {"bbox":[1,3990,21,223],"class":"crack"},
        {"bbox":[0,3990,18,223],"class":"crack"},
        {"bbox":[131,4438,48,52],"class":"black knot"},
        {"bbox":[36,4749,20,23],"class":"black knot"},
        {"bbox":[185,4830,38,43],"class":"crack"}
      ],
      "bottom": [
        {"bbox":[0,3400,6,92],"class":"crack"},
        {"bbox":[0,3836,5,92],"class":"crack"},
        {"bbox":[0,3923,5,92],"class":"crack"},
        {"bbox":[0,3923,7,92],"class":"crack"},
        {"bbox":[0,4098,5,92],"class":"crack"},
        {"bbox":[0,4185,5,92],"class":"crack"}
      ],
      "left": [
        {"bbox":[0,0,5,85],"class":"crack"},
        {"bbox":[0,0,7,85],"class":"crack"},
        {"bbox":[0,241,5,86],"class":"crack"},
        {"bbox":[0,241,6,86],"class":"crack"},
        {"bbox":[0,564,5,85],"class":"crack"},
        {"bbox":[0,564,7,86],"class":"crack"},
        {"bbox":[0,645,4,85],"class":"crack"},
        {"bbox":[0,726,5,85],"class":"crack"},
        {"bbox":[0,725,7,86],"class":"crack"},
        {"bbox":[0,806,6,85],"class":"crack"},
        {"bbox":[0,806,7,85],"class":"crack"},
        {"bbox":[0,886,5,85],"class":"crack"},
        {"bbox":[0,886,7,85],"class":"crack"},
        {"bbox":[0,967,6,85],"class":"crack"},
        {"bbox":[0,967,7,85],"class":"crack"},
        {"bbox":[0,1048,5,85],"class":"crack"},
        {"bbox":[0,1048,7,85],"class":"crack"},
        {"bbox":[0,1129,6,85],"class":"crack"},
        {"bbox":[0,1128,7,86],"class":"crack"},
        {"bbox":[0,1209,5,85],"class":"crack"},
        {"bbox":[0,1209,7,85],"class":"crack"},
        {"bbox":[0,1290,5,85],"class":"crack"},
        {"bbox":[0,1290,7,86],"class":"crack"},
        {"bbox":[57,1406,6,7],"class":"black knot"},
        {"bbox":[0,1371,5,85],"class":"crack"},
        {"bbox":[0,1370,7,86],"class":"crack"},
        {"bbox":[0,1451,5,85],"class":"crack"},
        {"bbox":[0,1451,7,86],"class":"crack"},
        {"bbox":[0,1531,4,85],"class":"crack"},
        {"bbox":[0,1612,4,85],"class":"crack"},
        {"bbox":[0,1693,5,85],"class":"crack"},
        {"bbox":[0,1693,7,86],"class":"crack"},
        {"bbox":[0,1774,5,85],"class":"crack"},
        {"bbox":[0,1773,7,86],"class":"crack"},
        {"bbox":[63,1858,8,7],"class":"black knot"},
        {"bbox":[0,1935,5,85],"class":"crack"},
        {"bbox":[0,1935,7,85],"class":"crack"},
        {"bbox":[0,2016,5,85],"class":"crack"},
        {"bbox":[0,2096,5,85],"class":"crack"},
        {"bbox":[0,2096,7,86],"class":"crack"},
        {"bbox":[0,2177,5,85],"class":"crack"},
        {"bbox":[0,2176,7,86],"class":"crack"},
        {"bbox":[0,2257,6,85],"class":"crack"},
        {"bbox":[0,2257,7,85],"class":"crack"},
        {"bbox":[61,2269,8,10],"class":"black knot"},
        {"bbox":[0,2338,5,85],"class":"crack"},
        {"bbox":[0,2338,7,85],"class":"crack"},
        {"bbox":[0,2419,5,85],"class":"crack"},
        {"bbox":[0,2499,5,85],"class":"crack"},
        {"bbox":[0,2580,5,85],"class":"crack"},
        {"bbox":[0,2660,5,85],"class":"crack"},
        {"bbox":[74,2674,6,6],"class":"wormhole"},
        {"bbox":[0,2741,5,85],"class":"crack"},
        {"bbox":[0,2741,7,85],"class":"crack"},
        {"bbox":[0,2822,5,85],"class":"crack"},
        {"bbox":[0,2821,7,86],"class":"crack"},
        {"bbox":[0,2902,5,85],"class":"crack"},
        {"bbox":[0,2983,5,85],"class":"crack"},
        {"bbox":[0,2983,7,85],"class":"crack"},
        {"bbox":[0,3064,5,85],"class":"crack"},
        {"bbox":[0,3063,7,85],"class":"crack"},
        {"bbox":[0,3144,6,85],"class":"crack"},
        {"bbox":[0,3144,7,86],"class":"crack"},
        {"bbox":[0,3225,6,85],"class":"crack"},
        {"bbox":[0,3306,5,85],"class":"crack"},
        {"bbox":[0,3386,5,85],"class":"crack"},
        {"bbox":[0,3467,5,85],"class":"crack"},
        {"bbox":[72,3583,7,8],"class":"black knot"},
        {"bbox":[50,3578,8,11],"class":"black knot"},
        {"bbox":[0,3547,5,85],"class":"crack"},
        {"bbox":[0,3628,5,85],"class":"crack"},
        {"bbox":[49,3733,8,12],"class":"black knot"},
        {"bbox":[49,3800,17,24],"class":"black knot"},
        {"bbox":[0,3951,5,85],"class":"crack"},
        {"bbox":[0,4031,5,85],"class":"crack"},
        {"bbox":[55,4161,9,11],"class":"black knot"},
        {"bbox":[0,4273,5,85],"class":"crack"},
        {"bbox":[0,4434,5,85],"class":"crack"},
        {"bbox":[0,4515,4,85],"class":"crack"},
        {"bbox":[0,4596,5,85],"class":"crack"},
        {"bbox":[0,4676,5,54],"class":"crack"},
        {"bbox":[0,4676,9,54],"class":"crack"}
      ]
    }
  },
  {
    "woodId": "WOOD-DEMO-006",
    "length": 2215.68,
    "width": 130.08,
    "height": 40.32,
    "imglength": 4616,
    "imgwidth": 271,
    "imgheight": 84,
    "defectDetails": {
      "top": [
        {"bbox":[144,161,66,64],"class":"black knot"},
        {"bbox":[250,255,19,269],"class":"crack"},
        {"bbox":[127,1640,40,54],"class":"black knot"},
        {"bbox":[118,2333,76,89],"class":"black knot"},
        {"bbox":[73,2592,36,32],"class":"resin"},
        {"bbox":[137,2627,45,27],"class":"resin"},
        {"bbox":[44,3048,86,48],"class":"black knot"},
        {"bbox":[178,4065,86,37],"class":"black knot"}
      ],
      "right": [
        {"bbox":[15,0,35,161],"class":"crack"},
        {"bbox":[58,416,22,221],"class":"crack"},
        {"bbox":[52,416,28,177],"class":"crack"},
        {"bbox":[60,433,15,203],"class":"crack"},
        {"bbox":[101,1641,43,37],"class":"black knot"},
        {"bbox":[0,1665,13,221],"class":"crack"},
        {"bbox":[92,1665,59,26],"class":"black knot"},
        {"bbox":[0,1665,23,221],"class":"crack"}
      ],
      "bottom": [
        {"bbox":[37,293,11,16],"class":"black knot"},
        {"bbox":[0,1569,5,92],"class":"crack"},
        {"bbox":[0,1656,5,92],"class":"crack"},
        {"bbox":[0,2266,5,92],"class":"crack"},
        {"bbox":[85,2790,7,92],"class":"crack"},
        {"bbox":[43,3148,8,11],"class":"wormhole"},
        {"bbox":[0,3139,5,92],"class":"crack"},
        {"bbox":[0,3749,4,93],"class":"crack"}
      ],
      "left": [
        {"bbox":[0,394,3,83],"class":"crack"},
        {"bbox":[0,551,6,83],"class":"crack"},
        {"bbox":[0,709,6,83],"class":"crack"},
        {"bbox":[0,708,8,83],"class":"crack"},
        {"bbox":[0,787,6,83],"class":"crack"},
        {"bbox":[0,787,7,84],"class":"crack"},
        {"bbox":[0,866,6,83],"class":"crack"},
        {"bbox":[0,866,7,83],"class":"crack"}
      ]
    }
  },
  {
    "woodId": "WOOD-DEMO-007",
    "length": 1007.04,
    "width": 132.96,
    "height": 40.8,
    "imglength": 2098,
    "imgwidth": 277,
    "imgheight": 85,
    "defectDetails": {
      "top": [
        {"bbox":[128,1504,29,30],"class":"black knot"}
      ],
      "right": [
        {"bbox":[144,1488,29,55],"class":"black knot"}
      ],
      "bottom": [
        {"bbox":[0,337,4,89],"class":"crack"},
        {"bbox":[0,1350,4,89],"class":"crack"},
        {"bbox":[0,1434,4,89],"class":"crack"},
        {"bbox":[0,1940,5,24],"class":"resin"},
        {"bbox":[0,1940,3,24],"class":"resin"}
      ],
      "left": [
        {"bbox":[0,637,4,84],"class":"crack"},
        {"bbox":[0,717,4,84],"class":"crack"},
        {"bbox":[0,797,4,84],"class":"crack"},
        {"bbox":[0,876,4,84],"class":"crack"},
        {"bbox":[0,956,4,84],"class":"crack"},
        {"bbox":[0,1036,4,84],"class":"crack"},
        {"bbox":[0,1115,4,84],"class":"crack"},
        {"bbox":[0,1912,5,41],"class":"crack"}
      ]
    }
  },
  {
    "woodId": "WOOD-DEMO-008",
    "length": 600.96,
    "width": 116.64,
    "height": 41.28,
    "imglength": 1252,
    "imgwidth": 243,
    "imgheight": 86,
    "defectDetails": {
      "top": [],
      "right": [
        {"bbox":[0,153,9,21],"class":"black knot"},
        {"bbox":[51,415,32,33],"class":"black knot"},
        {"bbox":[0,588,12,205],"class":"crack"},
        {"bbox":[66,587,41,180],"class":"crack"},
        {"bbox":[0,784,13,205],"class":"crack"},
        {"bbox":[1,783,18,205],"class":"crack"},
        {"bbox":[63,958,80,34],"class":"black knot"},
        {"bbox":[83,979,69,59],"class":"black knot"}
      ],
      "bottom": [
        {"bbox":[0,0,4,90],"class":"crack"}
      ],
      "left": []
    }
  },
  {
    "woodId": "WOOD-DEMO-009",
    "length": 929.76,
    "width": 118.08,
    "height": 45.6,
    "imglength": 1937,
    "imgwidth": 246,
    "imgheight": 95,
    "defectDetails": {
      "top": [
        {"bbox":[0,692,17,245],"class":"crack"},
        {"bbox":[1,691,20,246],"class":"crack"}
      ],
      "right": [
        {"bbox":[159,283,39,50],"class":"black knot"},
        {"bbox":[116,279,13,16],"class":"wormhole"},
        {"bbox":[118,406,47,55],"class":"black knot"},
        {"bbox":[1,587,23,208],"class":"crack"},
        {"bbox":[115,629,45,51],"class":"black knot"},
        {"bbox":[0,590,19,206],"class":"crack"},
        {"bbox":[0,784,15,207],"class":"crack"},
        {"bbox":[52,1431,57,67],"class":"black knot"}
      ],
      "bottom": [
        {"bbox":[88,445,5,94],"class":"crack"},
        {"bbox":[0,713,7,94],"class":"crack"},
        {"bbox":[0,712,8,94],"class":"crack"},
        {"bbox":[0,802,6,94],"class":"crack"},
        {"bbox":[0,801,8,95],"class":"crack"},
        {"bbox":[43,901,20,31],"class":"black knot"},
        {"bbox":[0,1781,5,94],"class":"crack"},
        {"bbox":[0,1870,10,62],"class":"crack"}
      ],
      "left": [
        {"bbox":[0,1876,5,37],"class":"crack"},
        {"bbox":[0,1876,8,37],"class":"crack"}
      ]
    }
  },
  {
    "woodId": "WOOD-DEMO-010",
    "length": 848.16,
    "width": 119.04,
    "height": 43.2,
    "imglength": 1767,
    "imgwidth": 248,
    "imgheight": 90,
    "defectDetails": {
      "top": [
        {"bbox":[15,331,47,43],"class":"black knot"},
        {"bbox":[105,612,19,20],"class":"wormhole"},
        {"bbox":[213,465,34,246],"class":"crack"},
        {"bbox":[0,698,14,240],"class":"crack"},
        {"bbox":[16,917,43,27],"class":"black knot"},
        {"bbox":[9,930,63,41],"class":"black knot"},
        {"bbox":[63,1540,59,41],"class":"black knot"},
        {"bbox":[123,1661,28,32],"class":"black knot"}
      ],
      "right": [
        {"bbox":[0,607,14,215],"class":"crack"},
        {"bbox":[1,607,17,216],"class":"crack"},
        {"bbox":[0,810,13,214],"class":"crack"},
        {"bbox":[35,1529,48,48],"class":"black knot"}
      ],
      "bottom": [
        {"bbox":[87,90,8,95],"class":"crack"},
        {"bbox":[82,1455,14,97],"class":"crack"}
      ],
      "left": [
        {"bbox":[0,1,6,88],"class":"crack"},
        {"bbox":[0,0,8,89],"class":"crack"},
        {"bbox":[0,84,5,89],"class":"crack"},
        {"bbox":[0,84,7,89],"class":"crack"},
        {"bbox":[0,168,4,89],"class":"crack"},
        {"bbox":[0,1096,5,90],"class":"crack"},
        {"bbox":[0,1181,6,89],"class":"crack"},
        {"bbox":[0,1181,7,89],"class":"crack"}
      ]
    }
  }
];

