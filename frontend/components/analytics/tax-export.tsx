"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Download, FileSpreadsheet, FileText, Calendar } from "lucide-react"
import { toast } from "sonner"

export function TaxExport() {
  const [year, setYear] = useState("2024")
  const [format, setFormat] = useState("csv")

  const handleExport = () => {
    toast.success(`Generating ${year} tax report in ${format.toUpperCase()} format...`)
    setTimeout(() => {
      toast.success("Tax report downloaded successfully!")
    }, 2000)
  }

  return (
    <Card className="bg-[#18181B] border-[#27272A]">
      <CardHeader>
        <div className="flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5 text-teal" />
          <CardTitle className="text-lg text-[#FAFAFA]">Tax Export</CardTitle>
        </div>
        <CardDescription className="text-[#71717A]">
          Generate reports for tax filing purposes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-[#FAFAFA]">Tax Year</Label>
            <Select value={year} onValueChange={setYear}>
              <SelectTrigger className="bg-[#0A0A0B] border-[#27272A] text-[#FAFAFA]">
                <Calendar className="mr-2 h-4 w-4 text-[#71717A]" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#18181B] border-[#27272A]">
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-[#FAFAFA]">Format</Label>
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger className="bg-[#0A0A0B] border-[#27272A] text-[#FAFAFA]">
                <FileText className="mr-2 h-4 w-4 text-[#71717A]" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#18181B] border-[#27272A]">
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="xlsx">Excel</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="p-3 bg-[#0A0A0B] rounded-lg border border-[#27272A]">
          <h4 className="text-sm font-medium text-[#FAFAFA] mb-2">Report includes:</h4>
          <ul className="text-sm text-[#A1A1AA] space-y-1">
            <li>All realized gains and losses</li>
            <li>Cost basis calculations</li>
            <li>Wash sale adjustments</li>
            <li>Schedule D compatible format</li>
          </ul>
        </div>

        <Button 
          onClick={handleExport}
          className="w-full bg-teal hover:bg-teal/90 text-[#09090B]"
        >
          <Download className="mr-2 h-4 w-4" />
          Generate Tax Report
        </Button>
      </CardContent>
    </Card>
  )
}
