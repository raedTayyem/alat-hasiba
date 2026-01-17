import { Heir, shareTextKeys } from './types';

// Function to apply Islamic inheritance rules
export const applyInheritanceRules = (heirs: Heir[]): Heir[] => {
  // Create a copy of the heirs array to work with
  const updatedHeirs = [...heirs];

  // Get selected heirs
  const selectedHeirs = updatedHeirs.filter(heir => heir.selected);

  // Check if there are any selected heirs
  if (selectedHeirs.length === 0) {
    return updatedHeirs;
  }

  // Helper function to check if specific heirs exist
  const hasHeir = (id: string): boolean => {
    return selectedHeirs.some(heir => heir.id === id);
  };

  const getHeirCount = (id: string): number => {
    const heir = selectedHeirs.find(h => h.id === id);
    return heir ? heir.count : 0;
  };

  // Check for male descendants (sons or grandsons)
  const hasMaleDescendants = hasHeir('son') || hasHeir('grandson');

  // Check for female descendants (daughters or granddaughters)
  const hasFemaleDescendants = hasHeir('daughter') || hasHeir('granddaughter');

  // Check for any descendants
  const hasDescendants = hasMaleDescendants || hasFemaleDescendants;

  // Check for father or grandfather
  const hasFather = hasHeir('father');
  const hasGrandfather = hasHeir('grandfather');
  const hasMaleAscendants = hasFather || hasGrandfather;

  // Check for siblings
  const hasFullSiblings = hasHeir('brother') || hasHeir('sister');
  const hasPaternalSiblings = hasHeir('paternal_brother') || hasHeir('paternal_sister');
  const hasMaternalSiblings = hasHeir('maternal_brother') || hasHeir('maternal_sister');

  // Calculate shares based on Islamic inheritance rules

  // 1. Spouse shares
  if (hasHeir('husband')) {
    // Husband gets 1/2 if no descendants, 1/4 if descendants
    const husbandShare = hasDescendants ? 1/4 : 1/2;
    const husbandIndex = updatedHeirs.findIndex(h => h.id === 'husband');
    updatedHeirs[husbandIndex].share = husbandShare;
    updatedHeirs[husbandIndex].shareTextKey = hasDescendants ? shareTextKeys.quarter : shareTextKeys.half;
  }

  if (hasHeir('wife')) {
    // Wife gets 1/4 if no descendants, 1/8 if descendants
    const wifeShare = hasDescendants ? 1/8 : 1/4;
    const wifeIndex = updatedHeirs.findIndex(h => h.id === 'wife');
    updatedHeirs[wifeIndex].share = wifeShare;
    updatedHeirs[wifeIndex].shareTextKey = hasDescendants ? shareTextKeys.eighth : shareTextKeys.quarter;
  }

  // 2. Parents shares
  if (hasHeir('father')) {
    // Father gets 1/6 plus residue if there are male descendants
    // Father gets 1/6 plus residue if there are only female descendants
    // Father gets all residue if no descendants
    const fatherIndex = updatedHeirs.findIndex(h => h.id === 'father');
    if (hasMaleDescendants) {
      updatedHeirs[fatherIndex].share = 1/6; // Plus residue later
      updatedHeirs[fatherIndex].shareTextKey = shareTextKeys.sixth_with_residue;
    } else if (hasFemaleDescendants) {
      updatedHeirs[fatherIndex].share = 1/6; // Plus residue later
      updatedHeirs[fatherIndex].shareTextKey = shareTextKeys.sixth_with_residue;
    } else {
      updatedHeirs[fatherIndex].share = null; // Will get residue
      updatedHeirs[fatherIndex].shareTextKey = shareTextKeys.residue;
    }
  }

  if (hasHeir('mother')) {
    // Mother gets 1/6 if descendants or multiple siblings
    // Mother gets 1/3 if no descendants and no multiple siblings
    const motherIndex = updatedHeirs.findIndex(h => h.id === 'mother');
    const hasSiblings = (hasFullSiblings || hasPaternalSiblings || hasMaternalSiblings) &&
                        (getHeirCount('brother') + getHeirCount('sister') +
                         getHeirCount('paternal_brother') + getHeirCount('paternal_sister') +
                         getHeirCount('maternal_brother') + getHeirCount('maternal_sister') >= 2);

    if (hasDescendants || hasSiblings) {
      updatedHeirs[motherIndex].share = 1/6;
      updatedHeirs[motherIndex].shareTextKey = shareTextKeys.sixth;
    } else {
      updatedHeirs[motherIndex].share = 1/3;
      updatedHeirs[motherIndex].shareTextKey = shareTextKeys.third;
    }
  }

  // 3. Children shares
  if (hasHeir('son')) {
    // Sons get residue (shared equally among them)
    const sonIndex = updatedHeirs.findIndex(h => h.id === 'son');
    updatedHeirs[sonIndex].share = null; // Will get residue
    updatedHeirs[sonIndex].shareTextKey = shareTextKeys.residue;
  }

  if (hasHeir('daughter')) {
    // Daughters get 1/2 if one daughter and no sons
    // Daughters get 2/3 if multiple daughters and no sons
    // Daughters get residue with sons (half share of sons)
    const daughterIndex = updatedHeirs.findIndex(h => h.id === 'daughter');
    const daughterCount = getHeirCount('daughter');

    if (!hasHeir('son')) {
      if (daughterCount === 1) {
        updatedHeirs[daughterIndex].share = 1/2;
        updatedHeirs[daughterIndex].shareTextKey = shareTextKeys.half;
      } else {
        updatedHeirs[daughterIndex].share = 2/3;
        updatedHeirs[daughterIndex].shareTextKey = shareTextKeys.two_thirds;
      }
    } else {
      updatedHeirs[daughterIndex].share = null; // Will get residue with sons
      updatedHeirs[daughterIndex].shareTextKey = shareTextKeys.residue_with_son;
    }
  }

  // 4. Grandchildren (only inherit if no children)
  if (!hasHeir('son') && !hasHeir('daughter')) {
    if (hasHeir('grandson')) {
      // Grandsons get residue if no sons/daughters
      const grandsonIndex = updatedHeirs.findIndex(h => h.id === 'grandson');
      updatedHeirs[grandsonIndex].share = null; // Will get residue
      updatedHeirs[grandsonIndex].shareTextKey = shareTextKeys.residue;
    }

    if (hasHeir('granddaughter')) {
      // Granddaughters get 1/2 if one and no grandsons
      // Granddaughters get 2/3 if multiple and no grandsons
      // Granddaughters get residue with grandsons (half share)
      const granddaughterIndex = updatedHeirs.findIndex(h => h.id === 'granddaughter');
      const granddaughterCount = getHeirCount('granddaughter');

      if (!hasHeir('grandson')) {
        if (granddaughterCount === 1) {
          updatedHeirs[granddaughterIndex].share = 1/2;
          updatedHeirs[granddaughterIndex].shareTextKey = shareTextKeys.half;
        } else {
          updatedHeirs[granddaughterIndex].share = 2/3;
          updatedHeirs[granddaughterIndex].shareTextKey = shareTextKeys.two_thirds;
        }
      } else {
        updatedHeirs[granddaughterIndex].share = null; // Will get residue with grandsons
        updatedHeirs[granddaughterIndex].shareTextKey = shareTextKeys.residue_with_grandson;
      }
    }
  }

  // 5. Siblings (only inherit if no descendants and no father)
  if (!hasDescendants && !hasFather) {
    // Full siblings
    if (hasHeir('brother')) {
      const brotherIndex = updatedHeirs.findIndex(h => h.id === 'brother');
      updatedHeirs[brotherIndex].share = null; // Will get residue
      updatedHeirs[brotherIndex].shareTextKey = shareTextKeys.residue;
    }

    if (hasHeir('sister')) {
      const sisterIndex = updatedHeirs.findIndex(h => h.id === 'sister');
      const sisterCount = getHeirCount('sister');

      if (!hasHeir('brother')) {
        if (sisterCount === 1) {
          updatedHeirs[sisterIndex].share = 1/2;
          updatedHeirs[sisterIndex].shareTextKey = shareTextKeys.half;
        } else {
          updatedHeirs[sisterIndex].share = 2/3;
          updatedHeirs[sisterIndex].shareTextKey = shareTextKeys.two_thirds;
        }
      } else {
        updatedHeirs[sisterIndex].share = null; // Will get residue with brothers
        updatedHeirs[sisterIndex].shareTextKey = shareTextKeys.residue_with_brother;
      }
    }

    // Maternal siblings (only inherit if no descendants, no father, no grandfather)
    if (!hasMaleAscendants && (hasHeir('maternal_brother') || hasHeir('maternal_sister'))) {
      const maternalSiblingsCount = getHeirCount('maternal_brother') + getHeirCount('maternal_sister');

      if (hasHeir('maternal_brother')) {
        const maternalBrotherIndex = updatedHeirs.findIndex(h => h.id === 'maternal_brother');
        if (maternalSiblingsCount === 1) {
          updatedHeirs[maternalBrotherIndex].share = 1/6;
          updatedHeirs[maternalBrotherIndex].shareTextKey = shareTextKeys.sixth;
        } else {
          updatedHeirs[maternalBrotherIndex].share = 1/3 / maternalSiblingsCount;
          updatedHeirs[maternalBrotherIndex].shareTextKey = shareTextKeys.shared_third;
        }
      }

      if (hasHeir('maternal_sister')) {
        const maternalSisterIndex = updatedHeirs.findIndex(h => h.id === 'maternal_sister');
        if (maternalSiblingsCount === 1) {
          updatedHeirs[maternalSisterIndex].share = 1/6;
          updatedHeirs[maternalSisterIndex].shareTextKey = shareTextKeys.sixth;
        } else {
          updatedHeirs[maternalSisterIndex].share = 1/3 / maternalSiblingsCount;
          updatedHeirs[maternalSisterIndex].shareTextKey = shareTextKeys.shared_third_female;
        }
      }
    }
  }

  return updatedHeirs;
};

// Function to calculate final shares after applying rules
export const calculateFinalShares = (heirs: Heir[], _estateValue: number): Heir[] => {
  // Create a copy of the heirs array
  const finalHeirs = [...heirs];

  // Get selected heirs
  const selectedHeirs = finalHeirs.filter(heir => heir.selected);

  // Calculate the sum of fixed shares
  let fixedSharesSum = 0;
  selectedHeirs.forEach(heir => {
    if (heir.share !== null) {
      fixedSharesSum += heir.share;
    }
  });

  // Calculate residue after fixed shares
  const residue = Math.max(0, 1 - fixedSharesSum);

  // Count residuary heirs (asaba) - check if shareTextKey contains 'residue'
  const residuaryHeirs = selectedHeirs.filter(heir =>
    heir.selected && heir.share === null && heir.shareTextKey.includes('residue')
  );

  // Distribute residue among residuary heirs
  if (residuaryHeirs.length > 0) {
    // Calculate total units for residuary heirs
    let totalUnits = 0;

    residuaryHeirs.forEach(heir => {
      if (heir.id === 'son' || heir.id === 'grandson' || heir.id === 'brother' ||
          heir.id === 'paternal_brother' || heir.id === 'father' || heir.id === 'grandfather' ||
          heir.id === 'uncle' || heir.id === 'paternal_uncle' || heir.id === 'nephew' ||
          heir.id === 'paternal_nephew' || heir.id === 'cousin' || heir.id === 'paternal_cousin') {
        // Male heirs get 2 units each
        totalUnits += 2 * heir.count;
      } else if (heir.id === 'daughter' || heir.id === 'granddaughter' ||
                heir.id === 'sister' || heir.id === 'paternal_sister') {
        // Female heirs get 1 unit each when with male counterparts
        totalUnits += 1 * heir.count;
      }
    });

    // Assign shares based on units
    residuaryHeirs.forEach(heir => {
      const heirIndex = finalHeirs.findIndex(h => h.id === heir.id);

      if (heir.id === 'son' || heir.id === 'grandson' || heir.id === 'brother' ||
          heir.id === 'paternal_brother' || heir.id === 'father' || heir.id === 'grandfather' ||
          heir.id === 'uncle' || heir.id === 'paternal_uncle' || heir.id === 'nephew' ||
          heir.id === 'paternal_nephew' || heir.id === 'cousin' || heir.id === 'paternal_cousin') {
        // Male heirs
        finalHeirs[heirIndex].share = (residue * 2 * heir.count) / totalUnits;
      } else if (heir.id === 'daughter' || heir.id === 'granddaughter' ||
                heir.id === 'sister' || heir.id === 'paternal_sister') {
        // Female heirs
        finalHeirs[heirIndex].share = (residue * 1 * heir.count) / totalUnits;
      }
    });
  }

  return finalHeirs;
};

// Type for translation function
type TranslationFunction = (key: string, options?: Record<string, unknown>) => string;

// Function to format the results for display or export - now requires translation function
export const formatInheritanceResults = (
  heirs: Heir[],
  estateValue: number,
  t: TranslationFunction
): string => {
  const selectedHeirs = heirs.filter(heir => heir.selected);

  let result = t('inheritance-calculator.format_results', { value: estateValue.toLocaleString() }) + '\n\n';

  selectedHeirs.forEach(heir => {
    if (heir.share !== null) {
      const monetaryValue = heir.share * estateValue;
      const heirName = t(heir.nameKey);
      const shareText = t(heir.shareTextKey);
      result += `${heirName} (${heir.count}): ${shareText} - ${monetaryValue.toLocaleString()}\n`;
    }
  });

  return result;
}; 