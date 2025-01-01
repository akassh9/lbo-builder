'use client'

import { useLBO } from '@/context/LBOContext'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'

export default function OutputPage() {
  const { state, calculateResults } = useLBO()
  const router = useRouter()

  useEffect(() => {
    calculateResults()
  }, [calculateResults])

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(num)
  }

  const formatPercentage = (num: number) => {
    return `${num.toFixed(1)}%`
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Results</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <ResultCard
          title="IRR"
          value={formatPercentage(state.results.irr)}
        />
        <ResultCard
          title="MOIC"
          value={state.results.moic.toFixed(2) + 'x'}
        />
        <ResultCard
          title="Enterprise Value"
          value={formatCurrency(state.results.exitValue.enterpriseValue)}
        />
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Cash Flows</h2>
        <LineChart
          width={800}
          height={400}
          data={state.results.cashFlows}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="fcf" stroke="#8884d8" name="Free Cash Flow" />
        </LineChart>
      </div>

      <Button
        onClick={() => router.push('/input')}
        variant="outline"
        className="mr-4"
      >
        Back to Inputs
      </Button>
    </div>
  )
}

function ResultCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      <p className="text-3xl font-bold text-blue-600">{value}</p>
    </div>
  )
} 