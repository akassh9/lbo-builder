'use client'

import { createContext, useContext, useState } from 'react'
import { calculateProjections, calculateCashFlows, calculateExitValue, calculateIRR, calculateMOIC, calculatePaybackPeriod, calculateDebtSchedule } from '../utils/lboCalculations'

type LBOState = {
  inputs: {
    revenue: number
    ebitda: number
    netIncome: number
    currentDebt: number
    currentCash: number
    purchasePriceMultiple: number
    equityContribution: number
    transactionFees: number
    debtEquitySplit: number
    interestRate: number
    amortizationSchedule: number
    growthRate: number
    marginImprovement: number
    capex: number
    exitYear: number
    exitMultiple: number
  }
  results: {
    irr: number
    moic: number
    paybackPeriod: number
    debtSchedule: Array<{year: number, principal: number, interest: number}>
    cashFlows: Array<{year: number, fcf: number}>
    exitValue: {
      enterpriseValue: number
      debtRepayment: number
      equityValue: number
    }
  }
}

const LBOContext = createContext<{
  state: LBOState
  updateInputs: (inputs: Partial<LBOState['inputs']>) => void
  calculateResults: () => void
} | undefined>(undefined)

export function LBOProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<LBOState>({
    inputs: {
      revenue: 0,
      ebitda: 0,
      netIncome: 0,
      currentDebt: 0,
      currentCash: 0,
      purchasePriceMultiple: 8,
      equityContribution: 30,
      transactionFees: 0,
      debtEquitySplit: 70,
      interestRate: 5,
      amortizationSchedule: 5,
      growthRate: 5,
      marginImprovement: 2,
      capex: 5,
      exitYear: 5,
      exitMultiple: 10
    },
    results: {
      irr: 0,
      moic: 0,
      paybackPeriod: 0,
      debtSchedule: [],
      cashFlows: [],
      exitValue: {
        enterpriseValue: 0,
        debtRepayment: 0,
        equityValue: 0
      }
    }
  })

  const updateInputs = (newInputs: Partial<LBOState['inputs']>) => {
    setState(prev => ({
      ...prev,
      inputs: { ...prev.inputs, ...newInputs }
    }))
  }

  const calculateResults = () => {
    const {
      revenue,
      ebitda,
      growthRate,
      marginImprovement,
      exitYear,
      exitMultiple,
      capex,
      interestRate,
      currentDebt,
      equityContribution
    } = state.inputs

    // Calculate projections
    const projections = calculateProjections({
      revenue,
      ebitda,
      growthRate,
      marginImprovement,
      exitYear
    })

    // Calculate cash flows
    const cashFlows = calculateCashFlows(projections, {
      capex,
      interestRate,
      currentDebt
    })

    // Calculate exit value
    const exitValue = calculateExitValue(
      projections[projections.length - 1].ebitda,
      exitMultiple,
      currentDebt
    )

    // Calculate debt schedule
    const debtSchedule = calculateDebtSchedule(
      currentDebt,
      interestRate,
      state.inputs.amortizationSchedule
    )

    // Calculate IRR
    const initialInvestment = -equityContribution
    const cashFlowsForIRR = [
      initialInvestment,
      ...cashFlows.map(cf => cf.fcf),
      exitValue.equityValue
    ]
    const irr = calculateIRR(cashFlowsForIRR)

    // Calculate MOIC
    const moic = calculateMOIC(equityContribution, exitValue.equityValue)

    // Calculate payback period (simplified)
    const paybackPeriod = calculatePaybackPeriod(cashFlowsForIRR)

    setState(prev => ({
      ...prev,
      results: {
        irr,
        moic,
        paybackPeriod,
        debtSchedule,
        cashFlows,
        exitValue
      }
    }))
  }

  return (
    <LBOContext.Provider value={{ state, updateInputs, calculateResults }}>
      {children}
    </LBOContext.Provider>
  )
}

export const useLBO = () => {
  const context = useContext(LBOContext)
  if (!context) throw new Error('useLBO must be used within LBOProvider')
  return context
} 