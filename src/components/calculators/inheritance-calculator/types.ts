// Define the heir types and their relationships
export type Heir = {
  id: string;
  nameKey: string; // Translation key for heir name
  category: string;
  selected: boolean;
  count: number;
  share: number | null;
  shareTextKey: string; // Translation key for share text
};

// Define share text keys for use in calculations
export const shareTextKeys = {
  half: 'inheritance-calculator.shares.half',
  quarter: 'inheritance-calculator.shares.quarter',
  eighth: 'inheritance-calculator.shares.eighth',
  two_thirds: 'inheritance-calculator.shares.two_thirds',
  third: 'inheritance-calculator.shares.third',
  sixth: 'inheritance-calculator.shares.sixth',
  residue: 'inheritance-calculator.shares.residue',
  sixth_with_residue: 'inheritance-calculator.shares.sixth_with_residue',
  residue_with_son: 'inheritance-calculator.shares.residue_with_son',
  residue_with_grandson: 'inheritance-calculator.shares.residue_with_grandson',
  residue_with_brother: 'inheritance-calculator.shares.residue_with_brother',
  shared_third: 'inheritance-calculator.shares.shared_third',
  shared_third_female: 'inheritance-calculator.shares.shared_third_female',
};

// Define the heirs structure by category - using translation keys
export const initialHeirs: Heir[] = [
  // Spouse category
  { id: 'husband', nameKey: 'inheritance-calculator.heirs.husband', category: 'spouse', selected: false, count: 1, share: null, shareTextKey: '' },
  { id: 'wife', nameKey: 'inheritance-calculator.heirs.wife', category: 'spouse', selected: false, count: 1, share: null, shareTextKey: '' },

  // Children category
  { id: 'son', nameKey: 'inheritance-calculator.heirs.son', category: 'children', selected: false, count: 0, share: null, shareTextKey: '' },
  { id: 'daughter', nameKey: 'inheritance-calculator.heirs.daughter', category: 'children', selected: false, count: 0, share: null, shareTextKey: '' },
  { id: 'grandson', nameKey: 'inheritance-calculator.heirs.grandson', category: 'children', selected: false, count: 0, share: null, shareTextKey: '' },
  { id: 'granddaughter', nameKey: 'inheritance-calculator.heirs.granddaughter', category: 'children', selected: false, count: 0, share: null, shareTextKey: '' },

  // Parents category
  { id: 'father', nameKey: 'inheritance-calculator.heirs.father', category: 'parents', selected: false, count: 1, share: null, shareTextKey: '' },
  { id: 'mother', nameKey: 'inheritance-calculator.heirs.mother', category: 'parents', selected: false, count: 1, share: null, shareTextKey: '' },
  { id: 'grandfather', nameKey: 'inheritance-calculator.heirs.grandfather', category: 'parents', selected: false, count: 1, share: null, shareTextKey: '' },
  { id: 'grandmother', nameKey: 'inheritance-calculator.heirs.grandmother', category: 'parents', selected: false, count: 1, share: null, shareTextKey: '' },

  // Siblings category
  { id: 'brother', nameKey: 'inheritance-calculator.heirs.brother', category: 'siblings', selected: false, count: 0, share: null, shareTextKey: '' },
  { id: 'sister', nameKey: 'inheritance-calculator.heirs.sister', category: 'siblings', selected: false, count: 0, share: null, shareTextKey: '' },
  { id: 'paternal_brother', nameKey: 'inheritance-calculator.heirs.brother_paternal', category: 'siblings', selected: false, count: 0, share: null, shareTextKey: '' },
  { id: 'paternal_sister', nameKey: 'inheritance-calculator.heirs.sister_paternal', category: 'siblings', selected: false, count: 0, share: null, shareTextKey: '' },
  { id: 'maternal_brother', nameKey: 'inheritance-calculator.heirs.brother_maternal', category: 'siblings', selected: false, count: 0, share: null, shareTextKey: '' },
  { id: 'maternal_sister', nameKey: 'inheritance-calculator.heirs.sister_maternal', category: 'siblings', selected: false, count: 0, share: null, shareTextKey: '' },

  // Other relatives
  { id: 'nephew', nameKey: 'inheritance-calculator.heirs.nephew', category: 'other', selected: false, count: 0, share: null, shareTextKey: '' },
  { id: 'paternal_nephew', nameKey: 'inheritance-calculator.heirs.paternal_nephew', category: 'other', selected: false, count: 0, share: null, shareTextKey: '' },
  { id: 'uncle', nameKey: 'inheritance-calculator.heirs.uncle', category: 'other', selected: false, count: 0, share: null, shareTextKey: '' },
  { id: 'paternal_uncle', nameKey: 'inheritance-calculator.heirs.paternal_uncle', category: 'other', selected: false, count: 0, share: null, shareTextKey: '' },
  { id: 'cousin', nameKey: 'inheritance-calculator.heirs.cousin', category: 'other', selected: false, count: 0, share: null, shareTextKey: '' },
  { id: 'paternal_cousin', nameKey: 'inheritance-calculator.heirs.paternal_cousin', category: 'other', selected: false, count: 0, share: null, shareTextKey: '' },
];

// Define the categories for UI organization - using translation keys
export const heirCategories = [
  { id: 'spouse', nameKey: 'inheritance-calculator.categories.spouse' },
  { id: 'children', nameKey: 'inheritance-calculator.categories.children' },
  { id: 'parents', nameKey: 'inheritance-calculator.categories.parents' },
  { id: 'siblings', nameKey: 'inheritance-calculator.categories.siblings' },
  { id: 'other', nameKey: 'inheritance-calculator.categories.other' },
]; 