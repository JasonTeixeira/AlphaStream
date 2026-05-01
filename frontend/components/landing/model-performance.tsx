import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const models = [
  { name: "XGBoost", accuracy: "74.2%", sharpe: "1.62", winRate: "58.3%", signals: 12 },
  { name: "LightGBM", accuracy: "72.8%", sharpe: "1.48", winRate: "56.1%", signals: 14 },
  { name: "LSTM", accuracy: "71.5%", sharpe: "1.35", winRate: "54.8%", signals: 8 },
  { name: "Random Forest", accuracy: "69.3%", sharpe: "1.21", winRate: "53.2%", signals: 15 },
  { name: "Ensemble", accuracy: "73.1%", sharpe: "1.72", winRate: "59.5%", signals: 10 },
]

export function ModelPerformance() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0A0A0B]">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#FAFAFA] mb-4">Transparent Performance</h2>
          <p className="text-[#A1A1AA] max-w-2xl mx-auto">
            Every model, every metric. No black boxes.
          </p>
        </div>

        <Card className="bg-[#18181B] border-[#27272A]">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-[#27272A] bg-[#0A0A0B]">
                    <TableHead className="text-[#A1A1AA] font-semibold">Model</TableHead>
                    <TableHead className="text-[#A1A1AA] font-semibold text-right">Accuracy</TableHead>
                    <TableHead className="text-[#A1A1AA] font-semibold text-right">Sharpe Ratio</TableHead>
                    <TableHead className="text-[#A1A1AA] font-semibold text-right">Win Rate</TableHead>
                    <TableHead className="text-[#A1A1AA] font-semibold text-right">Signals/Day</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {models.map((model) => (
                    <TableRow key={model.name} className="border-[#27272A] hover:bg-[#27272A]/50">
                      <TableCell className="font-medium text-[#FAFAFA]">{model.name}</TableCell>
                      <TableCell className="text-right font-mono text-success">{model.accuracy}</TableCell>
                      <TableCell className="text-right font-mono text-teal">{model.sharpe}</TableCell>
                      <TableCell className="text-right font-mono text-[#A1A1AA]">{model.winRate}</TableCell>
                      <TableCell className="text-right font-mono text-[#A1A1AA]">{model.signals}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <p className="mt-4 text-xs text-[#71717A] text-center">
          Performance based on walk-forward validation on out-of-sample data. Past results do not guarantee future performance.
        </p>
      </div>
    </section>
  )
}
