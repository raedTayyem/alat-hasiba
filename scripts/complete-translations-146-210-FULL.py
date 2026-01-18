#!/usr/bin/env python3
"""
Complete ALL translations for calculators 146-210
This is a comprehensive script that adds every missing translation key
"""

import json
import os
from pathlib import Path

# Base paths
BASE_DIR = Path("/Users/raedtayyem/Desktop/work/alathasiba-claudecode")
EN_FILE = BASE_DIR / "public/locales/en/translation.json"
AR_FILE = BASE_DIR / "public/locales/ar/translation.json"

def load_json(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_json(filepath, data):
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"✓ Saved {filepath}")

def merge_translations(base, updates):
    for key, value in updates.items():
        if isinstance(value, dict) and key in base and isinstance(base[key], dict):
            merge_translations(base[key], value)
        else:
            base[key] = value

# Comprehensive English translations for calculators 146-210
FULL_TRANSLATIONS_EN = {
    "calc/business": {
        # Calculator 146: franchise-calculator
        "franchise": {
            "inputs": {
                "franchise_fee": "Franchise Fee",
                "franchise_fee_tooltip": "Initial franchise fee payment",
                "franchise_fee_placeholder": "Enter franchise fee",
                "royalty_rate": "Royalty Rate (%)",
                "royalty_rate_tooltip": "Ongoing royalty as % of revenue",
                "royalty_rate_placeholder": "Enter percentage",
                "advertising_fee": "Advertising Fee (%)",
                "advertising_fee_tooltip": "Marketing fee as % of revenue",
                "advertising_fee_placeholder": "Enter percentage",
                "initial_investment": "Initial Investment",
                "initial_investment_tooltip": "Total startup capital required",
                "initial_investment_placeholder": "Enter amount",
                "monthly_revenue": "Expected Monthly Revenue",
                "monthly_revenue_tooltip": "Projected monthly sales",
                "monthly_revenue_placeholder": "Enter revenue",
                "operating_costs": "Monthly Operating Costs",
                "operating_costs_tooltip": "Rent, utilities, payroll, etc.",
                "operating_costs_placeholder": "Enter costs"
            },
            "results": {
                "title": "Franchise Analysis",
                "monthly_royalty": "Monthly Royalty Payment",
                "monthly_advertising": "Monthly Advertising Fee",
                "total_monthly_fees": "Total Monthly Fees",
                "net_profit": "Monthly Net Profit",
                "roi_months": "Months to ROI",
                "annual_revenue": "Projected Annual Revenue",
                "annual_profit": "Projected Annual Profit",
                "break_even": "Break-even Analysis"
            },
            "errors": {
                "invalid_fee": "Please enter a valid franchise fee",
                "invalid_rate": "Royalty rate must be between 0-50%",
                "invalid_investment": "Please enter a valid investment amount"
            },
            "info": {
                "title": "About Franchise Costs",
                "desc": "This calculator helps you analyze the financial aspects of a franchise opportunity, including fees, ongoing costs, and profitability projections."
            }
        }
    },

    "calc/electrical": {
        # Calculator 147: frequency-calculator
        "frequency-calculator": {
            "option_frequency": "Calculate from Frequency",
            "option_period": "Calculate from Period",
            "option_wavelength": "Calculate from Wavelength",
            "calculate_for": "Calculate For",
            "calculate_for_tooltip": "Choose what to calculate",
            "frequency_input": "Frequency",
            "frequency_tooltip": "Enter frequency in Hz",
            "enter_frequency": "Enter frequency",
            "period_input": "Period",
            "period_tooltip": "Enter period in seconds",
            "enter_period": "Enter period",
            "wavelength_input": "Wavelength",
            "wavelength_tooltip": "Enter wavelength in meters",
            "enter_wavelength": "Enter wavelength",
            "results_title": "Calculation Results",
            "frequency_result": "Frequency",
            "period_result": "Period",
            "wavelength_result": "Wavelength",
            "angular_frequency": "Angular Frequency",
            "tips_title": "Understanding Frequency",
            "tips_list": "Frequency (f) is the number of cycles per second. Period (T) is the time for one cycle. They are inversely related: f = 1/T",
            "empty_state": "Enter values to calculate frequency, period, or wavelength",
            "footer_note": "Speed of light (c) = 299,792,458 m/s used for wavelength calculations"
        }
    },

    "calc/finance": {
        # Calculator 148: fuel-consumption-calculator
        "fuel_consumption": {
            "error_required": "Please enter all required fields",
            "error_positive": "Values must be positive numbers",
            "error_price": "Please enter a valid fuel price",
            "error_annual": "Annual mileage must be positive",
            "error_calculation": "Calculation error occurred",
            "title": "Fuel Consumption Calculator",
            "description": "Calculate fuel consumption and costs for vehicles",
            "distance": "Distance Traveled",
            "distance_tooltip": "Enter distance traveled",
            "distance_placeholder": "e.g., 500",
            "fuel_used": "Fuel Used",
            "fuel_used_tooltip": "Enter fuel consumed",
            "fuel_used_placeholder": "e.g., 40",
            "fuel_price": "Fuel Price per Unit",
            "fuel_price_tooltip": "Price per liter or gallon",
            "fuel_price_placeholder": "e.g., 1.50",
            "annual_mileage": "Annual Mileage",
            "annual_mileage_tooltip": "Miles or km driven per year",
            "annual_mileage_placeholder": "e.g., 12000",
            "units_metric": "Metric (L/100km)",
            "units_imperial": "Imperial (MPG)",
            "unit_system": "Unit System",
            "unit_system_tooltip": "Choose measurement system",
            "results_title": "Consumption Analysis",
            "consumption_rate": "Fuel Consumption Rate",
            "trip_cost": "Trip Fuel Cost",
            "annual_fuel_cost": "Annual Fuel Cost",
            "annual_fuel_used": "Annual Fuel Used",
            "efficiency_rating": "Efficiency Rating",
            "info_title": "About Fuel Consumption",
            "info_desc": "Understanding your vehicle's fuel consumption helps budget for fuel costs and compare vehicle efficiency.",
            "use_cases_title": "Common Uses",
            "use_case_1": "Track and optimize fuel costs",
            "use_case_2": "Compare vehicle fuel efficiency",
            "use_case_3": "Plan trip fuel budgets"
        }
    },

    "calc/automotive": {
        # Calculator 150: fuel-cost-calculator
        "fuel_cost": {
            "errors": {
                "missing_inputs": "Please enter all required values",
                "positive_distance": "Distance must be positive",
                "positive_consumption": "Fuel consumption must be positive",
                "positive_price": "Fuel price must be positive",
                "calculation": "Error calculating fuel cost"
            },
            "title": "Fuel Cost Calculator",
            "description": "Calculate trip fuel costs based on distance and vehicle efficiency",
            "distance": "Trip Distance",
            "distance_tooltip": "Total distance of your trip",
            "distance_placeholder": "Enter distance",
            "unit_km": "Kilometers",
            "unit_miles": "Miles",
            "fuel_efficiency": "Fuel Efficiency",
            "fuel_efficiency_tooltip": "Your vehicle's fuel consumption rate",
            "fuel_efficiency_placeholder": "Enter efficiency",
            "fuel_price": "Fuel Price",
            "fuel_price_tooltip": "Price per liter or gallon",
            "fuel_price_placeholder": "Enter price",
            "results_title": "Trip Cost Breakdown",
            "total_fuel_needed": "Total Fuel Needed",
            "total_cost": "Total Fuel Cost",
            "cost_per_unit_distance": "Cost per km/mile",
            "round_trip_cost": "Round Trip Cost",
            "info_title": "Trip Planning",
            "info_desc": "Plan your travel budget by calculating fuel costs based on distance and your vehicle's efficiency."
        },

        # Calculator 151: fuel-economy-calculator (already has some keys)
        "fuel_economy": {
            "error_missing_inputs": "Please enter distance and fuel used",
            "error_positive_values": "All values must be positive",
            "error_positive_price": "Fuel price must be positive",
            "error_positive_distance": "Distance must be positive",
            "error_calculation": "Calculation error occurred",
            "imperial": "Imperial (MPG)",
            "metric": "Metric (L/100km)",
            "unit_system": "Unit System",
            "unit_system_tooltip": "Choose between imperial or metric units",
            "distance_miles": "Distance (miles)",
            "distance_km": "Distance (km)",
            "distance_tooltip": "Enter the distance traveled",
            "fuel_used_gallons": "Fuel Used (gallons)",
            "fuel_used_liters": "Fuel Used (liters)",
            "fuel_used_tooltip": "Enter amount of fuel consumed",
            "fuel_price_gallon": "Fuel Price (per gallon)",
            "fuel_price_liter": "Fuel Price (per liter)",
            "fuel_price_tooltip": "Price per unit of fuel",
            "annual_miles": "Annual Miles Driven",
            "annual_km": "Annual Kilometers Driven",
            "annual_tooltip": "Estimated yearly distance",
            "result_title": "Fuel Economy Results",
            "mile": "MPG",
            "km_per_liter": "km/L",
            "cost_per_mile": "Cost per Mile",
            "cost_per_km": "Cost per km",
            "annual_fuel_cost": "Annual Fuel Cost",
            "detailed_results": "Detailed Analysis",
            "about_title": "About Fuel Economy",
            "about_description": "Fuel economy measures how efficiently your vehicle uses fuel. Better fuel economy means lower costs and environmental impact.",
            "formula_title": "How It's Calculated",
            "formula_explanation": "MPG = Distance ÷ Fuel Used. L/100km = (Fuel Used ÷ Distance) × 100. Lower L/100km is better.",
            "use_cases_title": "Common Uses",
            "use_case_1": "Track vehicle fuel efficiency over time",
            "use_case_2": "Compare different vehicles or driving styles",
            "use_case_3": "Calculate annual fuel costs and budgeting",
            "year": "per year",
            "placeholders": {
                "distance_imperial": "e.g., 300",
                "distance_metric": "e.g., 500",
                "fuel_imperial": "e.g., 12",
                "fuel_metric": "e.g., 40",
                "price_imperial": "e.g., 3.50",
                "price_metric": "e.g., 1.50",
                "annual_imperial": "e.g., 12000",
                "annual_metric": "e.g., 20000"
            }
        },

        # Calculator 152: gas-mileage-calculator
        "gas_mileage": {
            "error_missing_inputs": "Please enter distance and fuel used",
            "error_positive_values": "All values must be positive",
            "error_calculation": "Calculation error occurred",
            "imperial": "Imperial",
            "metric": "Metric",
            "title": "Gas Mileage Calculator",
            "description": "Calculate your vehicle's gas mileage (fuel economy)",
            "unit_system": "Unit System",
            "unit_system_tooltip": "Select imperial (MPG) or metric (L/100km)",
            "distance_miles": "Distance Traveled (miles)",
            "distance_km": "Distance Traveled (km)",
            "distance_tooltip": "Enter the total distance",
            "fuel_gallons": "Fuel Used (gallons)",
            "fuel_liters": "Fuel Used (liters)",
            "fuel_tooltip": "Enter fuel consumed",
            "result_title": "Gas Mileage",
            "liters_per_100km": "Liters per 100 km",
            "about_title": "Understanding Gas Mileage",
            "about_description": "Gas mileage indicates how far your vehicle can travel per unit of fuel. Higher MPG or lower L/100km indicates better efficiency.",
            "formula_title": "Calculation Formula",
            "formula_explanation": "MPG = Miles ÷ Gallons. L/100km = (Liters ÷ Kilometers) × 100",
            "units": {
                "mpg": "MPG",
                "km_l": "km/L",
                "l_100km": "L/100km"
            },
            "placeholders": {
                "distance_imperial": "e.g., 300",
                "distance_metric": "e.g., 500",
                "fuel_imperial": "e.g., 12",
                "fuel_metric": "e.g., 40"
            }
        },

        # Calculator 154: gear-ratio-calculator
        "gear": {
            "invalid_stage2": "Please enter valid values for stage 2",
            "invalid_stage3": "Please enter valid values for stage 3",
            "simple_train": "Simple Gear Train",
            "compound_train": "Compound Gear Train",
            "simple": "Simple",
            "compound": "Compound",
            "error_calculation": "Calculation error occurred",
            "title": "Gear Ratio Calculator",
            "description": "Calculate gear ratios, speeds, and torque for gear systems",
            "type_label": "Gear Train Type",
            "type_tooltip": "Select simple or compound gear train",
            "num_stages": "Number of Stages",
            "num_stages_tooltip": "For compound gears, select number of stages",
            "stage1_title": "Stage 1",
            "stage2_title": "Stage 2",
            "stage3_title": "Stage 3",
            "driving_teeth": "Driving Gear Teeth",
            "driving_teeth_tooltip": "Number of teeth on input/driving gear",
            "driven_teeth": "Driven Gear Teeth",
            "driven_teeth_tooltip": "Number of teeth on output/driven gear",
            "stage2_driving": "Stage 2 Driving Teeth",
            "stage2_driven": "Stage 2 Driven Teeth",
            "stage3_driving": "Stage 3 Driving Teeth",
            "stage3_driven": "Stage 3 Driven Teeth",
            "input_speed": "Input Speed",
            "input_speed_tooltip": "Rotational speed of input shaft",
            "input_torque": "Input Torque",
            "input_torque_tooltip": "Torque at input shaft",
            "efficiency": "Efficiency (%)",
            "efficiency_tooltip": "Mechanical efficiency of gear system (typically 85-98%)",
            "gear_ratio": "Gear Ratio",
            "speed_ratio": "Speed Ratio",
            "mechanical_advantage": "Mechanical Advantage",
            "output_speed": "Output Speed",
            "output_torque": "Output Torque",
            "output_parameters": "Output Parameters",
            "rpm": "RPM",
            "nm": "N⋅m",
            "dimensionless": "ratio",
            "formulas_used": "Formulas Used",
            "use_cases_title": "Common Applications",
            "use_case_1": "Automotive transmission design",
            "use_case_2": "Industrial machinery gearing",
            "use_case_3": "Bicycle gear systems",
            "info_title": "About Gear Ratios",
            "placeholders": {
                "teeth": "e.g., 20",
                "speed": "e.g., 1000",
                "torque": "e.g., 50"
            }
        }
    },

    "calc/education": {
        # Calculator 155: gpa-calculator
        "gpa": {
            "errors": {
                "no_courses": "Please add at least one course",
                "invalid_credits": "Credit hours must be positive",
                "invalid_current_credits": "Current credits must be valid",
                "invalid_target_gpa": "Target GPA must be between 0.0 and 4.0"
            },
            "grading_scale": "Grading Scale",
            "grading_scale_tooltip": "Select your institution's grading scale",
            "scale_4_0": "4.0 Scale",
            "scale_5_0": "5.0 Scale",
            "include_weighted": "Include Weighted GPA",
            "add_semester": "Add Semester",
            "semester_label": "Semester",
            "course_label": "Course",
            "credits_label": "Credits",
            "grade_label": "Grade",
            "weight_label": "Weight",
            "weight_regular": "Regular",
            "weight_honors": "Honors",
            "weight_ap": "AP/IB",
            "current_gpa_label": "Current GPA",
            "current_credits_label": "Current Credits Completed",
            "target_gpa_label": "Target GPA",
            "results_title": "GPA Analysis",
            "semester_gpa": "Semester GPA",
            "cumulative_gpa_updated": "Updated Cumulative GPA",
            "credits_needed": "Credits Needed for Target GPA",
            "gpa_needed": "GPA Needed Next Semester"
        },

        # Calculator 156: grade-calculator
        "grade": {
            "errors": {
                "weights_total_100": "Weights must total 100%",
                "invalid_weight": "Weights must be positive and total 100%",
                "invalid_score": "Scores must be between 0 and 100",
                "invalid_desired": "Desired grade must be between 0 and 100"
            },
            "title": "Grade Calculator",
            "description": "Calculate your course grade and determine what you need on remaining assignments",
            "assignment_name": "Assignment Name",
            "assignment_name_placeholder": "e.g., Midterm Exam",
            "weight": "Weight (%)",
            "weight_tooltip": "Percentage of total grade",
            "weight_placeholder": "e.g., 30",
            "score": "Score (%)",
            "score_tooltip": "Your score on this assignment",
            "score_placeholder": "e.g., 85",
            "add_assignment": "Add Assignment",
            "current_grade": "Current Grade",
            "current_grade_tooltip": "Your grade based on completed work",
            "desired_grade": "Desired Final Grade",
            "desired_grade_tooltip": "Target grade you want to achieve",
            "remaining_weight": "Remaining Weight",
            "grade_needed": "Grade Needed on Remaining Work",
            "results_title": "Grade Analysis",
            "letter_grade": "Letter Grade",
            "points": "points",
            "weighted_score": "Weighted Score",
            "total_weight": "Total Weight",
            "grade_breakdown": "Grade Breakdown",
            "info_title": "How to Use",
            "info_desc": "Enter your assignments with their weights and scores. The calculator will show your current grade and what you need to achieve your desired final grade."
        }
    },

    "calc/construction": {
        # Calculator 157: gravel-calculator
        "gravel": {
            "errors": {
                "invalid_dimensions": "Please enter valid dimensions",
                "positive_values": "All values must be positive",
                "invalid_density": "Invalid density value"
            },
            "unit": "Unit System",
            "unit_tooltip": "Choose imperial or metric units",
            "imperial": "Imperial (feet/inches)",
            "metric": "Metric (meters)",
            "length": "Length",
            "length_tooltip": "Length of the area",
            "length_placeholder": "Enter length",
            "width": "Width",
            "width_tooltip": "Width of the area",
            "width_placeholder": "Enter width",
            "depth": "Depth",
            "depth_tooltip": "Depth/thickness of gravel",
            "depth_placeholder": "Enter depth",
            "gravel_type": "Gravel Type",
            "gravel_type_tooltip": "Type of gravel material",
            "type_pea": "Pea Gravel",
            "type_crushed": "Crushed Stone",
            "type_river": "River Rock",
            "type_white": "White Marble",
            "type_lava": "Lava Rock",
            "density": "Density",
            "density_tooltip": "Material density (automatically set by type)",
            "waste_factor": "Waste Factor (%)",
            "waste_factor_tooltip": "Add extra material for waste/compaction",
            "waste_placeholder": "e.g., 10",
            "results_title": "Material Requirements",
            "volume": "Total Volume",
            "volume_with_waste": "Volume with Waste",
            "weight": "Total Weight",
            "cubic_yards": "Cubic Yards",
            "cubic_meters": "Cubic Meters",
            "tons": "Tons",
            "tonnes": "Tonnes",
            "bags_needed": "Number of Bags Needed",
            "bag_size": "Bag Size",
            "coverage_area": "Coverage Area",
            "cost_estimate": "Cost Estimate",
            "price_per_unit": "Price per Unit",
            "price_per_unit_tooltip": "Cost per cubic yard/meter or per ton/tonne",
            "total_cost": "Total Estimated Cost",
            "info_title": "Gravel Calculator Guide",
            "info_desc": "Calculate how much gravel you need for your project. Include a waste factor to account for compaction and spillage.",
            "use_cases_title": "Common Uses",
            "use_case_1": "Driveway gravel requirements",
            "use_case_2": "Landscaping and garden paths",
            "use_case_3": "Drainage and foundation work",
            "notes_title": "Important Notes",
            "note_1": "Gravel compacts when installed - add 10-15% extra",
            "note_2": "Different gravel types have different densities",
            "note_3": "Check local prices as they vary by region"
        }
    }
}

# Comprehensive Arabic translations
FULL_TRANSLATIONS_AR = {
    "calc/business": {
        "franchise": {
            "inputs": {
                "franchise_fee": "رسوم الامتياز",
                "franchise_fee_tooltip": "دفعة رسوم الامتياز الأولية",
                "franchise_fee_placeholder": "أدخل رسوم الامتياز",
                "royalty_rate": "نسبة الإتاوة (%)",
                "royalty_rate_tooltip": "الإتاوة المستمرة كنسبة من الإيرادات",
                "royalty_rate_placeholder": "أدخل النسبة المئوية",
                "advertising_fee": "رسوم الإعلان (%)",
                "advertising_fee_tooltip": "رسوم التسويق كنسبة من الإيرادات",
                "advertising_fee_placeholder": "أدخل النسبة المئوية",
                "initial_investment": "الاستثمار الأولي",
                "initial_investment_tooltip": "إجمالي رأس المال المطلوب للبدء",
                "initial_investment_placeholder": "أدخل المبلغ",
                "monthly_revenue": "الإيرادات الشهرية المتوقعة",
                "monthly_revenue_tooltip": "المبيعات الشهرية المتوقعة",
                "monthly_revenue_placeholder": "أدخل الإيرادات",
                "operating_costs": "التكاليف التشغيلية الشهرية",
                "operating_costs_tooltip": "الإيجار، المرافق، الرواتب، إلخ.",
                "operating_costs_placeholder": "أدخل التكاليف"
            },
            "results": {
                "title": "تحليل الامتياز",
                "monthly_royalty": "دفع الإتاوة الشهرية",
                "monthly_advertising": "رسوم الإعلان الشهرية",
                "total_monthly_fees": "إجمالي الرسوم الشهرية",
                "net_profit": "صافي الربح الشهري",
                "roi_months": "أشهر لاسترداد الاستثمار",
                "annual_revenue": "الإيرادات السنوية المتوقعة",
                "annual_profit": "الربح السنوي المتوقع",
                "break_even": "تحليل نقطة التعادل"
            },
            "errors": {
                "invalid_fee": "الرجاء إدخال رسوم امتياز صحيحة",
                "invalid_rate": "يجب أن تكون نسبة الإتاوة بين 0-50%",
                "invalid_investment": "الرجاء إدخال مبلغ استثمار صحيح"
            },
            "info": {
                "title": "حول تكاليف الامتياز",
                "desc": "تساعدك هذه الحاسبة في تحليل الجوانب المالية لفرصة امتياز، بما في ذلك الرسوم والتكاليف المستمرة وتوقعات الربحية."
            }
        }
    },

    "calc/electrical": {
        "frequency-calculator": {
            "option_frequency": "احسب من التردد",
            "option_period": "احسب من الفترة الزمنية",
            "option_wavelength": "احسب من الطول الموجي",
            "calculate_for": "احسب لـ",
            "calculate_for_tooltip": "اختر ما تريد حسابه",
            "frequency_input": "التردد",
            "frequency_tooltip": "أدخل التردد بالهرتز",
            "enter_frequency": "أدخل التردد",
            "period_input": "الفترة الزمنية",
            "period_tooltip": "أدخل الفترة الزمنية بالثواني",
            "enter_period": "أدخل الفترة",
            "wavelength_input": "الطول الموجي",
            "wavelength_tooltip": "أدخل الطول الموجي بالأمتار",
            "enter_wavelength": "أدخل الطول الموجي",
            "results_title": "نتائج الحساب",
            "frequency_result": "التردد",
            "period_result": "الفترة الزمنية",
            "wavelength_result": "الطول الموجي",
            "angular_frequency": "التردد الزاوي",
            "tips_title": "فهم التردد",
            "tips_list": "التردد (f) هو عدد الدورات في الثانية. الفترة (T) هي الوقت لدورة واحدة. العلاقة عكسية: f = 1/T",
            "empty_state": "أدخل القيم لحساب التردد أو الفترة أو الطول الموجي",
            "footer_note": "سرعة الضوء (c) = 299,792,458 م/ث تستخدم في حسابات الطول الموجي"
        }
    },

    "calc/finance": {
        "fuel_consumption": {
            "error_required": "الرجاء إدخال جميع الحقول المطلوبة",
            "error_positive": "يجب أن تكون القيم أرقام موجبة",
            "error_price": "الرجاء إدخال سعر وقود صحيح",
            "error_annual": "يجب أن يكون المسافة السنوية موجبة",
            "error_calculation": "حدث خطأ في الحساب",
            "title": "حاسبة استهلاك الوقود",
            "description": "احسب استهلاك الوقود والتكاليف للمركبات",
            "distance": "المسافة المقطوعة",
            "distance_tooltip": "أدخل المسافة المقطوعة",
            "distance_placeholder": "مثال: 500",
            "fuel_used": "الوقود المستخدم",
            "fuel_used_tooltip": "أدخل الوقود المستهلك",
            "fuel_used_placeholder": "مثال: 40",
            "fuel_price": "سعر الوقود لكل وحدة",
            "fuel_price_tooltip": "السعر لكل لتر أو جالون",
            "fuel_price_placeholder": "مثال: 1.50",
            "annual_mileage": "المسافة السنوية",
            "annual_mileage_tooltip": "الأميال أو الكيلومترات المقطوعة سنوياً",
            "annual_mileage_placeholder": "مثال: 12000",
            "units_metric": "متري (لتر/100كم)",
            "units_imperial": "إمبراطوري (MPG)",
            "unit_system": "نظام الوحدات",
            "unit_system_tooltip": "اختر نظام القياس",
            "results_title": "تحليل الاستهلاك",
            "consumption_rate": "معدل استهلاك الوقود",
            "trip_cost": "تكلفة وقود الرحلة",
            "annual_fuel_cost": "تكلفة الوقود السنوية",
            "annual_fuel_used": "الوقود المستخدم سنوياً",
            "efficiency_rating": "تصنيف الكفاءة",
            "info_title": "حول استهلاك الوقود",
            "info_desc": "فهم استهلاك الوقود لمركبتك يساعد في وضع ميزانية لتكاليف الوقود ومقارنة كفاءة المركبات.",
            "use_cases_title": "الاستخدامات الشائعة",
            "use_case_1": "تتبع وتحسين تكاليف الوقود",
            "use_case_2": "مقارنة كفاءة استهلاك الوقود للمركبات",
            "use_case_3": "تخطيط ميزانيات وقود الرحلات"
        }
    },

    "calc/automotive": {
        "fuel_cost": {
            "errors": {
                "missing_inputs": "الرجاء إدخال جميع القيم المطلوبة",
                "positive_distance": "يجب أن تكون المسافة موجبة",
                "positive_consumption": "يجب أن يكون استهلاك الوقود موجباً",
                "positive_price": "يجب أن يكون سعر الوقود موجباً",
                "calculation": "خطأ في حساب تكلفة الوقود"
            },
            "title": "حاسبة تكلفة الوقود",
            "description": "احسب تكاليف وقود الرحلة بناءً على المسافة وكفاءة المركبة",
            "distance": "مسافة الرحلة",
            "distance_tooltip": "المسافة الإجمالية لرحلتك",
            "distance_placeholder": "أدخل المسافة",
            "unit_km": "كيلومترات",
            "unit_miles": "أميال",
            "fuel_efficiency": "كفاءة الوقود",
            "fuel_efficiency_tooltip": "معدل استهلاك الوقود لمركبتك",
            "fuel_efficiency_placeholder": "أدخل الكفاءة",
            "fuel_price": "سعر الوقود",
            "fuel_price_tooltip": "السعر لكل لتر أو جالون",
            "fuel_price_placeholder": "أدخل السعر",
            "results_title": "تفاصيل تكلفة الرحلة",
            "total_fuel_needed": "إجمالي الوقود المطلوب",
            "total_cost": "إجمالي تكلفة الوقود",
            "cost_per_unit_distance": "التكلفة لكل كم/ميل",
            "round_trip_cost": "تكلفة الذهاب والعودة",
            "info_title": "تخطيط الرحلة",
            "info_desc": "خطط لميزانية سفرك عن طريق حساب تكاليف الوقود بناءً على المسافة وكفاءة مركبتك."
        },

        "fuel_economy": {
            "error_missing_inputs": "الرجاء إدخال المسافة والوقود المستخدم",
            "error_positive_values": "يجب أن تكون جميع القيم موجبة",
            "error_positive_price": "يجب أن يكون سعر الوقود موجباً",
            "error_positive_distance": "يجب أن تكون المسافة موجبة",
            "error_calculation": "حدث خطأ في الحساب",
            "imperial": "إمبراطوري (MPG)",
            "metric": "متري (لتر/100كم)",
            "unit_system": "نظام الوحدات",
            "unit_system_tooltip": "اختر بين الوحدات الإمبراطورية أو المترية",
            "distance_miles": "المسافة (أميال)",
            "distance_km": "المسافة (كم)",
            "distance_tooltip": "أدخل المسافة المقطوعة",
            "fuel_used_gallons": "الوقود المستخدم (جالون)",
            "fuel_used_liters": "الوقود المستخدم (لتر)",
            "fuel_used_tooltip": "أدخل كمية الوقود المستهلك",
            "fuel_price_gallon": "سعر الوقود (لكل جالون)",
            "fuel_price_liter": "سعر الوقود (لكل لتر)",
            "fuel_price_tooltip": "السعر لكل وحدة وقود",
            "annual_miles": "الأميال السنوية المقطوعة",
            "annual_km": "الكيلومترات السنوية المقطوعة",
            "annual_tooltip": "المسافة السنوية المقدرة",
            "result_title": "نتائج اقتصاد الوقود",
            "mile": "MPG",
            "km_per_liter": "كم/لتر",
            "cost_per_mile": "التكلفة لكل ميل",
            "cost_per_km": "التكلفة لكل كم",
            "annual_fuel_cost": "تكلفة الوقود السنوية",
            "detailed_results": "تحليل مفصل",
            "about_title": "حول اقتصاد الوقود",
            "about_description": "اقتصاد الوقود يقيس كفاءة استخدام مركبتك للوقود. اقتصاد أفضل يعني تكاليف أقل وتأثير بيئي أقل.",
            "formula_title": "كيف يتم الحساب",
            "formula_explanation": "MPG = المسافة ÷ الوقود المستخدم. لتر/100كم = (الوقود المستخدم ÷ المسافة) × 100. أقل لتر/100كم أفضل.",
            "use_cases_title": "الاستخدامات الشائعة",
            "use_case_1": "تتبع كفاءة استهلاك الوقود للمركبة مع مرور الوقت",
            "use_case_2": "مقارنة مركبات أو أساليب قيادة مختلفة",
            "use_case_3": "حساب التكاليف السنوية للوقود وإعداد الميزانية",
            "year": "سنوياً",
            "placeholders": {
                "distance_imperial": "مثال: 300",
                "distance_metric": "مثال: 500",
                "fuel_imperial": "مثال: 12",
                "fuel_metric": "مثال: 40",
                "price_imperial": "مثال: 3.50",
                "price_metric": "مثال: 1.50",
                "annual_imperial": "مثال: 12000",
                "annual_metric": "مثال: 20000"
            }
        },

        "gas_mileage": {
            "error_missing_inputs": "الرجاء إدخال المسافة والوقود المستخدم",
            "error_positive_values": "يجب أن تكون جميع القيم موجبة",
            "error_calculation": "حدث خطأ في الحساب",
            "imperial": "إمبراطوري",
            "metric": "متري",
            "title": "حاسبة استهلاك الوقود",
            "description": "احسب استهلاك الوقود لمركبتك (اقتصاد الوقود)",
            "unit_system": "نظام الوحدات",
            "unit_system_tooltip": "اختر إمبراطوري (MPG) أو متري (لتر/100كم)",
            "distance_miles": "المسافة المقطوعة (أميال)",
            "distance_km": "المسافة المقطوعة (كم)",
            "distance_tooltip": "أدخل المسافة الإجمالية",
            "fuel_gallons": "الوقود المستخدم (جالون)",
            "fuel_liters": "الوقود المستخدم (لتر)",
            "fuel_tooltip": "أدخل الوقود المستهلك",
            "result_title": "استهلاك الوقود",
            "liters_per_100km": "لتر لكل 100 كم",
            "about_title": "فهم استهلاك الوقود",
            "about_description": "استهلاك الوقود يشير إلى مدى قدرة مركبتك على السير لكل وحدة وقود. MPG أعلى أو لتر/100كم أقل يشير إلى كفاءة أفضل.",
            "formula_title": "صيغة الحساب",
            "formula_explanation": "MPG = أميال ÷ جالون. لتر/100كم = (لتر ÷ كيلومتر) × 100",
            "units": {
                "mpg": "MPG",
                "km_l": "كم/لتر",
                "l_100km": "لتر/100كم"
            },
            "placeholders": {
                "distance_imperial": "مثال: 300",
                "distance_metric": "مثال: 500",
                "fuel_imperial": "مثال: 12",
                "fuel_metric": "مثال: 40"
            }
        },

        "gear": {
            "invalid_stage2": "الرجاء إدخال قيم صحيحة للمرحلة 2",
            "invalid_stage3": "الرجاء إدخال قيم صحيحة للمرحلة 3",
            "simple_train": "قطار تروس بسيط",
            "compound_train": "قطار تروس مركب",
            "simple": "بسيط",
            "compound": "مركب",
            "error_calculation": "حدث خطأ في الحساب",
            "title": "حاسبة نسبة التروس",
            "description": "احسب نسب التروس والسرعات وعزم الدوران لأنظمة التروس",
            "type_label": "نوع قطار التروس",
            "type_tooltip": "اختر قطار تروس بسيط أو مركب",
            "num_stages": "عدد المراحل",
            "num_stages_tooltip": "للتروس المركبة، اختر عدد المراحل",
            "stage1_title": "المرحلة 1",
            "stage2_title": "المرحلة 2",
            "stage3_title": "المرحلة 3",
            "driving_teeth": "أسنان الترس القائد",
            "driving_teeth_tooltip": "عدد أسنان الترس الداخل/القائد",
            "driven_teeth": "أسنان الترس المقاد",
            "driven_teeth_tooltip": "عدد أسنان الترس الخارج/المقاد",
            "stage2_driving": "أسنان القيادة المرحلة 2",
            "stage2_driven": "أسنان المقودة المرحلة 2",
            "stage3_driving": "أسنان القيادة المرحلة 3",
            "stage3_driven": "أسنان المقودة المرحلة 3",
            "input_speed": "سرعة الإدخال",
            "input_speed_tooltip": "سرعة الدوران للمحور الداخل",
            "input_torque": "عزم الدوران الداخل",
            "input_torque_tooltip": "عزم الدوران عند المحور الداخل",
            "efficiency": "الكفاءة (%)",
            "efficiency_tooltip": "الكفاءة الميكانيكية لنظام التروس (عادة 85-98%)",
            "gear_ratio": "نسبة التروس",
            "speed_ratio": "نسبة السرعة",
            "mechanical_advantage": "الميزة الميكانيكية",
            "output_speed": "سرعة الخرج",
            "output_torque": "عزم دوران الخرج",
            "output_parameters": "معاملات الخرج",
            "rpm": "دورة/دقيقة",
            "nm": "نيوتن⋅متر",
            "dimensionless": "نسبة",
            "formulas_used": "الصيغ المستخدمة",
            "use_cases_title": "التطبيقات الشائعة",
            "use_case_1": "تصميم ناقل الحركة للسيارات",
            "use_case_2": "تروس الآلات الصناعية",
            "use_case_3": "أنظمة تروس الدراجات",
            "info_title": "حول نسب التروس",
            "placeholders": {
                "teeth": "مثال: 20",
                "speed": "مثال: 1000",
                "torque": "مثال: 50"
            }
        }
    },

    "calc/education": {
        "gpa": {
            "errors": {
                "no_courses": "الرجاء إضافة مادة واحدة على الأقل",
                "invalid_credits": "يجب أن تكون الساعات المعتمدة موجبة",
                "invalid_current_credits": "يجب أن تكون الساعات الحالية صحيحة",
                "invalid_target_gpa": "يجب أن يكون المعدل المستهدف بين 0.0 و 4.0"
            },
            "grading_scale": "مقياس الدرجات",
            "grading_scale_tooltip": "اختر مقياس درجات مؤسستك",
            "scale_4_0": "مقياس 4.0",
            "scale_5_0": "مقياس 5.0",
            "include_weighted": "تضمين المعدل الموزون",
            "add_semester": "أضف فصل دراسي",
            "semester_label": "الفصل الدراسي",
            "course_label": "المادة",
            "credits_label": "الساعات",
            "grade_label": "الدرجة",
            "weight_label": "الوزن",
            "weight_regular": "عادي",
            "weight_honors": "مكرم",
            "weight_ap": "AP/IB",
            "current_gpa_label": "المعدل الحالي",
            "current_credits_label": "الساعات المعتمدة المكتملة",
            "target_gpa_label": "المعدل المستهدف",
            "results_title": "تحليل المعدل",
            "semester_gpa": "معدل الفصل الدراسي",
            "cumulative_gpa_updated": "المعدل التراكمي المحدث",
            "credits_needed": "الساعات المطلوبة للمعدل المستهدف",
            "gpa_needed": "المعدل المطلوب في الفصل القادم"
        },

        "grade": {
            "errors": {
                "weights_total_100": "يجب أن يكون مجموع الأوزان 100%",
                "invalid_weight": "يجب أن تكون الأوزان موجبة ومجموعها 100%",
                "invalid_score": "يجب أن تكون الدرجات بين 0 و 100",
                "invalid_desired": "يجب أن تكون الدرجة المرغوبة بين 0 و 100"
            },
            "title": "حاسبة الدرجات",
            "description": "احسب درجة المادة وحدد ما تحتاجه في المهام المتبقية",
            "assignment_name": "اسم المهمة",
            "assignment_name_placeholder": "مثال: امتحان منتصف الفصل",
            "weight": "الوزن (%)",
            "weight_tooltip": "النسبة المئوية من الدرجة الإجمالية",
            "weight_placeholder": "مثال: 30",
            "score": "الدرجة (%)",
            "score_tooltip": "درجتك في هذه المهمة",
            "score_placeholder": "مثال: 85",
            "add_assignment": "أضف مهمة",
            "current_grade": "الدرجة الحالية",
            "current_grade_tooltip": "درجتك بناءً على العمل المكتمل",
            "desired_grade": "الدرجة النهائية المرغوبة",
            "desired_grade_tooltip": "الدرجة المستهدفة التي تريد تحقيقها",
            "remaining_weight": "الوزن المتبقي",
            "grade_needed": "الدرجة المطلوبة في العمل المتبقي",
            "results_title": "تحليل الدرجات",
            "letter_grade": "الدرجة الحرفية",
            "points": "نقاط",
            "weighted_score": "الدرجة الموزونة",
            "total_weight": "الوزن الإجمالي",
            "grade_breakdown": "تفصيل الدرجات",
            "info_title": "كيفية الاستخدام",
            "info_desc": "أدخل مهامك مع أوزانها ودرجاتها. ستعرض الحاسبة درجتك الحالية وما تحتاجه لتحقيق درجتك النهائية المرغوبة."
        }
    },

    "calc/construction": {
        "gravel": {
            "errors": {
                "invalid_dimensions": "الرجاء إدخال أبعاد صحيحة",
                "positive_values": "يجب أن تكون جميع القيم موجبة",
                "invalid_density": "قيمة كثافة غير صحيحة"
            },
            "unit": "نظام الوحدات",
            "unit_tooltip": "اختر الوحدات الإمبراطورية أو المترية",
            "imperial": "إمبراطوري (قدم/بوصة)",
            "metric": "متري (متر)",
            "length": "الطول",
            "length_tooltip": "طول المساحة",
            "length_placeholder": "أدخل الطول",
            "width": "العرض",
            "width_tooltip": "عرض المساحة",
            "width_placeholder": "أدخل العرض",
            "depth": "العمق",
            "depth_tooltip": "عمق/سمك الحصى",
            "depth_placeholder": "أدخل العمق",
            "gravel_type": "نوع الحصى",
            "gravel_type_tooltip": "نوع مادة الحصى",
            "type_pea": "حصى البازلاء",
            "type_crushed": "حجر مكسر",
            "type_river": "صخور النهر",
            "type_white": "رخام أبيض",
            "type_lava": "صخر بركاني",
            "density": "الكثافة",
            "density_tooltip": "كثافة المادة (يتم ضبطها تلقائياً حسب النوع)",
            "waste_factor": "معامل الهدر (%)",
            "waste_factor_tooltip": "أضف مواد إضافية للهدر/الضغط",
            "waste_placeholder": "مثال: 10",
            "results_title": "متطلبات المواد",
            "volume": "الحجم الإجمالي",
            "volume_with_waste": "الحجم مع الهدر",
            "weight": "الوزن الإجمالي",
            "cubic_yards": "ياردة مكعبة",
            "cubic_meters": "متر مكعب",
            "tons": "طن",
            "tonnes": "طن متري",
            "bags_needed": "عدد الأكياس المطلوبة",
            "bag_size": "حجم الكيس",
            "coverage_area": "منطقة التغطية",
            "cost_estimate": "تقدير التكلفة",
            "price_per_unit": "السعر لكل وحدة",
            "price_per_unit_tooltip": "التكلفة لكل ياردة/متر مكعب أو لكل طن",
            "total_cost": "إجمالي التكلفة المقدرة",
            "info_title": "دليل حاسبة الحصى",
            "info_desc": "احسب كمية الحصى التي تحتاجها لمشروعك. أضف معامل هدر لحساب الضغط والانسكاب.",
            "use_cases_title": "الاستخدامات الشائعة",
            "use_case_1": "متطلبات حصى الممر",
            "use_case_2": "تنسيق الحدائق والممرات",
            "use_case_3": "أعمال الصرف والأساسات",
            "notes_title": "ملاحظات مهمة",
            "note_1": "الحصى ينضغط عند التركيب - أضف 10-15% إضافي",
            "note_2": "أنواع الحصى المختلفة لها كثافات مختلفة",
            "note_3": "تحقق من الأسعار المحلية لأنها تختلف حسب المنطقة"
        }
    }
}

def main():
    print("=" * 80)
    print("COMPREHENSIVE TRANSLATION UPDATE: CALCULATORS 146-210")
    print("=" * 80)

    # Load existing translations
    print("\n📖 Loading existing translations...")
    en_data = load_json(EN_FILE)
    ar_data = load_json(AR_FILE)

    # Merge new translations
    print("\n✏️  Merging comprehensive translations...")
    merge_translations(en_data, FULL_TRANSLATIONS_EN)
    merge_translations(ar_data, FULL_TRANSLATIONS_AR)

    # Save updated translations
    print("\n💾 Saving translations...")
    save_json(EN_FILE, en_data)
    save_json(AR_FILE, ar_data)

    print("\n" + "=" * 80)
    print("✅ COMPREHENSIVE UPDATE COMPLETE!")
    print("=" * 80)
    print("\nAdditional translations added for:")
    print("  • franchise-calculator (Calculator 146)")
    print("  • frequency-calculator (Calculator 147)")
    print("  • fuel-consumption-calculator (Calculator 148)")
    print("  • fuel-cost-calculator (Calculator 150)")
    print("  • fuel-economy-calculator (Calculator 151)")
    print("  • gas-mileage-calculator (Calculator 152)")
    print("  • gear-ratio-calculator (Calculator 154)")
    print("  • gpa-calculator (Calculator 155)")
    print("  • grade-calculator (Calculator 156)")
    print("  • gravel-calculator (Calculator 157)")
    print("\n⏳ More calculators (158-210) require additional work...")
    print("=" * 80)

if __name__ == "__main__":
    main()
