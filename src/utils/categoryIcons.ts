import { 
  MathIcon, 
  FinanceIcon, 
  HealthIcon, 
  ConverterIcon, 
  PhysicsIcon, 
  EngineeringIcon, 
  BusinessIcon, 
  EducationIcon, 
  DateTimeIcon, 
  OtherIcon,
  ConstructionIcon,
  AutomotiveIcon,
  CookingIcon,
  GamingIcon,
  AgricultureIcon,
  ScienceIcon,
  ElectricalIcon,
  AstronomyIcon,
  StatisticsIcon,
  RealEstateIcon,
  GeometryIcon,
  FitnessIcon,
  EnvironmentalIcon,
  PetIcon,
  MiscIcon
} from '../components/icons/CategoryIcons';

export const categoryIcons = {
  math: MathIcon,
  finance: FinanceIcon,
  health: HealthIcon,
  converter: ConverterIcon,
  physics: PhysicsIcon,
  engineering: EngineeringIcon,
  business: BusinessIcon,
  education: EducationIcon,
  'date-time': DateTimeIcon,
  construction: ConstructionIcon,
  automotive: AutomotiveIcon,
  cooking: CookingIcon,
  gaming: GamingIcon,
  agriculture: AgricultureIcon,
  science: ScienceIcon,
  electrical: ElectricalIcon,
  astronomy: AstronomyIcon,
  statistics: StatisticsIcon,
  'real-estate': RealEstateIcon,
  geometry: GeometryIcon,
  fitness: FitnessIcon,
  environmental: EnvironmentalIcon,
  pet: PetIcon,
  misc: MiscIcon,
  other: OtherIcon
};

export const getCategoryIcon = (category: string) => {
  return categoryIcons[category as keyof typeof categoryIcons] || OtherIcon;
};
