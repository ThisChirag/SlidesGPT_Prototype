import { useState } from "react"
import { motion } from "framer-motion"
import { Sparkles, Upload, Check } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import T1 from "../../images/T1.png"
import T2 from "../../images/T2.png"

const templates = [
  {
    id: "GENERIC_MODERN",
    name: "Modern",
    preview: T2,
  },
  {
    id: "GENERIC_SIMPLE",
    name: "Classic",
    preview: T1,
  },
]

export default function SlidesGPT() {
  const [prompt, setPrompt] = useState("")
  
  const [selectedTemplate, setSelectedTemplate] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async () => {
    console.log("hiii");
    
    setIsGenerating(true)
    fetch('http://ec2-13-60-35-70.eu-north-1.compute.amazonaws.com:3000/generate-ppt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: prompt, template: selectedTemplate }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.blob();
      })
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'generated-ppt.pptx';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        setIsGenerating(false);
      })
      .catch(err => {
        console.error('Error generating PPT:', err);
        setIsGenerating(false);
      });
    }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800">
      {/* Navigation */}
      <nav className="px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">SlidesGPT</h1>
          
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4 mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Create AI PowerPoint Presentations
          </h2>
          <p className="text-white/80 text-lg">
            Transform your ideas into professional presentations in seconds
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-8"
        >
          <div className="relative">
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="I want a slide deck about the future of AI ..."
              className="min-h-[100px] bg-white rounded-xl border-0 text-gray-900 text-lg p-4 focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-white text-xl font-semibold">Choose a Template</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {templates.map((template) => (
                <motion.div
                  key={template.id}
                  className={`relative rounded-lg overflow-hidden cursor-pointer ${
                    selectedTemplate === template.id ? 'ring-2 ring-yellow-400' : ''
                  }`}
                  onClick={() => setSelectedTemplate(template.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img
                    src={template.preview}
                    alt={`${template.name} template preview`}
                    className="w-full h-auto"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <p className="text-white font-semibold">{template.name}</p>
                  </div>
                  {selectedTemplate === template.id && (
                    <div className="absolute top-2 right-2 bg-yellow-400 rounded-full p-1">
                      <Check className="w-4 h-4 text-black" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* <RadioGroup
            value={theme}
            onValueChange={setTheme}
            className="flex items-center justify-center gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="white" id="white" className="border-white" />
              <Label htmlFor="white" className="text-white cursor-pointer">White Theme</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="purple" id="purple" className="border-white" />
              <Label htmlFor="purple" className="text-white cursor-pointer">Purple Theme</Label>
            </div>
            <Button variant="ghost" className="text-white hover:bg-white/10">
              <Upload className="w-4 h-4 mr-2" />
              Upload Custom Theme
            </Button>
          </RadioGroup> */}

          <Button
            onClick={handleGenerate}
            disabled={!prompt || !selectedTemplate || isGenerating}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black h-12 text-lg rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {isGenerating ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center"
              >
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin mr-2" />
                Creating your slides...
              </motion.div>
            ) : (
              <span className="flex items-center">
                Create Slides
                <Sparkles className="w-5 h-5 ml-2" />
              </span>
            )}
          </Button>
        </motion.div>
      </main>
    </div>
  )
}

