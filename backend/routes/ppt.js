const express = require('express');
const pptxgen = require('pptxgenjs');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const Anthropic=require("@anthropic-ai/sdk");
const FormData=require("form-data")
const { GENERIC_SIMPLE, GENERIC_SIMPLE_TITLE, GENERIC_SIMPLE_CONTENT, getGenericSimpleContent, TEMPLATE } = require('../template.js');
const image1="/images/T1.png"
const dotenv =require("dotenv")
dotenv.config();
const CLAUDE=process.env.CLAUDE;
const OPENAI=process.env.OPEN_AI;
const freeAI=process.env.freeAi;

console.log({CLAUDE})

const genric = `
Create a PowerPoint in the following format:

Each slide must start with "Slide" followed by its number.

Structure of slides:
Title: A concise and engaging title for the slide. (write the title like this Title: "title")
Content: List all key points for the slide (use - before each key point).
Paragraph: A brief paragraph with no more than 5 lines summarizing the content or providing context.
image: Give a small prompt to create image related to this topic only generate 1 image only (write it like this image: "prompt" where image key is small characters in the slide and add on the first slide )

Instructions:

For Slides 1 to 4:
Generate the title and content (key points) only. Do not write the paragraph.
For Slides 5 and 7:
Write the title and a brief paragraph only. Do not include key points.
Important:

Use only the information provided in this prompt for generating content and dont add any extra text note anything except these things
`;



const anthropic = new Anthropic({
    apiKey: CLAUDE,
  });


async function generateContent(prompt){
    const msg = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1024,
        messages: [{ role: "user", content: prompt}],
      });
      return msg
}


async function generateImage(prompt) {
  const fetch = (await import('node-fetch')).default;
  try {
    
    const response = await axios.post("https://api.openai.com/v1/images/generations", {
      prompt: prompt,
      n: 1,
      size: "1024x1024"
    }, {
      headers: {
        Authorization: `Bearer ${OPENAI}`
      }
    });

    const imageUrl = response.data.data[0].url; // Assuming the URL of the generated image is in this path
    const fetchResponse = await fetch(imageUrl);

    if (!fetchResponse.ok) {
      throw new Error(`Failed to fetch image: ${fetchResponse.statusText}`);
    }

    // Get the image as a buffer
    const buffer = await fetchResponse.buffer();

    // Save the image to a file
    const filePath = './generated_image.png';
    fs.writeFileSync(filePath, buffer);
    console.log('Image saved as generated_image.png');

    return filePath; // Return the path to the saved image
  } catch (error) {
    console.error('Error generating or saving image:', error);
    throw error; // Re-throw the error to be handled by the caller
  }
}

async function downloadImage(prompt){
  console.log({prompt});
  
  const payload = {
    prompt: prompt,
    output_format: "webp"
  };
  
  const response = await axios.postForm(
    `https://api.stability.ai/v2beta/stable-image/generate/ultra`,
    axios.toFormData(payload, new FormData()),
    {
      validateStatus: undefined,
      responseType: "arraybuffer",
      headers: { 
        Authorization: `Bearer ${freeAI}`, 
        Accept: "image/*" 
      },
    },
  );
  
  if(response.status === 200) {
    fs.writeFileSync("./custom.webp", Buffer.from(response.data));
  } else {
    throw new Error(`${response.status}: ${response.data.toString()}`);
  }
}


function parseContent(content) {

    // console.log({content});
    
    const slides = [];
    const lines = content.split('\n');
    let currentSlide = null;
  
    lines.forEach(line => {
        
        
      if (line.startsWith('Slide')) {
        if (currentSlide) {
          slides.push(currentSlide);
        }
        currentSlide = { title: "", content: [],paragraph:[] };
      } else if (line.trim() && currentSlide) {
        if(line.startsWith('Title')){
            currentSlide.title=line.replace("Title:","").replace(/"/g, '').trim();
        }else if(line.startsWith("-")){
            currentSlide.content.push(line.replace("-"," ").trim());
        }else if(line.startsWith("image")){
          currentSlide.image=line.replace("image:","").replace(/"/g, '').trim();
        }else{
            currentSlide.paragraph.push(line.trim());   
        }
      }
    });
  
    if (currentSlide) {
      slides.push(currentSlide);
    }

  
    return slides;
  }

  function splitText(text, maxLength) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';
  
    words.forEach(word => {
      if ((currentLine + word).length <= maxLength) {
        currentLine += `${word} `;
      } else {
        lines.push(currentLine.trim());
        currentLine = `${word} `;
      }
    });
  
    if (currentLine.trim()) {
      lines.push(currentLine.trim());
    }
  
    return lines;
  }

  router.post('/generate-ppt', async (req, res) => {
    const { text,template } = req.body;
    console.log({text},{template})
    
    try {
        const concat=genric+`user:${text}`;
      
      const generatedContent = await generateContent(concat);
 
      const value = generatedContent.content[0].text;
      


      
      const value2=`
I'll create a PowerPoint about Commands following the specified format.

Slide 1
Title: "Introduction to Commands"
- Basic definition and purpose of commands
- Different types of command interfaces
- Role of commands in computing
- Historical evolution of command systems
image: "Vintage computer terminal with green text commands"

Slide 2
Title: "Command Line Interface (CLI)"
- Text-based user interface
- Command prompt functionality
- Basic syntax structure
- Common CLI environments
image: "Modern terminal window with multiple command lines"

Slide 3
Title: "Essential Command Categories"
- System commands
- File management commands
- Network commands
- User management commands

Slide 4
Title: "Command Structure and Syntax"
- Command name
- Parameters and arguments
- Options and flags
- Command execution order

Slide 5
Title: "Command Security Best Practices"
Security in command execution is paramount for system integrity. Users must understand permission levels and potential risks before executing commands. Proper authentication and verification procedures should always be followed to prevent unauthorized access or system damage.

Slide 6
Title: "Future of Command Interfaces"
- Voice-activated commands
- AI-powered command prediction
- Natural language processing integration
- Cross-platform command uniformity

Slide 7
Title: "Command Automation"
Command automation revolutionizes system management by streamlining repetitive tasks and increasing efficiency. Modern scripting tools and batch processing capabilities allow users to create sophisticated automated workflows with minimal manual intervention.`
      
      
      
      //prase the ai generated content
      const slidesContent = parseContent(value);

    
      // console.log(slidesContent)
      
      let pptx = new pptxgen();
      pptx.defineSlideMaster(
        TEMPLATE[template].TEMPLATE
      );
      
  
    await Promise.all(
      slidesContent.map(async slideContent => {
       
        let slide = pptx.addSlide({ masterName:template});

        slide.addText(slideContent.title, TEMPLATE[template].TITLE);
        

       slideContent.paragraph.length!=0 && slideContent.paragraph.forEach((text) => {
            const lines = splitText(text, 80);

            lines.forEach((line,index) => {
                
                
                const { text, options } = TEMPLATE[template].PARAGRAPH(line, index);
                // console.log({textArray},{options})
                slide.addText(text,options);
                
              });
            // const {textArray,options} = TEMPLATE[template].CONTENT(text, index);

            // slide.addText(textArray,options);
        });

        slideContent.content.length!=0 && slideContent.content.forEach((text,index) => {
            const {textArray,options} = TEMPLATE[template].CONTENT(text, index);

            slide.addText(textArray,options);
        });

        if(slideContent.image){
          
          
          try{
              
            await generateImage(slideContent.image)
           
            slide.addImage({
              path: `./generated_image.png`,
              x: 6,
              y: 2,
              w: 10, 
              h: 7.5 ,
              sizing: { type: "cover", w: 3, h: 2 } 
              
          });
              
              
          //     await downloadImage(slideContent.image)
          //   slide.addImage({
          //     path: `./custom.webp`,
          //     x: 6,
          //     y: 2,
          //     w: 10, 
          //     h: 7.5 ,
          //     sizing: { type: "cover", w: 3, h: 3 } 
              
          // });
        
          }catch(err){
            console.log(err)
          }
          
        }
      })
    ) 
  
      const filePath = path.join(__dirname, 'generated-ppt.pptx');
      await pptx.writeFile({ fileName: filePath });
  
      res.download(filePath, 'generated-ppt.pptx', (err) => {
        if (err) {
          console.error(err);
        }
        // fs.unlinkSync(filePath); 
      });
    } catch (error) {
      res.status(500).send('Error generating PPT');
    }
  });
  
  module.exports = router;