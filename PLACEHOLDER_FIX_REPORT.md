# Hardcoded Placeholder Fix Report

## Summary
- **Total placeholders to fix**: 146
- **Total files**: 58
- **Completed**: 13 placeholders in 2 files
- **Remaining**: 133 placeholders in 56 files

## Completed Files ✓

### 1. finance/LoanCalculator.tsx (3 placeholders) ✓
- Translation namespace: `calc/finance`
- Fixed placeholders:
  - principal: "10000"
  - annualRate: "5"
  - years: "5"
- Translation files updated: ✓ EN, ✓ AR

### 2. automotive/CarMaintenanceCalculator.tsx (10 placeholders) ✓
- Translation namespace: `calc/automotive`
- Fixed placeholders:
  - oil_interval: "5000"
  - oil_cost: "50"
  - tire_interval: "50000"
  - tire_cost: "600"
  - brake_interval: "40000"
  - brake_cost: "400"
  - filter_interval: "15000"
  - filter_cost: "100"
  - fluid_interval: "30000"
  - fluid_cost: "200"
- Translation files updated: ✓ EN, ✓ AR

---

## Remaining Files (by Category)

### ELECTRICAL CALCULATORS (16 placeholders in 8 files)

1. **BatteryLifeCalculator.tsx** (1 placeholder)
   - Line 84: placeholder="90" → efficiency

2. **LEDResistorCalculator.tsx** (1 placeholder)
   - Line 129: placeholder="1" → (need to check field name)

3. **PowerFactorCalculator.tsx** (3 placeholders)
   - Line 108: placeholder="0.95"
   - Line 120: placeholder="380"
   - Line 131: placeholder="50"

4. **MotorCalculator.tsx** (3 placeholders)
   - Line 106: placeholder="220, 380, 400"
   - Line 117: placeholder="80-95"
   - Line 129: placeholder="0.8-0.9"

5. **ElectricityBillCalculator.tsx** (2 placeholders)
   - Line 91: placeholder="0.18-0.30"
   - Line 113: placeholder="15"

6. **ElectricalLoadCalculator.tsx** (4 placeholders)
   - Line 109: placeholder="220"
   - Line 121: placeholder="0.9"
   - Line 149: placeholder="0"
   - Line 159: placeholder="1"

7. **InrushCurrentCalculator.tsx** (1 placeholder)
   - Line 120: placeholder="380"

8. **ThreePhaseCalculator.tsx** (1 placeholder)
   - Line 131: placeholder="0.85"

### REAL ESTATE CALCULATORS (43 placeholders in 10 files)

1. **RentVsBuyCalculator.tsx** (13 placeholders)
2. **RefinanceCalculator.tsx** (6 placeholders)
3. **ClosingCostCalculator.tsx** (8 placeholders)
4. **RentalYieldCalculator.tsx** (3 placeholders)
5. **CapRateCalculator.tsx** (3 placeholders)
6. **PropertyTaxCalculator.tsx** (3 placeholders)
7. **HomeEquityCalculator.tsx** (2 placeholders)
8. **DownPaymentCalculator.tsx** (2 placeholders)
9. **VacancyRateCalculator.tsx** (2 placeholders)
10. **SecurityDepositCalculator.tsx** (1 placeholder)

### HEALTH/FITNESS CALCULATORS (12 placeholders in 6 files)

1. **SwimmingPaceCalculator.tsx** (3 placeholders)
2. **MacroCalculator.tsx** (3 placeholders)
3. **WaistToHipRatioCalculator.tsx** (2 placeholders)
4. **WeightGainCalculator.tsx** (2 placeholders) - health folder
5. **CyclingPowerCalculator.tsx** (1 placeholder) - health folder
6. **fitness/WeightGainCalculator.tsx** (1 placeholder) - fitness folder
7. **fitness/CyclingPowerCalculator.tsx** (1 placeholder) - fitness folder
8. **fitness/RunningPaceCalculator.tsx** (2 placeholders)
9. **fitness/WeightLossTimeCalculator.tsx** (1 placeholder)

### EDUCATION CALCULATORS (9 placeholders in 4 files)

1. **AttendanceCalculator.tsx** (3 placeholders)
2. **FinalGradeCalculator.tsx** (3 placeholders)
3. **TestScoreCalculator.tsx** (2 placeholders)
4. **GPACalculator.tsx** (1 placeholder)

### BUSINESS CALCULATORS (5 placeholders in 2 files)

1. **BulkPricingCalculator.tsx** (2 placeholders)
2. **FourOhOneKCalculator.tsx** (3 placeholders)

### MATH CALCULATORS (16 placeholders in 6 files)

1. **MatrixCalculator.tsx** (4 placeholders)
2. **ComplexNumbersCalculator.tsx** (4 placeholders)
3. **FractionCalculator.tsx** (4 placeholders)
4. **LogarithmCalculator.tsx** (2 placeholders)
5. **TrigonometryCalculator.tsx** (1 placeholder)
6. **ScientificCalculator.tsx** (1 placeholder)

### SCIENCE CALCULATORS (3 placeholders in 1 file)

1. **HalfLifeCalculator.tsx** (3 placeholders)

### STATISTICS CALCULATORS (4 placeholders in 3 files)

1. **SampleSizeCalculator.tsx** (2 placeholders)
2. **ConfidenceIntervalCalculator.tsx** (1 placeholder)
3. **ProbabilityCalculator.tsx** (1 placeholder)

### AUTOMOTIVE CALCULATORS (1 placeholder in 1 file)

1. **GearRatioCalculator.tsx** (1 placeholder)

### FINANCE CALCULATORS (3 placeholders in 1 file)

1. **ZakatCalculator.tsx** (3 placeholders)

### CONSTRUCTION CALCULATORS (2 placeholders in 1 file)

1. **WallAreaCalculator.tsx** (2 placeholders)

### ASTRONOMY CALCULATORS (1 placeholder in 1 file)

1. **TelescopeMagnificationCalculator.tsx** (1 placeholder)

### PET CALCULATORS (4 placeholders in 2 files)

1. **AquariumCalculator.tsx** (3 placeholders)
2. **BirdCageSizeCalculator.tsx** (1 placeholder)

### DATE-TIME CALCULATORS (1 placeholder in 1 file)

1. **UnixTimestampConverter.tsx** (1 placeholder)

### CALENDAR CONVERTERS (3 placeholders in 2 files)

1. **YazidiCalendar.tsx** (2 placeholders)
2. **SamaritanCalendarConverter.tsx** (2 placeholders)
3. **CopticToGregorian.tsx** (1 placeholder)

### GEOMETRY CALCULATORS (1 placeholder in 1 file)

1. **BezierCurveCalculator.tsx** (1 placeholder)

### PHYSICS CALCULATORS (2 placeholders in 1 file)

1. **EnergyCalculator.tsx** (2 placeholders)

### MISC CALCULATORS (1 placeholder in 1 file)

1. **inheritance-calculator/index.tsx** (1 placeholder)

---

## Implementation Pattern

For each file, follow these steps:

### 1. Read the calculator file
```typescript
// Find the useTranslation line to get namespace
const { t } = useTranslation('calc/category');
```

### 2. Update TypeScript file
Replace:
```typescript
<NumberInput placeholder="10000" />
```
With:
```typescript
<NumberInput placeholder={t('calculator.placeholders.fieldName')} />
```

### 3. Update EN translation file
Add to `/public/locales/en/calc/category.json`:
```json
{
  "calculator": {
    "placeholders": {
      "fieldName": "10000"
    }
  }
}
```

### 4. Update AR translation file
Add to `/public/locales/ar/calc/category.json`:
```json
{
  "calculator": {
    "placeholders": {
      "fieldName": "10000"
    }
  }
}
```

---

## Progress Tracking

- [x] finance/LoanCalculator.tsx (3)
- [x] automotive/CarMaintenanceCalculator.tsx (10)
- [ ] Electrical calculators (16)
- [ ] Real estate calculators (43)
- [ ] Health/Fitness calculators (12)
- [ ] Education calculators (9)
- [ ] Business calculators (5)
- [ ] Math calculators (16)
- [ ] Science calculators (3)
- [ ] Statistics calculators (4)
- [ ] Other categories (22)

**Total Progress: 13/146 (8.9%)**
