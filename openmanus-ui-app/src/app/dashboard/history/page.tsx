'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"

export default function Page() {
  const [searchQuery, setSearchQuery] = useState("")
  
  // Mock history data - in a real app, this would come from Supabase
  const mockHistory = [
    {
      id: "hist_1",
      timestamp: "2025-03-19T15:30:00Z",
      prompt: "Create a landing page for a SaaS product",
      model: "gpt-4o",
      status: "completed"
    },
    {
      id: "hist_2",
      timestamp: "2025-03-18T12:45:00Z",
      prompt: "Write a blog post about AI ethics",
      model: "claude-3-opus",
      status: "completed"
    },
    {
      id: "hist_3",
      timestamp: "2025-03-17T09:15:00Z",
      prompt: "Generate a Python script to analyze CSV data",
      model: "gpt-4o",
      status: "completed"
    },
    {
      id: "hist_4",
      timestamp: "2025-03-16T18:20:00Z",
      prompt: "Design a database schema for an e-commerce platform",
      model: "gemini-pro",
      status: "completed"
    },
    {
      id: "hist_5",
      timestamp: "2025-03-15T14:10:00Z",
      prompt: "Create a React component for a file upload feature",
      model: "gpt-4o",
      status: "completed"
    }
  ]
  
  const filteredHistory = searchQuery 
    ? mockHistory.filter(item => 
        item.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.model.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : mockHistory

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">History</h1>
        <p className="text-muted-foreground">
          View your past interactions with OpenManus.
        </p>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="grid flex-1 gap-2">
          <Label htmlFor="search" className="sr-only">Search</Label>
          <Input
            id="search"
            placeholder="Search by prompt or model..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" onClick={() => setSearchQuery("")}>Clear</Button>
      </div>
      
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="gpt">GPT Models</TabsTrigger>
          <TabsTrigger value="claude">Claude Models</TabsTrigger>
          <TabsTrigger value="gemini">Gemini Models</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          {filteredHistory.length > 0 ? (
            <div className="grid gap-4">
              {filteredHistory.map((item) => (
                <HistoryCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <p>No history found matching your search.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="gpt" className="space-y-4">
          {filteredHistory.filter(item => item.model.includes('gpt')).length > 0 ? (
            <div className="grid gap-4">
              {filteredHistory
                .filter(item => item.model.includes('gpt'))
                .map((item) => (
                  <HistoryCard key={item.id} item={item} />
                ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <p>No GPT model history found matching your search.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="claude" className="space-y-4">
          {filteredHistory.filter(item => item.model.includes('claude')).length > 0 ? (
            <div className="grid gap-4">
              {filteredHistory
                .filter(item => item.model.includes('claude'))
                .map((item) => (
                  <HistoryCard key={item.id} item={item} />
                ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <p>No Claude model history found matching your search.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="gemini" className="space-y-4">
          {filteredHistory.filter(item => item.model.includes('gemini')).length > 0 ? (
            <div className="grid gap-4">
              {filteredHistory
                .filter(item => item.model.includes('gemini'))
                .map((item) => (
                  <HistoryCard key={item.id} item={item} />
                ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <p>No Gemini model history found matching your search.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function HistoryCard({ item }: { item: any }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-base">{item.prompt}</CardTitle>
            <CardDescription>
              {new Date(item.timestamp).toLocaleString()}
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-md">
              {item.model}
            </span>
            <span className={`text-xs px-2 py-1 rounded-md ${
              item.status === 'completed' 
                ? 'bg-green-500/20 text-green-500' 
                : 'bg-amber-500/20 text-amber-500'
            }`}>
              {item.status}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" size="sm">View</Button>
          <Button variant="outline" size="sm">Reuse</Button>
        </div>
      </CardContent>
    </Card>
  )
}
