/**
 * Enhanced helper utility for RTL date input support across the application
 * This applies necessary classes and attributes to ensure consistent behavior
 * with additional support for dynamically added inputs and shadow DOM
 */

// Observer to handle dynamically added date inputs
let dateInputObserver: MutationObserver | null = null;

// Function to initialize RTL styling for all date inputs
export function initDateInputRTL() {
  if (typeof document === 'undefined') return; // Guard for SSR
  
  try {
    // Apply to all date inputs on the page
    const dateInputs = document.querySelectorAll('input[type="date"]');
    
    dateInputs.forEach((input) => enhanceDateInput(input as HTMLInputElement));
    
    // Set up observer for future date inputs
    setupDateInputObserver();
    
    // Apply to specific wrappers that might contain date inputs
    applyToSpecificWrappers();
    
    // Add the global style tag instead of relying on external CSS
    addGlobalDateInputStyles();
  } catch (error) {
    console.error('Error initializing RTL date inputs:', error);
  }
}

// Function to initialize date input on a specific container
export function initDateInputRTLOnContainer(container: HTMLElement) {
  if (!container) return;
  
  try {
    const dateInputs = container.querySelectorAll('input[type="date"]');
    dateInputs.forEach((input) => enhanceDateInput(input as HTMLInputElement));
    
    // Observer for this specific container
    const observer = new MutationObserver((mutations) => {
      try {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList') {
            mutation.addedNodes.forEach((node) => {
              // Handle new element
              if (node.nodeType === Node.ELEMENT_NODE) {
                const element = node as HTMLElement;
                
                // Check if it's a date input
                if (element.tagName === 'INPUT' && element.getAttribute('type') === 'date') {
                  enhanceDateInput(element as HTMLInputElement);
                }
                
                // Check children
                const childDateInputs = element.querySelectorAll('input[type="date"]');
                childDateInputs.forEach((input) => enhanceDateInput(input as HTMLInputElement));
              }
            });
          }
        });
      } catch (error) {
        console.error('Error in mutation observer:', error);
      }
    });
    
    // Start observing with configuration
    observer.observe(container, { 
      childList: true, 
      subtree: true 
    });
    
    return observer;
  } catch (error) {
    console.error('Error initializing container RTL date inputs:', error);
    return null;
  }
}

// Add global styles for date inputs directly via JavaScript
function addGlobalDateInputStyles() {
  try {
    // Check if the style tag already exists
    if (document.getElementById('rtl-date-input-styles')) return;
    
    // Create a style element
    const style = document.createElement('style');
    style.id = 'rtl-date-input-styles';
    style.textContent = `
      /* Date input RTL styles */
      input[type="date"] {
        direction: rtl !important;
        text-align: right !important;
        position: relative !important;
        width: 100% !important;
        padding-left: 30px !important;
        padding-right: 10px !important;
      }
      
      /* Fix for specific calculators */
      .AgeCalculator input[type="date"],
      .PregnancyCalculator input[type="date"],
      .BiorhythmCalculator input[type="date"],
      .DateCalculator input[type="date"],
      .DayOfWeekCalculator input[type="date"],
      .BarBatMitzvahCalculator input[type="date"],
      .LunarAgeCalculator input[type="date"],
      .NumerologyCalculator input[type="date"] {
        text-align: right !important;
        direction: rtl !important;
      }
    `;
    
    // Append the style element to the document head
    document.head.appendChild(style);
  } catch (error) {
    console.error('Error adding global date input styles:', error);
  }
}

// Helper to enhance individual date inputs
function enhanceDateInput(input: HTMLInputElement) {
  if (!input) return;
  
  try {
    // Add the RTL class
    if (!input.classList.contains('date-input-rtl')) {
      input.classList.add('date-input-rtl');
    }
    
    // Remove any LTR classes
    if (input.classList.contains('ltr')) {
      input.classList.remove('ltr');
    }
    if (input.classList.contains('dir-ltr')) {
      input.classList.remove('dir-ltr');
    }
    
    // Make sure the input is RTL
    input.setAttribute('dir', 'rtl');
    
    // Force RTL text alignment using inline styles (highest specificity)
    input.style.textAlign = 'right';
    input.style.direction = 'rtl';
    input.style.width = '100%';
    input.style.position = 'relative';
    input.style.paddingLeft = '30px';
    input.style.paddingRight = '10px';
    
    // Add specific attributions for browsers
    input.setAttribute('data-rtl-enhanced', 'true');
    
    // Add a specific event listener to maintain RTL settings
    if (!input.getAttribute('data-rtl-listener')) {
      input.addEventListener('focus', () => {
        // Reapply RTL settings when input is focused
        input.style.textAlign = 'right';
        input.style.direction = 'rtl';
      });
      input.setAttribute('data-rtl-listener', 'true');
    }
  } catch (error) {
    console.error('Error enhancing date input:', error);
  }
}

// Apply to specific wrappers that might be used in calculators
function applyToSpecificWrappers() {
  try {
    // Common calculator classes that might contain date inputs
    const wrapperSelectors = [
      '.AgeCalculator', 
      '.PregnancyCalculator', 
      '.BiorhythmCalculator',
      '.DateCalculator',
      '.DayOfWeekCalculator',
      '.BarBatMitzvahCalculator',
      '.LunarAgeCalculator',
      '.NumerologyCalculator',
      '.date-wrapper',
      '.date-field',
      '.input-date-container',
      '.date-input-container'
    ];
    
    wrapperSelectors.forEach(selector => {
      const wrappers = document.querySelectorAll(selector);
      wrappers.forEach(wrapper => {
        const dateInputs = wrapper.querySelectorAll('input[type="date"]');
        dateInputs.forEach((input) => enhanceDateInput(input as HTMLInputElement));
      });
    });
  } catch (error) {
    console.error('Error applying to specific wrappers:', error);
  }
}

// Setup observer for dynamic content
function setupDateInputObserver() {
  try {
    if (dateInputObserver) {
      dateInputObserver.disconnect();
    }
    
    dateInputObserver = new MutationObserver((mutations) => {
      let shouldScan = false;
      
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          shouldScan = true;
        }
      });
      
      if (shouldScan) {
        try {
          // Scan for new date inputs
          document.querySelectorAll('input[type="date"]:not([data-rtl-enhanced="true"])')
            .forEach((input) => enhanceDateInput(input as HTMLInputElement));
          
          // Also reapply to all date inputs periodically to ensure styles are maintained
          applyToSpecificWrappers();
        } catch (error) {
          console.error('Error in mutation observer scan:', error);
        }
      }
    });
    
    // Start observing with configuration
    dateInputObserver.observe(document.body, { 
      childList: true, 
      subtree: true 
    });
  } catch (error) {
    console.error('Error setting up date input observer:', error);
  }
}

// Enhance RTL functionality for calculator-specific elements
export const enhanceCalculatorRTL = () => {
  const isRTL = document.documentElement.dir === 'rtl';
  
  if (!isRTL) return;
  
  // Enhanced RTL styles for calculator components
  const enhancedStyles = `
    /* Calculator-specific RTL enhancements */
    .calculator-container[dir="rtl"] {
      direction: rtl;
      text-align: right;
    }
    
    .calculator-container[dir="rtl"] .result-display {
      text-align: right;
      padding-inline-start: 1rem;
      padding-inline-end: 0;
    }
    
    .calculator-container[dir="rtl"] .input-group {
      direction: rtl;
    }
    
    .calculator-container[dir="rtl"] .button-group {
      flex-direction: row-reverse;
      justify-content: flex-start;
      gap: 0.5rem;
    }
    
    .calculator-container[dir="rtl"] .formula-display {
      text-align: right;
      font-family: 'Cairo', monospace;
      direction: ltr; /* Formulas should remain LTR */
      unicode-bidi: plaintext;
    }
    
    .calculator-container[dir="rtl"] .grid-layout {
      direction: rtl;
    }
    
    .calculator-container[dir="rtl"] .sidebar {
      border-inline-start: 1px solid var(--border);
      border-inline-end: none;
      padding-inline-start: 1rem;
      padding-inline-end: 0;
    }
    
    /* Enhanced RTL for number inputs in calculators */
    .calculator-container[dir="rtl"] input[type="number"] {
      text-align: right;
      padding-inline-start: 0.75rem;
      padding-inline-end: 0.75rem;
    }
    
    /* RTL for calculator buttons */
    .calculator-container[dir="rtl"] .btn-primary {
      margin-inline-start: 0.5rem;
      margin-inline-end: 0;
    }
    
    /* RTL for error messages */
    .calculator-container[dir="rtl"] .error-message {
      text-align: right;
      border-inline-start: 3px solid var(--error);
      border-inline-end: none;
      padding-inline-start: 0.75rem;
    }
    
    /* RTL for tooltips */
    .calculator-container[dir="rtl"] .tooltip {
      text-align: right;
      left: auto;
      right: 0;
      transform: translateX(100%);
    }
    
    /* RTL for result cards */
    .calculator-container[dir="rtl"] .result-card {
      text-align: right;
    }
    
    .calculator-container[dir="rtl"] .result-value {
      direction: ltr;
      text-align: right;
      unicode-bidi: embed;
    }
  `;
  
  // Create or update style element
  let styleElement = document.getElementById('calculator-rtl-styles');
  if (!styleElement) {
    styleElement = document.createElement('style');
    styleElement.id = 'calculator-rtl-styles';
    styleElement.textContent = enhancedStyles;
    document.head.appendChild(styleElement);
  }
};

export default {
  initDateInputRTL,
  initDateInputRTLOnContainer,
  enhanceDateInput,
  enhanceCalculatorRTL
}; 