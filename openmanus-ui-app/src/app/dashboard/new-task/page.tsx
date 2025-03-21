'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useApiKeys } from "@/hooks/useApiKeys"
import { Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function TaskExecutionInterface() {
  const { apiKeys, isLoading: isLoadingKeys } = useApiKeys()
  const [selectedModel, setSelectedModel] = useState("")
  const [prompt, setPrompt] = useState("")
  const [response, setResponse] = useState("")
  const [isExecuting, setIsExecuting] = useState(false)
  const [activeTab, setActiveTab] = useState("text")

  // Group API keys by provider
  const openaiKeys = apiKeys.filter(key => key.provider === 'openai')
  const anthropicKeys = apiKeys.filter(key => key.provider === 'anthropic')
  const geminiKeys = apiKeys.filter(key => key.provider === 'gemini')
  const localKeys = apiKeys.filter(key => key.provider === 'local')

  // Combine all models from all providers
  const availableModels = [
    ...openaiKeys.map(key => ({ id: key.id, name: key.model || 'gpt-4o', provider: 'openai' })),
    ...anthropicKeys.map(key => ({ id: key.id, name: key.model || 'claude-3-opus', provider: 'anthropic' })),
    ...geminiKeys.map(key => ({ id: key.id, name: key.model || 'gemini-pro', provider: 'gemini' })),
    ...localKeys.map(key => ({ id: key.id, name: key.model || 'local-model', provider: 'local' }))
  ]

  const handleSubmit = async () => {
    if (!selectedModel) {
      toast({
        title: "Model not selected",
        description: "Please select an AI model to use for this task.",
        variant: "destructive"
      })
      return
    }

    if (!prompt.trim()) {
      toast({
        title: "Empty prompt",
        description: "Please enter a prompt for OpenManus.",
        variant: "destructive"
      })
      return
    }

    setIsExecuting(true)
    setResponse("")

    try {
      // In a real implementation, this would call the OpenManus API
      // For now, we'll simulate a response after a delay
      const selectedModelInfo = availableModels.find(model => model.id === selectedModel)
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock response based on the prompt and selected model
      const mockResponse = `Response from ${selectedModelInfo?.provider} (${selectedModelInfo?.name}):\n\n` +
        `I've processed your request: "${prompt}"\n\n` +
        `Here's a simulated response from OpenManus. In the actual implementation, ` +
        `this would connect to the OpenManus backend API and return real results based on your prompt. ` +
        `The response would be streamed in real-time as OpenManus processes your request.`
      
      setResponse(mockResponse)
    } catch (error: any) {
      console.error('Error executing task:', error)
      toast({
        title: "Error executing task",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      })
    } finally {
      setIsExecuting(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(response)
    toast({
      title: "Copied to clipboard",
      description: "Response has been copied to clipboard."
    })
  }

  const handleExport = () => {
    // Create a blob with the response text
    const blob = new Blob([response], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    
    // Create a temporary link and trigger download
    const a = document.createElement('a')
    a.href = url
    a.download = `openmanus-response-${new Date().toISOString().slice(0, 10)}.txt`
    document.body.appendChild(a)
    a.click()
    
    // Clean up
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    toast({
      title: "Response exported",
      description: "Response has been exported as a text file."
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">New Task</h1>
        <p className="text-muted-foreground">
          Create a new task for OpenManus to execute.
        </p>
      </div>
      
      {isLoadingKeys ? (
        <div className="flex items-center justify-center h-12">
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          <span>Loading available models...</span>
        </div>
      ) : availableModels.length === 0 ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No API keys configured</AlertTitle>
          <AlertDescription>
            Please add at least one API key in the API Keys section before creating a task.
            <Button 
              variant="link" 
              className="p-0 h-auto font-normal" 
              onClick={() => window.location.href = '/dashboard/api-keys'}
            >
              Go to API Keys
            </Button>
          </AlertDescription>
        </Alert>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="lg:col-span-1">
            <CardContent className="p-6 space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="model">Model</Label>
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger id="model">
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    {openaiKeys.length > 0 && (
                      <SelectItem value="openai-header" disabled className="font-semibold">
                        OpenAI Models
                      </SelectItem>
                    )}
                    {openaiKeys.map(key => (
                      <SelectItem key={key.id} value={key.id}>
                        {key.model || 'GPT-4o'} (OpenAI)
                      </SelectItem>
                    ))}
                    
                    {anthropicKeys.length > 0 && (
                      <SelectItem value="anthropic-header" disabled className="font-semibold">
                        Anthropic Models
                      </SelectItem>
                    )}
                    {anthropicKeys.map(key => (
                      <SelectItem key={key.id} value={key.id}>
                        {key.model || 'Claude 3 Opus'} (Anthropic)
                      </SelectItem>
                    ))}
                    
                    {geminiKeys.length > 0 && (
                      <SelectItem value="gemini-header" disabled className="font-semibold">
                        Google Models
                      </SelectItem>
                    )}
                    {geminiKeys.map(key => (
                      <SelectItem key={key.id} value={key.id}>
                        {key.model || 'Gemini Pro'} (Google)
                      </SelectItem>
                    ))}
                    
                    {localKeys.length > 0 && (
                      <SelectItem value="local-header" disabled className="font-semibold">
                        Local Models
                      </SelectItem>
                    )}
                    {localKeys.map(key => (
                      <SelectItem key={key.id} value={key.id}>
                        {key.model || 'Local Model'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="prompt">Prompt</Label>
                <Textarea 
                  id="prompt" 
                  placeholder="Enter your task instructions here..." 
                  className="min-h-[200px] resize-y"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </div>
              
              <Button 
                className="w-full" 
                onClick={handleSubmit}
                disabled={isExecuting || !selectedModel || !prompt.trim()}
              >
                {isExecuting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Executing...
                  </>
                ) : (
                  'Submit Task'
                )}
              </Button>
            </CardContent>
          </Card>
          
          <Card className="lg:col-span-1">
            <CardContent className="p-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList>
                  <TabsTrigger value="text">Text</TabsTrigger>
                  <TabsTrigger value="code">Code</TabsTrigger>
                  <TabsTrigger value="json">JSON</TabsTrigger>
                </TabsList>
                
                <TabsContent value="text" className="space-y-4">
                  <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                    <div className="text-sm whitespace-pre-wrap">
                      {response ? (
                        response
                      ) : (
                        <p className="text-muted-foreground italic">Response will appear here after submitting a task...</p>
                      )}
                    </div>
                  </ScrollArea>
                  <div className="flex justify-end space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleCopy}
                      disabled={!response}
                    >
                      Copy
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleExport}
                      disabled={!response}
                    >
                      Export
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="code" className="space-y-4">
                  <ScrollArea className="h-[400px] w-full rounded-md border p-4 bg-muted">
                    <pre className="text-sm">
                      <code className="text-muted-foreground">
                        {response ? (
                          response
                        ) : (
                          "// Code will appear here..."
                        )}
                      </code>
                    </pre>
                  </ScrollArea>
                  <div className="flex justify-end space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleCopy}
                      disabled={!response}
                    >
                      Copy
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      disabled={!response}
                    >
                      Execute
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleExport}
                      disabled={!response}
                    >
                      Export
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="json" className="space-y-4">
                  <ScrollArea className="h-[400px] w-full rounded-md border p-4 bg-muted">
                    <pre className="text-sm">
                      <code className="text-muted-foreground">
                        {response ? (
                          response
                        ) : (
                          "// JSON will appear here..."
                        )}
                      </code>
                    </pre>
                  </ScrollArea>
                  <div className="flex justify-end space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleCopy}
                      disabled={!response}
                    >
                      Copy
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleExport}
                      disabled={!response}
                    >
                      Export
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

export default TaskExecutionInterface
