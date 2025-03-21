'use client'

import { useSettings } from "@/hooks/useSettings"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { toast } from "@/components/ui/use-toast"
import { Moon, Sun } from "lucide-react"

export default function Page() {
  const { theme, toggleTheme, temperature, setTemperature, maxTokens, setMaxTokens } = useSettings()
  const [tempTemperature, setTempTemperature] = useState(temperature)
  const [tempMaxTokens, setTempMaxTokens] = useState(maxTokens.toString())

  const handleSaveModelSettings = () => {
    setTemperature(tempTemperature)
    setMaxTokens(parseInt(tempMaxTokens))
    
    toast({
      title: "Settings saved",
      description: "Your model settings have been updated."
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Customize your OpenManus UI experience.
        </p>
      </div>
      
      <Tabs defaultValue="appearance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="model">Model Settings</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>
        
        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Theme</CardTitle>
              <CardDescription>
                Customize the appearance of the application.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {theme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                  <Label htmlFor="theme-mode">{theme === 'dark' ? 'Dark' : 'Light'} Mode</Label>
                </div>
                <Switch
                  id="theme-mode"
                  checked={theme === 'light'}
                  onCheckedChange={toggleTheme}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <Card className={`border-2 ${theme === 'dark' ? 'border-primary' : 'border-muted'}`}>
                  <CardContent className="p-4 flex justify-center items-center h-40 bg-background">
                    <div className="text-center">
                      <Moon className="h-8 w-8 mx-auto mb-2" />
                      <h3 className="font-medium">Dark Mode</h3>
                      <p className="text-sm text-muted-foreground">Easier on the eyes in low light</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className={`border-2 ${theme === 'light' ? 'border-primary' : 'border-muted'}`}>
                  <CardContent className="p-4 flex justify-center items-center h-40 bg-white text-black">
                    <div className="text-center">
                      <Sun className="h-8 w-8 mx-auto mb-2" />
                      <h3 className="font-medium">Light Mode</h3>
                      <p className="text-sm text-gray-500">Better visibility in bright environments</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="model" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Model Parameters</CardTitle>
              <CardDescription>
                Configure default parameters for AI models.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="temperature">Temperature: {tempTemperature.toFixed(1)}</Label>
                  <span className="text-sm text-muted-foreground">
                    {tempTemperature < 0.3 ? 'More deterministic' : 
                     tempTemperature > 0.7 ? 'More creative' : 'Balanced'}
                  </span>
                </div>
                <Slider
                  id="temperature"
                  min={0}
                  max={1}
                  step={0.1}
                  value={[tempTemperature]}
                  onValueChange={(value) => setTempTemperature(value[0])}
                />
                <p className="text-sm text-muted-foreground">
                  Lower values produce more consistent outputs, higher values produce more varied outputs.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="max-tokens">Max Tokens</Label>
                <Input
                  id="max-tokens"
                  type="number"
                  value={tempMaxTokens}
                  onChange={(e) => setTempMaxTokens(e.target.value)}
                  min={1}
                  max={32000}
                />
                <p className="text-sm text-muted-foreground">
                  Maximum number of tokens to generate. Higher values allow for longer responses.
                </p>
              </div>
              
              <Button onClick={handleSaveModelSettings}>
                Save Model Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="advanced" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <CardDescription>
                Configure advanced options for OpenManus.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="streaming">Response Streaming</Label>
                  <p className="text-sm text-muted-foreground">
                    Show responses as they are generated in real-time.
                  </p>
                </div>
                <Switch id="streaming" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="code-execution">Code Execution</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow execution of code snippets in the browser.
                  </p>
                </div>
                <Switch id="code-execution" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="history">Save History</Label>
                  <p className="text-sm text-muted-foreground">
                    Save your interactions with OpenManus for future reference.
                  </p>
                </div>
                <Switch id="history" defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
