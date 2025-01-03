'use client'

import { useLBO } from '@/context/LBOContext'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function InputPage() {
  const { state, updateInputs } = useLBO()
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    updateInputs({ [name]: parseFloat(value) })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push('/output')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Input Parameters</h1>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Revenue ($M)"
            name="revenue"
            value={state.inputs.revenue}
            onChange={handleInputChange}
          />
          <InputField
            label="EBITDA ($M)"
            name="ebitda"
            value={state.inputs.ebitda}
            onChange={handleInputChange}
          />
          <InputField
            label="Purchase Price Multiple"
            name="purchasePriceMultiple"
            value={state.inputs.purchasePriceMultiple}
            onChange={handleInputChange}
          />
          <InputField
            label="Equity Contribution (%)"
            name="equityContribution"
            value={state.inputs.equityContribution}
            onChange={handleInputChange}
          />
          <InputField
            label="Interest Rate (%)"
            name="interestRate"
            value={state.inputs.interestRate}
            onChange={handleInputChange}
          />
          <InputField
            label="Growth Rate (%)"
            name="growthRate"
            value={state.inputs.growthRate}
            onChange={handleInputChange}
          />
          <InputField
            label="Exit Year"
            name="exitYear"
            value={state.inputs.exitYear}
            onChange={handleInputChange}
          />
          <InputField
            label="Exit Multiple"
            name="exitMultiple"
            value={state.inputs.exitMultiple}
            onChange={handleInputChange}
          />
        </div>
        <Button type="submit" className="w-full">Calculate Results</Button>
      </form>
    </div>
  )
}

function InputField({ 
  label, 
  name, 
  value, 
  onChange 
}: { 
  label: string
  name: string
  value: number
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void 
}) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        type="number"
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-md border border-gray-300 px-3 py-2"
        step="any"
      />
    </div>
  )
} 