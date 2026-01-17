# Calculator Expansion Plan

The following categories require additional calculators to meet the minimum threshold of 10 calculators per category.

## Summary of Needs

| Category | Current Count | Target | Needed |
|----------|---------------|--------|--------|
| Cooking | 9 | 10 | 1 |
| Education | 2 | 10 | 8 |
| Engineering | 3 | 10 | 7 |
| Geometry | 7 | 10 | 3 |
| Health | 7 | 10 | 3 |
| Misc | 5 | 10 | 5 |
| Physics | 8 | 10 | 2 |
| Statistics | 3 | 10 | 7 |
| Science | 0 | 10 | 10 |
| Astronomy | 0 | 10 | 10 |
| **Total** | | | **56** |

## Detailed Calculator List

### Cooking (+1)
1. **Recipe Cost Calculator**: Calculate total cost of a recipe based on ingredients.

### Education (+8)
1. **GPA Calculator**: Calculate Grade Point Average.
2. **Final Grade Calculator**: Calculate what grade is needed on the final exam.
3. **Semester Grade Calculator**: Weighted average calculator for semester grades.
4. **Attendance Calculator**: Track attendance percentage.
5. **Test Score Calculator**: Calculate percentage from score.
6. **Assignment Tracker**: Simple list/tracker for assignments (or grade weight calc).
7. **Study Time Calculator**: Estimate study time needed based on credits.
8. **Reading Speed Calculator**: Words per minute calculator.

### Engineering (+7)
1. **Ohm's Law Calculator**: Voltage, Current, Resistance.
2. **Resistor Color Code**: 4 and 5 band resistor values.
3. **Beam Deflection**: Simple beam deflection calculation.
4. **Gear Ratio Calculator**: Input/Output gear teeth.
5. **Hydraulic Cylinder Calculator**: Force, Area, Pressure.
6. **Concrete Volume Calculator**: Slabs, footings, columns.
7. **Flow Rate Calculator**: Fluid flow rate.

### Geometry (+3)
1. **Circle Calculator**: Area, Circumference, Diameter.
2. **Triangle Calculator**: Area, Perimeter (Heron's formula).
3. **Cylinder Calculator**: Volume, Surface Area.

### Health (+3)
1. **BMR Calculator**: Basal Metabolic Rate (Harris-Benedict).
2. **TDEE Calculator**: Total Daily Energy Expenditure.
3. **Ideal Weight Calculator**: Robinson, Miller, Devine formulas.

### Misc (+5)
1. **Age Calculator**: Exact age in years, months, days.
2. **Date Difference**: Days between two dates.
3. **Time Calculator**: Add/Subtract time durations.
4. **Random Number Generator**: Min/Max range.
5. **Password Generator**: Secure password creation.

### Physics (+2)
1. **Speed Distance Time**: Basic kinematics.
2. **Force Calculator**: Newton's Second Law (F=ma).

### Statistics (+7)
1. **Mean Median Mode**: Descriptive statistics.
2. **Standard Deviation**: Population and Sample.
3. **Probability Calculator**: Simple probability events.
4. **Sample Size Calculator**: For surveys/studies.
5. **Z-Score Calculator**: Standard score calculation.
6. **Correlation Coefficient**: Pearson r.
7. **Permutation & Combination**: nPr and nCr.

### Science (+10)
1. **Density Calculator**: Mass/Volume.
2. **Molar Mass Calculator**: Chemistry molecular weight.
3. **pH Calculator**: H+ concentration to pH.
4. **Kinetic Energy**: 0.5 * mv^2.
5. **Potential Energy**: mgh.
6. **Half Life Calculator**: Radioactive decay.
7. **Periodic Table Lookup**: Element properties.
8. **Chemical Equation Balancer**: Stoichiometry tool.
9. **Molecular Weight**: Sum of atomic weights.
10. **Pressure Converter**: Pa, atm, bar, psi.

### Astronomy (+10)
1. **Light Year Converter**: Light years to km/miles.
2. **Planet Gravity Calculator**: Weight on other planets.
3. **Star Distance Calculator**: Parallax method.
4. **Telescope Magnification**: Focal length ratio.
5. **Orbital Period Calculator**: Kepler's Third Law.
6. **Escape Velocity**: v = sqrt(2GM/R).
7. **Sun Angle Calculator**: Elevation based on date/lat.
8. **Moon Phase**: Current phase calculation.
9. **Cosmological Redshift**: Doppler shift.
10. **Age on Other Planets**: Orbital years conversion.

## Execution Strategy

1. Create a generic `Calculator` component template.
2. Implement logic for each calculator in `src/utils/calculations`.
3. Create calculator component files in `src/components/calculators/<category>/`.
4. Register new calculators in `src/data/calculators/<category>Calculators.ts`.
5. Ensure translation keys are added to `public/locales`.

