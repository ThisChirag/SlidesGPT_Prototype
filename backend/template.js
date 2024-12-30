const TEMPLATE={
    GENERIC_SIMPLE:{
        TEMPLATE: {
            title: 'GENERIC_SIMPLE',
            margin: [0, 0, 0, 0], // Removed extra margins to use the full slide area
            background: { path: "./images/T1.png" },
            objects: [
              // Title Section (Optional, uncomment if needed)
              // { text: {
              //     text: '',
              //     options: { x: 0.5, y: 0.8, w: '90%', align: 'center', color: '000000', fontSize: 22, bold: true }
              // }},
              
              // Content Section (Text Box)
              { rect: { x: 0, y: 0, w: '100%', h: '100%' } }, // Full slide width and height
              // { text: {
              //     text: '',
              //     options: { x: 1.0, y: 1.0, w: '95%', align: 'left', color: '333333', fontSize: 14 }
              // }},
              
              // Footer Section (Optional, uncomment if needed)
              // { rect: { x: 0, y: 6.8, w: '100%', h: 0.6, fill: { color: 'CCCCCC' } } },
              // { text: {
              //     text: 'Confidential',
              //     options: { x: 0, y: 6.9, w: '100%', align: 'center', color: '000000', fontSize: 10 }
              // }},
              
              // Slide Number
              { slideNumber: { x: 9.5, y: 7.3, color: '000000', fontSize: 10 } } // Positioned for full-width slide
            ]
          },
          TITLE:{ x: 0.9, y: 1.0, w: '90%', align: 'center', color: '000000', fontSize: 22, bold: true },
          PARAGRAPH:(text,index)=>{
            return {
              text: text,  // Only text
              options: {
                fontSize: 16,
                color: '333333',
                x: 1.0,
                y: 2.2 + index * 0.5,
                w: '95%',
                align: 'left'
              }
            };
            },
            CONTENT:(text,index)=>{
                return {
                    textArray: [
                      { text: '• ', options: { fontSize: 16, color: '30acec' } }, // Bullet with different color
                      { text: text, options: { fontSize: 16, color: '333333' } }  // Text with original color
                    ],
                    options: {
                      x: 1.0,
                      y: 2.2 + index * 0.5,
                      w: '95%',
                      align: 'left'
                    }
                  };
                }
          },
          GENERIC_MODERN:{
            TEMPLATE: {
                title: 'GENERIC_MODERN',
                margin: [0, 0, 0, 0], // Removed extra margins to use the full slide area
                background: { path: "./images/T2.png" },
                objects: [
                  // Title Section (Optional, uncomment if needed)
                  // { text: {
                  //     text: '',
                  //     options: { x: 0.5, y: 0.8, w: '90%', align: 'center', color: '000000', fontSize: 22, bold: true }
                  // }},
                  
                  // Content Section (Text Box)
                  { rect: { x: 0, y: 0, w: '100%', h: '100%' } }, // Full slide width and height
                  // { text: {
                  //     text: '',
                  //     options: { x: 1.0, y: 1.0, w: '95%', align: 'left', color: '333333', fontSize: 14 }
                  // }},
                  
                  // Footer Section (Optional, uncomment if needed)
                  // { rect: { x: 0, y: 6.8, w: '100%', h: 0.6, fill: { color: 'CCCCCC' } } },
                  // { text: {
                  //     text: 'Confidential',
                  //     options: { x: 0, y: 6.9, w: '100%', align: 'center', color: '000000', fontSize: 10 }
                  // }},
                  
                  // Slide Number
                  { slideNumber: { x: 9.5, y: 7.3, color: '000000', fontSize: 10 } } // Positioned for full-width slide
                ]
              },
              TITLE:{ x: 0.9, y: 1.0, w: '90%', align: 'center', color: '000000', fontSize: 22, bold: true },
              PARAGRAPH:(text,index)=>{
                return {
                  text: text,  // Only text
                  options: {
                    fontSize: 16,
                    color: '333333',
                    x: 1.0,
                    y: 2.2 + index * 0.5,
                    w: '95%',
                    align: 'left'
                  }
                };
                },
                CONTENT:(text,index)=>{
                    return {
                        textArray: [
                          { text: '\u25BA ', options: { fontSize: 14, color: 'a53010' } }, // Bullet with different color
                          { text: text, options: { fontSize: 16, color: '333333' } }  // Text with original color
                        ],
                        options: {
                          x: 1.0,
                          y: 2.2 + index * 0.5,
                          w: '95%',
                          align: 'left'
                        }
                      };
                    }
          }
         
          }        
    
module.exports={TEMPLATE}
