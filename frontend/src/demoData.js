export const demoOrderJson = {
  orderId: 'ORDER-DEMO-MULTI-001',
  sawKerfMm: 4,
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

export const demoWoods = [
  {
    woodId: 'WOOD-DEMO-001',
    length: 2200,
    width: 100,
    height: 50,
    defectDetails: {
      top: [
        { class: 'Knot', bbox: [10, 300, 15, 20] },
        { class: 'Knot', bbox: [60, 1200, 20, 25] },
        { class: 'Knot', bbox: [30, 600, 18, 35] },
        { class: 'Knot', bbox: [70, 1700, 12, 40] }
      ],
      right: [
        { class: 'Knot', bbox: [5, 400, 10, 30] },
        { class: 'Knot', bbox: [25, 950, 15, 25] }
      ],
      bottom: [
        { class: 'Knot', bbox: [20, 150, 25, 30] },
        { class: 'Knot', bbox: [55, 800, 18, 45] },
        { class: 'Knot', bbox: [10, 1400, 20, 35] }
      ],
      left: [
        { class: 'Knot', bbox: [10, 550, 12, 28] },
        { class: 'Knot', bbox: [30, 1300, 14, 22] }
      ]
    }
  },
  {
    woodId: 'WOOD-DEMO-EX-01',
    length: 1800,
    width: 100,
    height: 50,
    defectDetails: {
      top: [
        { class: 'Knot', bbox: [8, 250, 12, 30] },
        { class: 'Knot', bbox: [55, 900, 18, 25] },
        { class: 'Knot', bbox: [40, 1400, 20, 35] },
        { class: 'Knot', bbox: [20, 500, 15, 40] }
      ],
      right: [
        { class: 'Knot', bbox: [8, 200, 12, 35] },
        { class: 'Knot', bbox: [35, 1100, 10, 28] }
      ],
      bottom: [
        { class: 'Knot', bbox: [15, 350, 22, 30] },
        { class: 'Knot', bbox: [60, 750, 18, 38] }
      ],
      left: [
        { class: 'Knot', bbox: [5, 600, 15, 25] },
        { class: 'Knot', bbox: [28, 1200, 12, 32] },
        { class: 'Knot', bbox: [40, 300, 8, 20] }
      ]
    }
  },
  {
    woodId: 'WOOD-DEMO-EX-02',
    length: 2200,
    width: 100,
    height: 50,
    defectDetails: {
      top: [
        { class: 'Knot', bbox: [5, 300, 10, 30] },
        { class: 'Knot', bbox: [45, 1100, 20, 40] },
        { class: 'Knot', bbox: [70, 1800, 15, 50] },
        { class: 'Knot', bbox: [20, 600, 18, 35] },
        { class: 'Knot', bbox: [50, 200, 15, 25] }
      ],
      right: [
        { class: 'Knot', bbox: [10, 500, 12, 30] },
        { class: 'Knot', bbox: [30, 1500, 18, 40] },
        { class: 'Knot', bbox: [5, 900, 14, 22] }
      ],
      bottom: [
        { class: 'Knot', bbox: [25, 100, 20, 35] },
        { class: 'Knot', bbox: [60, 700, 22, 45] },
        { class: 'Knot', bbox: [15, 1600, 18, 38] }
      ],
      left: [
        { class: 'Knot', bbox: [12, 400, 16, 28] },
        { class: 'Knot', bbox: [38, 1200, 10, 35] }
      ]
    }
  },
  {
    woodId: 'WOOD-DEMO-EX-03',
    length: 1600,
    width: 100,
    height: 50,
    defectDetails: {
      top: [
        { class: 'Knot', bbox: [15, 200, 15, 40] },
        { class: 'Knot', bbox: [65, 800, 25, 30] },
        { class: 'Knot', bbox: [40, 1200, 18, 35] }
      ],
      right: [
        { class: 'Knot', bbox: [8, 350, 12, 28] },
        { class: 'Knot', bbox: [35, 950, 15, 32] }
      ],
      bottom: [
        { class: 'Knot', bbox: [20, 100, 20, 40] },
        { class: 'Knot', bbox: [55, 600, 18, 30] },
        { class: 'Knot', bbox: [10, 1100, 22, 38] }
      ],
      left: [
        { class: 'Knot', bbox: [10, 450, 14, 25] },
        { class: 'Knot', bbox: [42, 750, 12, 28] }
      ]
    }
  },
  // 缺陷较少的样本：仅头尾各少量结疤
  {
    woodId: 'WOOD-DEMO-CLEAN-01',
    length: 2200,
    width: 100,
    height: 50,
    defectDetails: {
      top: [
        { class: 'Knot', bbox: [15, 150, 12, 20] },
        { class: 'Knot', bbox: [80, 1900, 10, 18] }
      ],
      right: [],
      bottom: [],
      left: []
    }
  },
  // 中部有一两个缺陷，用于测试高质量木材
  {
    woodId: 'WOOD-DEMO-CLEAN-02',
    length: 2000,
    width: 100,
    height: 50,
    defectDetails: {
      top: [
        { class: 'Knot', bbox: [40, 900, 15, 22] }
      ],
      right: [],
      bottom: [
        { class: 'Knot', bbox: [60, 1100, 12, 20] }
      ],
      left: []
    }
  },
  // 只有一个非常小的缺陷，几乎“完美”的样本
  {
    woodId: 'WOOD-DEMO-CLEAN-03',
    length: 1800,
    width: 100,
    height: 50,
    defectDetails: {
      top: [],
      right: [],
      bottom: [],
      left: [
        { class: 'Knot', bbox: [20, 800, 6, 10] }
      ]
    }
  }
];

