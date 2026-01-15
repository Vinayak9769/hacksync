"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { API_ENDPOINTS, API_FETCH_OPTIONS } from "@/lib/api-config"
import { Loader2, RefreshCw, CheckCircle, XCircle } from "lucide-react"

export default function TwitterDebugPage() {
  const [loading, setLoading] = useState(false)
  const [statusData, setStatusData] = useState<any>(null)
  const [debugData, setDebugData] = useState<any>(null)
  const [cookies, setCookies] = useState<string>("")

  useEffect(() => {
    checkStatus()
    checkDebug()
    getCookies()
  }, [])

  const getCookies = () => {
    setCookies(document.cookie)
  }

  const checkStatus = async () => {
    setLoading(true)
    try {
      const response = await fetch(API_ENDPOINTS.twitter.status, {
        ...API_FETCH_OPTIONS,
      })
      const data = await response.json()
      console.log("Status response:", data)
      setStatusData(data)
    } catch (error) {
      console.error("Status check error:", error)
      setStatusData({ error: String(error) })
    } finally {
      setLoading(false)
    }
  }

  const checkDebug = async () => {
    try {
      const response = await fetch(
        API_ENDPOINTS.twitter.status.replace("/status", "/debug-session"),
        {
          ...API_FETCH_OPTIONS,
        }
      )
      const data = await response.json()
      console.log("Debug response:", data)
      setDebugData(data)
    } catch (error) {
      console.error("Debug check error:", error)
      setDebugData({ error: String(error) })
    }
  }

  const refreshAll = () => {
    checkStatus()
    checkDebug()
    getCookies()
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Twitter Debug Page</h1>
            <p className="text-muted-foreground">
              Diagnose Twitter connection and session issues
            </p>
          </div>
          <Button onClick={refreshAll} disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Refresh All
          </Button>
        </div>

        {/* Connection Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {statusData?.connected ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              Connection Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-secondary p-4 rounded-lg overflow-auto text-xs">
              {JSON.stringify(statusData, null, 2)}
            </pre>
          </CardContent>
        </Card>

        {/* Session Debug */}
        <Card>
          <CardHeader>
            <CardTitle>Session Debug Info</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-secondary p-4 rounded-lg overflow-auto text-xs">
              {JSON.stringify(debugData, null, 2)}
            </pre>
          </CardContent>
        </Card>

        {/* Browser Cookies */}
        <Card>
          <CardHeader>
            <CardTitle>Browser Cookies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Cookies currently stored in browser:
              </p>
              <pre className="bg-secondary p-4 rounded-lg overflow-auto text-xs">
                {cookies || "No cookies found"}
              </pre>
              <Button onClick={getCookies} variant="outline" size="sm">
                Refresh Cookies
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Test Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Test Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-2">
              <Button
                onClick={() => {
                  window.location.href = API_ENDPOINTS.twitter.auth
                }}
                variant="default"
              >
                Start Twitter Auth Flow
              </Button>

              <Button
                onClick={checkStatus}
                variant="outline"
              >
                Check Status Only
              </Button>

              <Button
                onClick={checkDebug}
                variant="outline"
              >
                Check Debug Session Only
              </Button>

              <Button
                onClick={() => {
                  // Clear all cookies
                  document.cookie.split(";").forEach((c) => {
                    document.cookie = c
                      .replace(/^ +/, "")
                      .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/")
                  })
                  getCookies()
                }}
                variant="destructive"
              >
                Clear Browser Cookies
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Debug Steps</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <ol className="list-decimal list-inside space-y-2">
              <li>
                <strong>Check current status:</strong> Click "Refresh All" to see current state
              </li>
              <li>
                <strong>Start auth flow:</strong> Click "Start Twitter Auth Flow" button
              </li>
              <li>
                <strong>Complete authorization:</strong> Authorize the app on Twitter
              </li>
              <li>
                <strong>Check backend logs:</strong> Look at your backend console for session logs
              </li>
              <li>
                <strong>Return here:</strong> After redirect, come back to this page
              </li>
              <li>
                <strong>Check status again:</strong> Click "Refresh All" to see if session persisted
              </li>
              <li>
                <strong>Compare Session IDs:</strong> Check if the session ID in "Session Debug Info" matches what you see in backend logs
              </li>
            </ol>

            <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded">
              <p className="font-semibold text-yellow-600 dark:text-yellow-500">⚠️ Important:</p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                <li>Check backend console for detailed session logs</li>
                <li>Verify session cookie is being set (check Network tab → Response Headers)</li>
                <li>Ensure FRONTEND_URL in backend .env matches this frontend URL</li>
                <li>Session cookie must have SameSite=None and Secure=true for cross-origin</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
