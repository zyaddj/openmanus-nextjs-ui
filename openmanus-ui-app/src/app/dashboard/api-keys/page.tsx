'use client'

import { useApiKeys, type ApiKeyInput } from '@/hooks/useApiKeys'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"
import { toast } from "@/components/ui/use-toast"
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function Page() {
  const { apiKeys, isLoading, error, addApiKey, updateApiKey, deleteApiKey } = useApiKeys()
  const [activeTab, setActiveTab] = useState("openai")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [keyToDelete, setKeyToDelete] = useState<string | null>(null)

  // Find existing API keys for each provider
  const openaiKey = apiKeys.find(key => key.provider === 'openai')
  const anthropicKey = apiKeys.find(key => key.provider === 'anthropic')
  const geminiKey = apiKeys.find(key => key.provider === 'gemini')
  const localKey = apiKeys.find(key => key.provider === 'local')

  const handleSaveApiKey = async (provider: string, formData: ApiKeyInput) => {
    setIsSubmitting(true)
    
    try {
      const existingKey = apiKeys.find(key => key.provider === provider)
      
      let result;
      if (existingKey) {
        // Update existing key
        result = await updateApiKey(existingKey.id, formData)
      } else {
        // Add new key
        result = await addApiKey(formData)
      }
      
      if (result.error) {
        toast({
          title: "Error saving API key",
          description: result.error.message,
          variant: "destructive"
        })
        return
      }
      
      toast({
        title: "API key saved",
        description: `Your ${provider} API key has been saved successfully.`,
      })
    } catch (error: any) {
      console.error('Error saving API key:', error)
      toast({
        title: "Error saving API key",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const confirmDeleteKey = (id: string) => {
    setKeyToDelete(id)
    setShowDeleteDialog(true)
  }

  const handleDeleteKey = async () => {
    if (!keyToDelete) return
    
    try {
      const result = await deleteApiKey(keyToDelete)
      
      if (result.error) {
        toast({
          title: "Error deleting API key",
          description: result.error.message,
          variant: "destructive"
        })
        return
      }
      
      toast({
        title: "API key deleted",
        description: "Your API key has been deleted successfully.",
      })
    } catch (error: any) {
      console.error('Error deleting API key:', error)
      toast({
        title: "Error deleting API key",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      })
    } finally {
      setShowDeleteDialog(false)
      setKeyToDelete(null)
    }
  }

  const handleOpenAISubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const apiKey = formData.get('openai-api-key') as string
    const model = formData.get('openai-model') as string
    const baseUrl = formData.get('openai-base-url') as string
    
    handleSaveApiKey('openai', {
      provider: 'openai',
      api_key: apiKey,
      model: model || 'gpt-4o',
      base_url: baseUrl || 'https://api.openai.com/v1'
    })
  }

  const handleAnthropicSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const apiKey = formData.get('anthropic-api-key') as string
    const model = formData.get('anthropic-model') as string
    
    handleSaveApiKey('anthropic', {
      provider: 'anthropic',
      api_key: apiKey,
      model: model || 'claude-3-opus'
    })
  }

  const handleGeminiSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const apiKey = formData.get('gemini-api-key') as string
    const model = formData.get('gemini-model') as string
    
    handleSaveApiKey('gemini', {
      provider: 'gemini',
      api_key: apiKey,
      model: model || 'gemini-pro'
    })
  }

  const handleLocalSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const endpoint = formData.get('local-endpoint') as string
    const model = formData.get('local-model') as string
    
    handleSaveApiKey('local', {
      provider: 'local',
      api_key: 'local', // Placeholder for local models
      model: model,
      base_url: endpoint
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading API keys...</span>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive" className="my-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load API keys: {error}
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">API Keys</h1>
        <p className="text-muted-foreground">
          Manage your API keys for different AI models.
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="openai">OpenAI</TabsTrigger>
          <TabsTrigger value="anthropic">Anthropic</TabsTrigger>
          <TabsTrigger value="gemini">Google Gemini</TabsTrigger>
          <TabsTrigger value="local">Local Models</TabsTrigger>
        </TabsList>
        
        <TabsContent value="openai" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>OpenAI API Key</CardTitle>
              <CardDescription>
                Add your OpenAI API key to use GPT models like GPT-4o.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {openaiKey && (
                <Alert className="mb-4 bg-green-500/10 text-green-500 border-green-500/20">
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>API Key Configured</AlertTitle>
                  <AlertDescription>
                    Your OpenAI API key is set up and ready to use.
                  </AlertDescription>
                </Alert>
              )}
              
              <form onSubmit={handleOpenAISubmit} className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="openai-api-key">API Key</Label>
                  <Input 
                    id="openai-api-key" 
                    name="openai-api-key"
                    type="password" 
                    placeholder="sk-..." 
                    defaultValue={openaiKey?.api_key || ''}
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    Your API key is stored securely and never shared.
                  </p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="openai-model">Default Model</Label>
                  <Select name="openai-model" defaultValue={openaiKey?.model || 'gpt-4o'}>
                    <SelectTrigger id="openai-model">
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                      <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                      <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="openai-base-url">Base URL (Optional)</Label>
                  <Input 
                    id="openai-base-url" 
                    name="openai-base-url"
                    type="text" 
                    placeholder="https://api.openai.com/v1" 
                    defaultValue={openaiKey?.base_url || ''}
                  />
                  <p className="text-sm text-muted-foreground">
                    Leave as default unless using a proxy or custom endpoint.
                  </p>
                </div>
                <div className="flex justify-between">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save OpenAI Settings'
                    )}
                  </Button>
                  
                  {openaiKey && (
                    <Button 
                      type="button" 
                      variant="destructive" 
                      onClick={() => confirmDeleteKey(openaiKey.id)}
                    >
                      Delete Key
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="anthropic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Anthropic API Key</CardTitle>
              <CardDescription>
                Add your Anthropic API key to use Claude models.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {anthropicKey && (
                <Alert className="mb-4 bg-green-500/10 text-green-500 border-green-500/20">
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>API Key Configured</AlertTitle>
                  <AlertDescription>
                    Your Anthropic API key is set up and ready to use.
                  </AlertDescription>
                </Alert>
              )}
              
              <form onSubmit={handleAnthropicSubmit} className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="anthropic-api-key">API Key</Label>
                  <Input 
                    id="anthropic-api-key" 
                    name="anthropic-api-key"
                    type="password" 
                    placeholder="sk-ant-..." 
                    defaultValue={anthropicKey?.api_key || ''}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="anthropic-model">Default Model</Label>
                  <Select name="anthropic-model" defaultValue={anthropicKey?.model || 'claude-3-opus'}>
                    <SelectTrigger id="anthropic-model">
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                      <SelectItem value="claude-3-sonnet">Claude 3 Sonnet</SelectItem>
                      <SelectItem value="claude-3-haiku">Claude 3 Haiku</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-between">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Anthropic Settings'
                    )}
                  </Button>
                  
                  {anthropicKey && (
                    <Button 
                      type="button" 
                      variant="destructive" 
                      onClick={() => confirmDeleteKey(anthropicKey.id)}
                    >
                      Delete Key
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="gemini" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Google Gemini API Key</CardTitle>
              <CardDescription>
                Add your Google API key to use Gemini models.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {geminiKey && (
                <Alert className="mb-4 bg-green-500/10 text-green-500 border-green-500/20">
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>API Key Configured</AlertTitle>
                  <AlertDescription>
                    Your Google Gemini API key is set up and ready to use.
                  </AlertDescription>
                </Alert>
              )}
              
              <form onSubmit={handleGeminiSubmit} className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="gemini-api-key">API Key</Label>
                  <Input 
                    id="gemini-api-key" 
                    name="gemini-api-key"
                    type="password" 
                    placeholder="AIza..." 
                    defaultValue={geminiKey?.api_key || ''}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="gemini-model">Default Model</Label>
                  <Select name="gemini-model" defaultValue={geminiKey?.model || 'gemini-pro'}>
                    <SelectTrigger id="gemini-model">
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
                      <SelectItem value="gemini-pro-vision">Gemini Pro Vision</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-between">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Gemini Settings'
                    )}
                  </Button>
                  
                  {geminiKey && (
                    <Button 
                      type="button" 
                      variant="destructive" 
                      onClick={() => confirmDeleteKey(geminiKey.id)}
                    >
                      Delete Key
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="local" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Local Model Settings</CardTitle>
              <CardDescription>
                Configure settings for locally hosted models.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {localKey && (
                <Alert className="mb-4 bg-green-500/10 text-green-500 border-green-500/20">
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>Local Model Configured</AlertTitle>
                  <AlertDescription>
                    Your local model settings are set up and ready to use.
                  </AlertDescription>
                </Alert>
              )}
              
              <form onSubmit={handleLocalSubmit} className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="local-endpoint">API Endpoint</Label>
                  <Input 
                    id="local-endpoint" 
                    name="local-endpoint"
                    type="text" 
                    placeholder="http://localhost:8000/v1" 
                    defaultValue={localKey?.base_url || ''}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="local-model">Model Name</Label>
                  <Input 
                    id="local-model" 
                    name="local-model"
                    type="text" 
                    placeholder="llama-3-70b" 
                    defaultValue={localKey?.model || ''}
                    required
                  />
                </div>
                <div className="flex justify-between">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Local Model Settings'
                    )}
                  </Button>
                  
                  {localKey && (
                    <Button 
                      type="button" 
                      variant="destructive" 
                      onClick={() => confirmDeleteKey(localKey.id)}
                    >
                      Delete Settings
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this API key? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteKey}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
