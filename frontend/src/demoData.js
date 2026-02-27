// 从后端 demo/order_demo.json 和 demo/wood_demo.json 中拷贝的示例数据。

export const demoOrderJson = {
  orderId: 'ORDER-DEMO-MULTI-001',
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
        {
          class: 'Knot',
          bbox: [10, 300, 15, 100]
        },
        {
          class: 'Knot',
          bbox: [60, 1200, 20, 25]
        }
      ],
      right: [],
      bottom: [],
      left: []
    }
  },
  {
    woodId: 'WOOD-DEMO-EX-01',
    length: 1800,
    width: 100,
    height: 50,
    defectDetails: {
      top: [
        {
          class: 'Knot',
          bbox: [8, 250, 12, 30]
        },
        {
          class: 'Knot',
          bbox: [55, 900, 18, 25]
        },
        {
          class: 'Knot',
          bbox: [40, 1400, 20, 35]
        }
      ],
      right: [],
      bottom: [],
      left: []
    }
  },
  {
    woodId: 'WOOD-DEMO-EX-02',
    length: 2200,
    width: 100,
    height: 50,
    defectDetails: {
      top: [
        {
          class: 'Knot',
          bbox: [5, 300, 10, 30]
        },
        {
          class: 'Knot',
          bbox: [45, 1100, 20, 40]
        },
        {
          class: 'Knot',
          bbox: [70, 1800, 15, 50]
        },
        {
          class: 'Knot',
          bbox: [20, 600, 18, 35]
        }
      ],
      right: [],
      bottom: [],
      left: []
    }
  },
  {
    woodId: 'WOOD-DEMO-EX-03',
    length: 1600,
    width: 100,
    height: 50,
    defectDetails: {
      top: [
        {
          class: 'Knot',
          bbox: [15, 200, 15, 40]
        },
        {
          class: 'Knot',
          bbox: [65, 800, 25, 30]
        }
      ],
      right: [],
      bottom: [],
      left: []
    }
  }
];

