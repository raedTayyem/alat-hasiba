'use client';

import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RotateCw, Circle, Scale, Compass, Clock, MoveRight, Zap } from '@/utils/icons';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';

interface Inputs {
  angularVelocity: string;
  radius: string;
  mass: string;
  angle: string;
  time: string;
  linearVelocity: string;
}

interface Results {
  linearVelocity?: number;
  tangentialAcceleration?: number;
  centripetalAcceleration?: number;
  centripetalForce?: number;
  torque?: number;
  angularAcceleration?: number;
  kineticEnergy?: number;
  angularMomentum?: number;
  distanceTraveled?: number;
  periodOfRotation?: number;
}

// Example inputs to show how the calculator works
const exampleInputs: Inputs = {
  angularVelocity: "3",
  radius: "2",
  mass: "5",
  angle: "90",
  time: "10",
  linearVelocity: ""
};

export default function RotationalMotionCalculator() {
  const { t } = useTranslation(['calc/physics', 'common']);

  const [inputs, setInputs] = useState<Inputs>(exampleInputs);
  const [results, setResults] = useState<Results>({});
  const [error, setError] = useState<string>('');

  const handleInputChange = (value: number | string, name: string) => {
    // Update the inputs state with the new value
    const updatedInputs = {
      ...inputs,
      [name]: value.toString()
    };
    
    // Update state
    setInputs(updatedInputs);
  };

  const getUnitLabel = (unit: string) => {
    // Hardcode universal unit symbols that don't need translation
    const universalUnits: { [key: string]: string } = {
      'm': 'm',
      's': 's',
      'N': 'N',
      'J': 'J',
    };

    if (universalUnits[unit]) return universalUnits[unit];

    // Use translation for compound/descriptive units
    const unitKeys: { [key: string]: string } = {
      'm/s': 'rotational_motion.units.m_s',
      'm/s²': 'rotational_motion.units.m_s2',
      'kg·m²/s': 'rotational_motion.units.kg_m2_s',
    };
    return unitKeys[unit] ? t(unitKeys[unit]) : unit;
  };

  const calculate = () => {
    setError('');

    const angularVelocity = parseFloat(inputs.angularVelocity || "0"); // rad/s
    const radius = parseFloat(inputs.radius || "0"); // meters
    const mass = parseFloat(inputs.mass || "0"); // kg
    const angleInDegrees = parseFloat(inputs.angle || "0"); // degrees
    const time = parseFloat(inputs.time || "0"); // seconds
    const linearVelocityInput = parseFloat(inputs.linearVelocity || "0"); // m/s

    // Validation
    if (radius <= 0) {
      setError(t('rotational_motion.errors.radius_positive'));
      return;
    }

    if (angularVelocity === 0 && linearVelocityInput === 0) {
      setError(t('rotational_motion.errors.enter_velocity'));
      return;
    }

    // Convert angle from degrees to radians
    const angleInRadians = (angleInDegrees * Math.PI) / 180;

    // Calculate linear velocity (v = r * omega)
    const linearVelocity = linearVelocityInput || (radius * angularVelocity);

    // Calculate tangential acceleration (at = alpha * r)
    // Assuming constant angular velocity, so alpha = 0
    const tangentialAcceleration = 0 * radius;

    // Calculate centripetal acceleration (ar = v^2 / r = omega^2 * r)
    const centripetalAcceleration = Math.pow(angularVelocity, 2) * radius;

    // Calculate centripetal force (Fr = m * v^2 / r = m * omega^2 * r)
    const centripetalForce = mass * Math.pow(angularVelocity, 2) * radius;

    // Calculate torque (tau = r * F * sin(theta))
    // Assuming force is perpendicular to radius for maximum torque
    const torque = radius * centripetalForce * Math.sin(angleInRadians);

    // Calculate angular acceleration (alpha = tau / I)
    // For a point mass, moment of inertia I = m * r^2
    const momentOfInertia = mass * Math.pow(radius, 2);
    const angularAcceleration = momentOfInertia > 0 ? torque / momentOfInertia : 0;

    // Calculate rotational kinetic energy (K = 1/2 * I * omega^2)
    const kineticEnergy = 0.5 * momentOfInertia * Math.pow(angularVelocity, 2);

    // Calculate angular momentum (L = I * omega)
    const angularMomentum = momentOfInertia * angularVelocity;

    // Calculate distance traveled (s = r * omega * t)
    const distanceTraveled = radius * angularVelocity * time;

    // Calculate period of rotation (T = 2*pi / omega)
    const periodOfRotation = angularVelocity !== 0 ? (2 * Math.PI) / angularVelocity : Infinity;

    setResults({
      linearVelocity,
      tangentialAcceleration,
      centripetalAcceleration,
      centripetalForce,
      torque,
      angularAcceleration,
      kineticEnergy,
      angularMomentum,
      distanceTraveled,
      periodOfRotation,
    });
  };

  const resetCalculator = () => {
    setInputs({
      angularVelocity: '',
      radius: '',
      mass: '',
      angle: '',
      time: '',
      linearVelocity: ''
    });
    setResults({});
    setError('');
  };

  const inputSection = (
    <div className="grid gap-6">
      <div className="grid gap-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label={t('rotational_motion.inputs.angular_velocity')}>
            <NumberInput
              value={inputs.angularVelocity}
              onValueChange={(val) => handleInputChange(val, 'angularVelocity')}
              placeholder={t('rotational_motion.placeholders.angular_velocity')}
              startIcon={<RotateCw className="h-4 w-4" />}
            />
          </FormField>
          
          <FormField label={t('rotational_motion.inputs.radius')}>
            <NumberInput
              value={inputs.radius}
              onValueChange={(val) => handleInputChange(val, 'radius')}
              placeholder={t('rotational_motion.placeholders.radius')}
              startIcon={<Circle className="h-4 w-4" />}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label={t('rotational_motion.inputs.mass')}>
            <NumberInput
              value={inputs.mass}
              onValueChange={(val) => handleInputChange(val, 'mass')}
              placeholder={t('rotational_motion.placeholders.mass')}
              startIcon={<Scale className="h-4 w-4" />}
            />
          </FormField>
          
          <FormField label={t('rotational_motion.inputs.angle')}>
            <NumberInput
              value={inputs.angle}
              onValueChange={(val) => handleInputChange(val, 'angle')}
              placeholder={t('rotational_motion.placeholders.angle')}
              startIcon={<Compass className="h-4 w-4" />}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label={t('rotational_motion.inputs.time')}>
            <NumberInput
              value={inputs.time}
              onValueChange={(val) => handleInputChange(val, 'time')}
              placeholder={t('rotational_motion.placeholders.time')}
              startIcon={<Clock className="h-4 w-4" />}
            />
          </FormField>
          
          <FormField label={t('rotational_motion.inputs.linear_velocity_optional')}>
            <NumberInput
              value={inputs.linearVelocity}
              onValueChange={(val) => handleInputChange(val, 'linearVelocity')}
              placeholder={t('rotational_motion.placeholders.linear_velocity')}
              startIcon={<MoveRight className="h-4 w-4" />}
            />
          </FormField>
        </div>
        <ErrorDisplay error={error} />
      </div>
    </div>
  );

  const resultSection = Object.keys(results).length > 0 ? (
    <Card className="bg-card-bg border-border">
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <Zap className="w-5 h-5 mr-2 text-primary" />
          {t('rotational_motion.results.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="bg-card p-3 rounded-lg border border-border flex justify-between items-center">
          <span className="text-foreground-70">{t('rotational_motion.results.linear_velocity')}:</span>
          <span className="font-bold text-primary">{results.linearVelocity?.toFixed(4)} {getUnitLabel('m/s')}</span>
        </div>
        <div className="bg-card p-3 rounded-lg border border-border flex justify-between items-center">
          <span className="text-foreground-70">{t('rotational_motion.results.centripetal_acceleration')}:</span>
          <span className="font-bold text-primary">{results.centripetalAcceleration?.toFixed(4)} {getUnitLabel('m/s²')}</span>
        </div>
        <div className="bg-card p-3 rounded-lg border border-border flex justify-between items-center">
          <span className="text-foreground-70">{t('rotational_motion.results.centripetal_force')}:</span>
          <span className="font-bold text-primary">{results.centripetalForce?.toFixed(4)} {getUnitLabel('N')}</span>
        </div>
        <div className="bg-card p-3 rounded-lg border border-border flex justify-between items-center">
          <span className="text-foreground-70">{t('rotational_motion.results.kinetic_energy')}:</span>
          <span className="font-bold text-primary">{results.kineticEnergy?.toFixed(4)} {getUnitLabel('J')}</span>
        </div>
        <div className="bg-card p-3 rounded-lg border border-border flex justify-between items-center">
          <span className="text-foreground-70">{t('rotational_motion.results.angular_momentum')}:</span>
          <span className="font-bold text-primary">{results.angularMomentum?.toFixed(4)} {getUnitLabel('kg·m²/s')}</span>
        </div>
        <div className="bg-card p-3 rounded-lg border border-border flex justify-between items-center">
          <span className="text-foreground-70">{t('rotational_motion.results.distance_traveled')}:</span>
          <span className="font-bold text-primary">{results.distanceTraveled?.toFixed(4)} {getUnitLabel('m')}</span>
        </div>
        <div className="bg-card p-3 rounded-lg border border-border flex justify-between items-center">
          <span className="text-foreground-70">{t('rotational_motion.results.period_of_rotation')}:</span>
          <span className="font-bold text-primary">{results.periodOfRotation?.toFixed(4)} {getUnitLabel('s')}</span>
        </div>
      </CardContent>
    </Card>
  ) : null;

  return (
    <CalculatorLayout
      title={t('rotational_motion.title')}
      description={t('rotational_motion.description')}
      inputSection={
        <>
          {inputSection}
          <CalculatorButtons onCalculate={calculate} onReset={resetCalculator} />
        </>
      }
      resultSection={resultSection}
      className="rtl"
    />
  );
} 
 

