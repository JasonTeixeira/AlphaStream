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
  { name: "XGBoost", accuracy: "51.2%", sharpe: "0.42", winRate: "50.8%", signals: 12 },
  { name: "LightGBM", accuracy: "50.8%", sharpe: "0.38", winRate: "50.3%", signals: 14 },
  { name: "Random Forest", accuracy: "49.7%", sharpe: "0.31", winRate: "49.5%", signals: 15 },
  { name: "Gradient Boosting", accuracy: "50.4%", sharpe: "0.35", winRate: "50.1%", signals: 11 },
  { name: "Ensemble", accuracy: "51.5%", sharpe: "0.48", winRate: "51.2%", signals: 10 },
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
          Performance based on walk-forward validation on out-of-sample data. Past performance does not guarantee future results.
          Directional accuracy near 50% is expected for financial markets; edge comes from position sizing and risk management.
        </p>
      </div>
    </section>
  )
}
