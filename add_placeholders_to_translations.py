#!/usr/bin/env python3
"""
Add placeholder values to translation JSON files based on the script's output.
"""

import json
import os
from pathlib import Path

BASE_DIR = Path("/Users/raedtayyem/Desktop/work/alathasiba-claudecode")
LOCALES_DIR = BASE_DIR / "public/locales"

# Mapping of namespace to placeholders
# Format: namespace: {field_name: value}
placeholders_data = {
    "calc/electrical": {
        "efficiency": "90",
        "voltage": "380",
        "targetPF": "0.95",
        "frequency": "50",
        "powerFactor": "0.9",
        "loadPower": "0",
        "loadCount": "1",
        "efficiency1": "1",
    },
    "calc/real-estate": {
        "homePrice": "300000",
        "downPaymentPercent": "20",
        "interestRate": "6.5",
        "loanTermYears": "30",
        "propertyTaxRate": "1.2",
        "homeInsurance": "1200",
        "hoaFees": "0",
        "maintenanceRate": "1",
        "homeAppreciationRate": "3",
        "monthlyRent": "1500",
        "rentIncreaseRate": "3",
        "rentersInsurance": "180",
        "investmentReturnRate": "7",
        "purchasePrice": "300000",
        "loanAmount": "240000",
        "titleFee": "1000",
        "appraisalFee": "400",
        "attorneyFee": "1000",
        "recordingFee": "200",
        "transferTaxRate": "1.0",
        "lenderFeePercent": "1.0",
        "currentBalance": "200000",
        "currentRate": "6.5",
        "currentPayment": "1264",
        "newRate": "5.0",
        "closingCosts": "3000",
        "remainingYears": "25",
        "monthlyIncome": "2000",
        "purchasePrice1": "250000",
        "monthlyRentalIncome": "1500",
        "annualIncome": "18000",
        "homeValue": "300000",
        "mortgageBalance": "200000",
        "monthlyRent1": "1200",
    },
    "calc/health": {
        "distance": "1000",
        "time": "15",
        "strokeRate": "30",
        "weight": "70",
        "age": "30",
        "protein": "150",
        "waist": "85",
        "hip": "95",
    },
    "calc/fitness": {
        "currentWeight": "90",
        "targetWeight": "80",
        "distance1": "5",
        "hours": "0",
        "minutes": "30",
        "seconds": "0",
    },
    "calc/education": {
        "totalClasses": "30",
        "totalPoints": "100",
        "earnedPoints": "85",
        "currentGrade": "88",
        "currentWeight": "70",
        "finalWeight": "30",
        "desiredGrade": "90",
    },
    "calc/business": {
        "unitPrice": "25",
        "quantity": "100",
        "currentSalary": "50000",
        "contribution": "6",
        "employerMatch": "3",
    },
    "calc/math": {
        "rows": "2",
        "cols": "2",
        "real": "0",
        "imaginary": "0",
        "numerator": "1",
        "denominator": "2",
        "base": "10",
        "value": "100",
        "angle": "45",
    },
    "calc/science": {
        "initialAmount": "100",
        "halfLife": "5730",
        "elapsedTime": "10000",
    },
    "calc/statistics": {
        "confidenceLevel": "95",
        "proportion": "0.5",
        "successfulOutcomes": "6",
    },
    "calc/automotive": {
        "ratio": "3.73",
    },
    "calc/finance": {
        "cashAmount": "100000",
        "goldWeight": "100",
        "goldPrice": "60",
    },
    "calc/construction": {
        "length": "10",
        "height": "3",
    },
    "calc/astronomy": {
        "focalLength": "1000",
    },
    "calc/pet": {
        "length1": "100",
        "width": "50",
        "height1": "50",
    },
    "calc/geometry": {
        "numPoints": "4",
    },
    "calc/physics": {
        "mass": "10",
        "velocity": "5",
    }
}

def add_placeholders_to_file(json_file, placeholders):
    """Add placeholders to a translation JSON file."""
    try:
        with open(json_file, 'r', encoding='utf-8') as f:
            data = json.load(f)

        # Add placeholders at top level
        if 'placeholders' not in data:
            data['placeholders'] = {}

        # Update placeholders
        data['placeholders'].update(placeholders)

        # Write back
        with open(json_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)

        print(f"✓ Updated {json_file}")
        return True
    except Exception as e:
        print(f"✗ Error updating {json_file}: {e}")
        return False

def main():
    print("Adding placeholders to translation files...")
    print("=" * 60)

    for namespace, placeholders in placeholders_data.items():
        # Extract the file path from namespace
        # calc/electrical -> electrical.json
        ns_parts = namespace.split('/')
        if len(ns_parts) > 1:
            file_name = ns_parts[-1] + '.json'
        else:
            file_name = namespace + '.json'

        # Update both EN and AR
        for lang in ['en', 'ar']:
            json_file = LOCALES_DIR / lang / 'calc' / file_name

            if json_file.exists():
                add_placeholders_to_file(json_file, placeholders)
            else:
                print(f"⚠ File not found: {json_file}")

    print("\n" + "=" * 60)
    print("Done!")

if __name__ == "__main__":
    main()
