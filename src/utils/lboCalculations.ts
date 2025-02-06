interface Projection {
  year: number;
  revenue: number;
  ebitda: number;
}

interface CashFlow {
  year: number;
  fcf: number;
}

interface ExitValue {
  enterpriseValue: number;
  debtRepayment: number;
  equityValue: number;
}

interface DebtScheduleEntry {
  year: number;
  principal: number;
  interest: number;
}

export function calculateProjections({ 
  revenue, 
  ebitda, 
  growthRate, 
  marginImprovement, 
  exitYear 
}: {
  revenue: number;
  ebitda: number;
  growthRate: number;
  marginImprovement: number;
  exitYear: number;
}): Projection[] {
  const initialMargin = ebitda / revenue;
  
  return Array.from({ length: exitYear }, (_, i) => {
    const projectedRevenue = revenue * Math.pow(1 + growthRate / 100, i);
    const projectedMargin = initialMargin + (marginImprovement / 100 * i);
    
    return {
      year: i + 1,
      revenue: projectedRevenue,
      ebitda: projectedRevenue * projectedMargin
    };
  });
}

export function calculateCashFlows(
  projections: Projection[], 
  { capex, interestRate, currentDebt }: {
    capex: number;
    interestRate: number;
    currentDebt: number;
  }
): CashFlow[] {
  const taxRate = 0.21; // Standard corporate tax rate
  return projections.map((p, i) => {
    const interestExpense = currentDebt * (interestRate / 100);
    const taxableIncome = p.ebitda - interestExpense;
    const taxes = Math.max(0, taxableIncome * taxRate);
    const workingCapital = p.revenue * 0.1; // Assume 10% of revenue for working capital
    
    return {
      year: i + 1,
      fcf: p.ebitda * (1 - capex / 100) - taxes - workingCapital - interestExpense
    };
  });
}

export function calculateExitValue(
  finalEbitda: number, 
  exitMultiple: number, 
  currentDebt: number
): ExitValue {
  const enterpriseValue = finalEbitda * exitMultiple;
  const netWorkingCapital = finalEbitda * 0.1; // Assume 10% of EBITDA
  const grossValue = enterpriseValue + netWorkingCapital;
  
  return {
    enterpriseValue: grossValue,
    debtRepayment: currentDebt,
    equityValue: grossValue - currentDebt
  };
}

export function calculateDebtSchedule(
  currentDebt: number, 
  interestRate: number, 
  amortizationSchedule: number
): DebtScheduleEntry[] {
  const yearlyPrincipalPayment = currentDebt / amortizationSchedule;
  let remainingDebt = currentDebt;
  
  return Array.from({ length: amortizationSchedule }, (_, i) => {
    const interest = remainingDebt * (interestRate / 100);
    const principal = yearlyPrincipalPayment;
    remainingDebt -= principal;
    
    return {
      year: i + 1,
      principal,
      interest
    };
  });
}

export function calculateIRR(cashFlows: number[]): number {
  const maxIterations = 1000;
  const tolerance = 0.000001;
  let guess = 0.1;

  for (let i = 0; i < maxIterations; i++) {
    const npv = cashFlows.reduce((acc, cf, index) => {
      return acc + cf / Math.pow(1 + guess, index);
    }, 0);

    if (Math.abs(npv) < tolerance) {
      return guess * 100; // Convert to percentage
    }

    // Adjust guess based on NPV
    guess = guess - npv / cashFlows.reduce((acc, cf, index) => {
      return acc - (index * cf) / Math.pow(1 + guess, index + 1);
    }, 0);
  }

  return 0; // Return 0 if no solution found
}

export function calculateMOIC(initialEquity: number, exitEquity: number): number {
  // Implementation here
  return exitEquity / initialEquity;
}

export function calculatePaybackPeriod(cashFlows: number[]): number {
  let cumulativeCashFlow = 0;
  const initialInvestment = Math.abs(cashFlows[0]);

  for (let i = 1; i < cashFlows.length; i++) {
    cumulativeCashFlow += cashFlows[i];
    if (cumulativeCashFlow >= initialInvestment) {
      // Calculate fractional year
      const previousCF = cumulativeCashFlow - cashFlows[i];
      const fraction = (initialInvestment - previousCF) / cashFlows[i];
      return i - 1 + fraction;
    }
  }

  return cashFlows.length; // Return total period if payback not achieved
}