"use client"

import React, { useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Download, 
  FileText, 
  Loader2, 
  Target, 
  Users, 
  Calendar,
  TrendingUp,
  Megaphone,
  CheckCircle2,
  Copy,
  Check
} from "lucide-react"

interface MarketingPlanViewerProps {
  plan: string
  brandName?: string
  campaignName?: string
}

export function MarketingPlanViewer({ plan, brandName, campaignName }: MarketingPlanViewerProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const [isExporting, setIsExporting] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleExportPDF = async () => {
    if (!contentRef.current) return
    
    setIsExporting(true)
    
    try {
      // Dynamic import for client-side only
      const html2canvas = (await import('html2canvas')).default
      const { jsPDF } = await import('jspdf')
      
      const element = contentRef.current
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      })
      
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })
      
      const imgWidth = 210 // A4 width in mm
      const pageHeight = 297 // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight
      let position = 0
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }
      
      const fileName = `${campaignName || brandName || 'marketing'}-plan-${new Date().toISOString().split('T')[0]}.pdf`
      pdf.save(fileName)
    } catch (error) {
      console.error('PDF export failed:', error)
    } finally {
      setIsExporting(false)
    }
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(plan)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-4">
      {/* Action Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {brandName && <Badge variant="outline">{brandName}</Badge>}
          {campaignName && <Badge variant="secondary">{campaignName}</Badge>}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleCopy}>
            {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
            {copied ? 'Copied!' : 'Copy'}
          </Button>
          <Button onClick={handleExportPDF} disabled={isExporting}>
            {isExporting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Plan Content */}
      <div 
        ref={contentRef} 
        className="bg-white dark:bg-gray-900 rounded-lg p-4 md:p-6 overflow-x-hidden"
        style={{ colorScheme: 'light' }}
      >
        {/* Header */}
        <div className="text-center mb-8 pb-6 border-b">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Megaphone className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
            {campaignName || 'Marketing Campaign Plan'}
          </h1>
          {brandName && (
            <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">for {brandName}</p>
          )}
          <p className="text-sm text-gray-500 mt-2">
            Generated on {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        {/* Markdown Content with Custom Styling */}
        <div className="prose prose-sm prose-gray dark:prose-invert max-w-none overflow-hidden break-words
          prose-headings:text-gray-900 dark:prose-headings:text-gray-100
          prose-h1:text-xl prose-h1:font-bold prose-h1:border-b prose-h1:pb-2 prose-h1:mb-4
          prose-h2:text-lg prose-h2:font-semibold prose-h2:mt-6 prose-h2:mb-3 prose-h2:flex prose-h2:items-center prose-h2:gap-2
          prose-h3:text-base prose-h3:font-medium prose-h3:mt-4 prose-h3:mb-2
          prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-p:my-2
          prose-ul:my-3 prose-li:my-0.5
          prose-strong:text-gray-900 dark:prose-strong:text-gray-100
          prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-primary/5 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:italic prose-blockquote:my-3
          prose-table:w-full prose-table:text-sm
          prose-th:bg-gray-100 dark:prose-th:bg-gray-800 prose-th:p-2 prose-th:text-left prose-th:font-medium
          prose-td:p-2 prose-td:border prose-td:border-gray-200 dark:prose-td:border-gray-700
        ">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => (
                <h1 className="flex items-center gap-2">
                  <Target className="h-6 w-6 text-primary flex-shrink-0" />
                  {children}
                </h1>
              ),
              h2: ({ children }) => {
                // Determine icon based on heading content
                const text = String(children).toLowerCase()
                let Icon = FileText
                if (text.includes('objective') || text.includes('goal')) Icon = Target
                else if (text.includes('audience') || text.includes('target')) Icon = Users
                else if (text.includes('timeline') || text.includes('schedule') || text.includes('calendar')) Icon = Calendar
                else if (text.includes('metric') || text.includes('kpi') || text.includes('success')) Icon = TrendingUp
                else if (text.includes('channel') || text.includes('strategy')) Icon = Megaphone
                
                return (
                  <h2 className="flex items-center gap-2 border-b pb-2">
                    <Icon className="h-5 w-5 text-primary flex-shrink-0" />
                    {children}
                  </h2>
                )
              },
              ul: ({ children }) => (
                <ul className="space-y-2 list-none pl-0">
                  {children}
                </ul>
              ),
              li: ({ children }) => (
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                  <span>{children}</span>
                </li>
              ),
              table: ({ children }) => (
                <div className="overflow-x-auto my-4">
                  <table className="w-full border-collapse border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                    {children}
                  </table>
                </div>
              ),
              th: ({ children }) => (
                <th className="bg-gray-100 dark:bg-gray-800 px-4 py-2 text-left font-semibold border border-gray-200 dark:border-gray-700">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="px-4 py-2 border border-gray-200 dark:border-gray-700">
                  {children}
                </td>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-primary bg-primary/5 py-3 px-4 my-4 rounded-r-lg">
                  {children}
                </blockquote>
              ),
              code: ({ children }) => (
                <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm">
                  {children}
                </code>
              ),
            }}
          >
            {plan}
          </ReactMarkdown>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t text-center">
          <p className="text-sm text-gray-500">
            Generated by NestGPT • SocialNest Marketing Platform
          </p>
        </div>
      </div>
    </div>
  )
}
