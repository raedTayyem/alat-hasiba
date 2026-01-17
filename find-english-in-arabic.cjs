#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Configuration
const AR_LOCALE_PATH = '/Users/raedtayyem/Desktop/work/alathasiba-claudecode/public/locales/ar';

// Arabic character range
const ARABIC_REGEX = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;

// Common English words to detect
const ENGLISH_WORDS = new Set([
  'the', 'is', 'are', 'for', 'and', 'or', 'to', 'of', 'in', 'on', 'at', 'by', 'with', 'from',
  'this', 'that', 'your', 'you', 'our', 'we', 'it', 'as', 'an', 'a', 'be', 'has', 'have',
  'will', 'can', 'should', 'would', 'could', 'may', 'must', 'please', 'enter', 'select',
  'calculate', 'result', 'error', 'input', 'output', 'value', 'total', 'amount', 'rate',
  'cost', 'price', 'weight', 'height', 'length', 'width', 'area', 'volume', 'time', 'date',
  'year', 'month', 'day', 'hour', 'minute', 'second', 'number', 'percentage', 'ratio',
  'average', 'maximum', 'minimum', 'sum', 'difference', 'product', 'quotient', 'formula',
  'equation', 'calculator', 'calculation', 'convert', 'converter', 'unit', 'measure',
  'distance', 'speed', 'velocity', 'temperature', 'pressure', 'power', 'energy', 'force',
  'mass', 'density', 'frequency', 'wavelength', 'angle', 'degree', 'radian', 'circle',
  'square', 'triangle', 'rectangle', 'sphere', 'cylinder', 'cone', 'cube', 'point', 'line',
  'plane', 'surface', 'perimeter', 'circumference', 'diameter', 'radius', 'pi', 'sin', 'cos',
  'tan', 'log', 'exp', 'sqrt', 'abs', 'round', 'floor', 'ceil', 'min', 'max', 'avg', 'std',
  'var', 'mean', 'median', 'mode', 'range', 'count', 'if', 'then', 'else', 'true', 'false',
  'yes', 'no', 'on', 'off', 'start', 'stop', 'begin', 'end', 'open', 'close', 'show', 'hide',
  'add', 'remove', 'delete', 'update', 'edit', 'save', 'load', 'clear', 'reset', 'submit',
  'cancel', 'confirm', 'ok', 'done', 'next', 'previous', 'back', 'forward', 'up', 'down',
  'left', 'right', 'top', 'bottom', 'first', 'last', 'new', 'old', 'small', 'large', 'big',
  'little', 'more', 'less', 'high', 'low', 'fast', 'slow', 'easy', 'hard', 'simple', 'complex',
  'basic', 'advanced', 'free', 'paid', 'premium', 'pro', 'standard', 'custom', 'default',
  'optional', 'required', 'valid', 'invalid', 'success', 'failure', 'warning', 'info', 'debug',
  'trace', 'fatal', 'critical', 'severe', 'moderate', 'mild', 'none', 'all', 'some', 'any',
  'each', 'every', 'both', 'either', 'neither', 'other', 'another', 'same', 'different',
  'similar', 'equal', 'greater', 'lesser', 'about', 'after', 'before', 'during', 'until',
  'since', 'while', 'because', 'although', 'however', 'therefore', 'thus', 'hence', 'also',
  'too', 'only', 'just', 'even', 'still', 'already', 'yet', 'now', 'then', 'here', 'there',
  'where', 'when', 'why', 'how', 'what', 'which', 'who', 'whom', 'whose', 'whatever',
  'whoever', 'whichever', 'whenever', 'wherever',
  // Additional common words
  'button', 'click', 'page', 'form', 'field', 'label', 'text', 'name', 'email', 'phone',
  'address', 'city', 'country', 'state', 'zip', 'code', 'password', 'username', 'login',
  'logout', 'register', 'sign', 'account', 'profile', 'settings', 'home', 'search', 'filter',
  'sort', 'list', 'table', 'grid', 'view', 'detail', 'details', 'description', 'title',
  'content', 'message', 'notification', 'alert', 'status', 'type', 'category', 'tag', 'image',
  'photo', 'video', 'audio', 'file', 'document', 'folder', 'upload', 'download', 'share',
  'print', 'export', 'import', 'copy', 'paste', 'cut', 'undo', 'redo', 'help', 'support',
  'contact', 'feedback', 'comment', 'review', 'rating', 'like', 'dislike', 'favorite',
  'bookmark', 'follow', 'unfollow', 'subscribe', 'unsubscribe', 'send', 'receive', 'reply',
  'forward', 'attach', 'attachment', 'link', 'url', 'website', 'web', 'online', 'offline',
  'connect', 'disconnect', 'sync', 'refresh', 'reload', 'restart', 'shutdown', 'power',
  'battery', 'charge', 'charging', 'full', 'empty', 'low', 'medium', 'high', 'very',
  'much', 'many', 'few', 'several', 'most', 'least', 'best', 'worst', 'better', 'worse',
  'good', 'bad', 'great', 'poor', 'excellent', 'average', 'normal', 'special', 'general',
  'specific', 'particular', 'common', 'rare', 'unique', 'original', 'modified', 'changed',
  'updated', 'created', 'deleted', 'removed', 'added', 'inserted', 'replaced', 'moved',
  'copied', 'pasted', 'selected', 'deselected', 'checked', 'unchecked', 'enabled', 'disabled',
  'active', 'inactive', 'visible', 'hidden', 'shown', 'public', 'private', 'protected',
  'secure', 'insecure', 'safe', 'unsafe', 'dangerous', 'risk', 'risky', 'important',
  'not', 'note', 'notes', 'item', 'items', 'option', 'options', 'choice', 'choices',
  'step', 'steps', 'level', 'levels', 'section', 'sections', 'part', 'parts', 'chapter',
  'version', 'release', 'build', 'test', 'testing', 'debug', 'debugging', 'run', 'running',
  'stop', 'stopped', 'pause', 'paused', 'resume', 'resumed', 'complete', 'completed',
  'incomplete', 'pending', 'processing', 'processed', 'loading', 'loaded', 'saving', 'saved',
  'reading', 'writing', 'written', 'read', 'sent', 'received', 'failed', 'succeeded',
  'passed', 'approved', 'rejected', 'accepted', 'denied', 'allowed', 'blocked', 'banned',
  'suspended', 'expired', 'renewed', 'extended', 'shortened', 'increased', 'decreased',
  'doubled', 'halved', 'tripled', 'quadrupled', 'multiplied', 'divided', 'added', 'subtracted',
  'calculated', 'computed', 'estimated', 'measured', 'counted', 'tracked', 'monitored',
  'analyzed', 'evaluated', 'assessed', 'reviewed', 'verified', 'validated', 'confirmed',
  'authenticated', 'authorized', 'certified', 'licensed', 'registered', 'signed', 'unsigned',
  'encrypted', 'decrypted', 'compressed', 'decompressed', 'archived', 'extracted', 'installed',
  'uninstalled', 'configured', 'customized', 'personalized', 'optimized', 'minimized',
  'maximized', 'normalized', 'standardized', 'formatted', 'parsed', 'converted', 'transformed',
  'translated', 'localized', 'internationalized', 'globalized', 'unified', 'merged', 'split',
  'separated', 'combined', 'joined', 'linked', 'unlinked', 'connected', 'disconnected',
  'attached', 'detached', 'associated', 'disassociated', 'related', 'unrelated', 'dependent',
  'independent', 'required', 'optional', 'mandatory', 'recommended', 'suggested', 'preferred',
  'alternative', 'backup', 'restore', 'recovered', 'lost', 'found', 'missing', 'available',
  'unavailable', 'accessible', 'inaccessible', 'reachable', 'unreachable', 'supported',
  'unsupported', 'compatible', 'incompatible', 'working', 'broken', 'fixed', 'repaired',
  // Calculator-specific words
  'bmi', 'bmr', 'tdee', 'macro', 'calorie', 'calories', 'protein', 'carb', 'carbs', 'fat',
  'fats', 'fiber', 'sodium', 'sugar', 'vitamin', 'mineral', 'nutrient', 'nutrition',
  'diet', 'fitness', 'exercise', 'workout', 'training', 'cardio', 'strength', 'endurance',
  'flexibility', 'balance', 'coordination', 'agility', 'speed', 'stamina', 'recovery',
  'rest', 'sleep', 'hydration', 'water', 'fluid', 'intake', 'output', 'burn', 'burned',
  'consumed', 'spent', 'gained', 'lost', 'maintained', 'target', 'goal', 'goals', 'progress',
  'achievement', 'milestone', 'record', 'personal', 'best', 'history', 'chart', 'graph',
  'trend', 'pattern', 'analysis', 'report', 'summary', 'overview', 'dashboard', 'metric',
  'metrics', 'stat', 'stats', 'statistic', 'statistics', 'data', 'information', 'insight',
  'insights', 'recommendation', 'recommendations', 'tip', 'tips', 'advice', 'guide',
  'guidelines', 'instructions', 'manual', 'tutorial', 'example', 'examples', 'sample',
  'samples', 'demo', 'demonstration', 'preview', 'template', 'templates', 'preset',
  'presets', 'configuration', 'setup', 'initialization', 'calibration', 'adjustment',
  'modification', 'customization', 'personalization', 'preference', 'preferences',
  // Financial terms
  'loan', 'mortgage', 'interest', 'principal', 'payment', 'installment', 'down', 'deposit',
  'balance', 'credit', 'debit', 'account', 'bank', 'banking', 'finance', 'financial',
  'investment', 'investor', 'investing', 'return', 'profit', 'loss', 'gain', 'income',
  'expense', 'expenses', 'budget', 'budgeting', 'saving', 'savings', 'spending', 'tax',
  'taxes', 'taxation', 'vat', 'gross', 'net', 'margin', 'markup', 'discount', 'sale',
  'sales', 'revenue', 'cash', 'flow', 'asset', 'assets', 'liability', 'liabilities',
  'equity', 'stock', 'stocks', 'bond', 'bonds', 'fund', 'funds', 'portfolio', 'diversification',
  'allocation', 'risk', 'reward', 'volatility', 'liquidity', 'compound', 'compounding',
  'annual', 'monthly', 'weekly', 'daily', 'quarterly', 'yearly', 'period', 'term', 'duration',
  'maturity', 'amortization', 'depreciation', 'appreciation', 'inflation', 'deflation',
  // Construction terms
  'concrete', 'cement', 'steel', 'rebar', 'wood', 'lumber', 'brick', 'block', 'stone',
  'gravel', 'sand', 'aggregate', 'mortar', 'plaster', 'drywall', 'insulation', 'roofing',
  'siding', 'flooring', 'tile', 'tiles', 'paint', 'coating', 'sealant', 'adhesive',
  'fastener', 'nail', 'screw', 'bolt', 'nut', 'washer', 'anchor', 'bracket', 'beam',
  'column', 'joist', 'rafter', 'truss', 'foundation', 'footing', 'slab', 'wall', 'roof',
  'ceiling', 'door', 'window', 'frame', 'framing', 'structure', 'structural', 'load',
  'bearing', 'span', 'pitch', 'slope', 'grade', 'level', 'plumb', 'square', 'layout',
  'excavation', 'grading', 'backfill', 'compaction', 'drainage', 'waterproofing',
  // Electrical terms
  'voltage', 'current', 'resistance', 'ohm', 'ohms', 'watt', 'watts', 'amp', 'amps',
  'ampere', 'amperes', 'volt', 'volts', 'circuit', 'circuits', 'wire', 'wiring', 'cable',
  'conductor', 'insulator', 'ground', 'grounding', 'neutral', 'phase', 'single', 'three',
  'ac', 'dc', 'alternating', 'direct', 'frequency', 'hertz', 'hz', 'capacitor', 'resistor',
  'inductor', 'transformer', 'breaker', 'fuse', 'switch', 'outlet', 'receptacle', 'plug',
  'socket', 'panel', 'box', 'conduit', 'raceway', 'junction', 'terminal', 'connector',
  // Pet terms
  'dog', 'cat', 'pet', 'pets', 'animal', 'animals', 'breed', 'age', 'weight', 'size',
  'food', 'feeding', 'nutrition', 'health', 'vet', 'veterinary', 'vaccination', 'vaccine',
  'medication', 'treatment', 'grooming', 'exercise', 'walk', 'walking', 'play', 'playing',
  'training', 'behavior', 'behavioral', 'puppy', 'kitten', 'adult', 'senior', 'lifespan',
  // Automotive terms
  'car', 'vehicle', 'auto', 'automotive', 'engine', 'motor', 'fuel', 'gas', 'gasoline',
  'diesel', 'electric', 'hybrid', 'battery', 'tire', 'tires', 'wheel', 'wheels', 'brake',
  'brakes', 'transmission', 'gear', 'gears', 'oil', 'coolant', 'fluid', 'filter', 'spark',
  'plug', 'plugs', 'belt', 'hose', 'pump', 'alternator', 'starter', 'radiator', 'exhaust',
  'muffler', 'catalytic', 'converter', 'suspension', 'shock', 'strut', 'spring', 'axle',
  'differential', 'driveshaft', 'cv', 'joint', 'steering', 'alignment', 'rotation', 'balance',
  'mileage', 'odometer', 'speedometer', 'tachometer', 'gauge', 'indicator', 'warning',
  'light', 'lights', 'headlight', 'taillight', 'signal', 'horn', 'wiper', 'wipers',
  'mirror', 'seat', 'seats', 'seatbelt', 'airbag', 'safety', 'crash', 'collision', 'accident',
  // Additional technical terms
  'sensor', 'actuator', 'controller', 'module', 'component', 'system', 'subsystem', 'interface',
  'protocol', 'standard', 'specification', 'requirement', 'parameter', 'variable', 'constant',
  'function', 'method', 'class', 'object', 'array', 'string', 'integer', 'float', 'boolean',
  'null', 'undefined', 'error', 'exception', 'warning', 'message', 'log', 'debug', 'trace',
  'info', 'verbose', 'silent', 'quiet', 'loud', 'echo', 'print', 'display', 'render', 'draw',
  // Environmental terms
  'carbon', 'footprint', 'emission', 'emissions', 'greenhouse', 'gas', 'climate', 'change',
  'global', 'warming', 'sustainability', 'sustainable', 'renewable', 'solar', 'wind', 'hydro',
  'geothermal', 'biomass', 'biofuel', 'recycling', 'recycle', 'waste', 'pollution', 'pollutant',
  'contamination', 'clean', 'green', 'eco', 'ecological', 'environment', 'environmental',
  // Real estate terms
  'property', 'real', 'estate', 'house', 'home', 'apartment', 'condo', 'condominium', 'townhouse',
  'land', 'lot', 'acre', 'acres', 'sqft', 'sqm', 'bedroom', 'bathroom', 'kitchen', 'living',
  'room', 'dining', 'garage', 'basement', 'attic', 'yard', 'garden', 'pool', 'deck', 'patio',
  'porch', 'balcony', 'terrace', 'fence', 'gate', 'driveway', 'parking', 'storage', 'closet',
  'rent', 'rental', 'lease', 'tenant', 'landlord', 'owner', 'buyer', 'seller', 'agent', 'broker',
  'commission', 'closing', 'escrow', 'title', 'deed', 'appraisal', 'inspection', 'assessment',
  // Add more specific words that might appear
  'calculator', 'tool', 'tools', 'feature', 'features', 'service', 'services', 'app', 'application',
  'software', 'hardware', 'device', 'devices', 'mobile', 'desktop', 'tablet', 'browser', 'chrome',
  'firefox', 'safari', 'edge', 'opera', 'android', 'ios', 'windows', 'macos', 'linux', 'unix',
]);

// Technical terms to exclude (acronyms and known technical identifiers)
const EXCLUDED_TERMS = new Set([
  'API', 'URL', 'HTTP', 'HTTPS', 'JSON', 'XML', 'HTML', 'CSS', 'JS', 'PDF', 'PNG', 'JPG', 'GIF',
  'SVG', 'MP3', 'MP4', 'USD', 'EUR', 'GBP', 'LED', 'LCD', 'USB', 'RAM', 'ROM', 'CPU', 'GPU',
  'SSD', 'HDD', 'WiFi', 'GPS', 'SMS', 'MMS', 'PIN', 'ATM', 'ISBN', 'ISSN', 'DOI', 'DNA', 'RNA',
  'HIV', 'AIDS', 'CEO', 'CFO', 'CTO', 'COO', 'HR', 'PR', 'IT', 'AI', 'ML', 'VR', 'AR', 'IoT',
  'SaaS', 'PaaS', 'IaaS', 'B2B', 'B2C', 'ROI', 'KPI', 'SEO', 'SEM', 'PPC', 'CPC', 'CPM', 'CTR',
  'CRM', 'ERP', 'CMS', 'LMS', 'MVP', 'POC', 'POV', 'FAQ', 'TBD', 'TBA', 'N/A', 'vs', 'etc',
  'eg', 'ie', 'aka', 'asap', 'DIY', 'RSVP', 'PS', 'NB', 'FYI', 'BTW', 'IMO', 'IMHO', 'AFAIK',
  'TLDR', 'YMMV', 'FWIW', 'ID', 'UI', 'UX', 'QA', 'DB', 'SQL', 'NoSQL', 'TCP', 'IP', 'FTP',
  'SSH', 'SSL', 'TLS', 'VPN', 'LAN', 'WAN', 'MAC', 'DHCP', 'DNS', 'CDN', 'AWS', 'GCP', 'CI',
  'CD', 'npm', 'git', 'SVN', 'CSV', 'TSV', 'YAML', 'TOML', 'INI', 'ENV', 'JWT', 'OAuth', 'SAML',
  'LDAP', 'SSO', 'MFA', '2FA', 'OTP', 'RSA', 'AES', 'MD5', 'SHA', 'BASE64', 'UUID', 'GUID',
  'ISO', 'UTC', 'GMT', 'AM', 'PM', 'AD', 'BC', 'CE', 'BCE', 'kg', 'lb', 'oz', 'g', 'mg', 'km',
  'mi', 'ft', 'in', 'cm', 'mm', 'm', 'yd', 'L', 'mL', 'gal', 'qt', 'pt', 'fl', 'oz', 'kW',
  'MW', 'GW', 'kWh', 'MWh', 'BTU', 'HP', 'PS', 'CV', 'RPM', 'MPH', 'KPH', 'FPS', 'Mbps', 'Gbps',
  'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'Kb', 'Mb', 'Gb', 'Hz', 'kHz', 'MHz', 'GHz', 'dB', 'dBm',
  'AC', 'DC', 'V', 'A', 'mA', 'W', 'kW', 'VA', 'kVA', 'PF', 'AWG', 'MCM', 'NEC', 'NFPA', 'UL',
  'CSA', 'CE', 'FCC', 'RoHS', 'WEEE', 'EMC', 'EMI', 'RFI', 'ESD', 'IP67', 'IP68', 'NEMA',
  'SAE', 'JIS', 'DIN', 'ANSI', 'ASTM', 'IEEE', 'IEC', 'OSHA', 'EPA', 'FDA', 'USDA', 'NIH',
  'CDC', 'WHO', 'UN', 'EU', 'UK', 'US', 'USA', 'UAE', 'KSA', 'BMI', 'BMR', 'TDEE', 'RDA',
  'DV', 'AI', 'UL', 'EAR', 'AMDR', 'DRI', 'WHO', 'AHA', 'ACC', 'ACSM', 'NSCA', 'ACE', 'NASM',
  'CrossFit', 'HIIT', 'LISS', 'NEAT', 'RMR', 'REE', 'TEF', 'PAL', 'MET', 'METs', 'VO2', 'HR',
  'HRR', 'HRmax', 'RPE', 'RM', '1RM', 'PR', 'PB', 'DOMS', 'ROM', 'TUT', 'AMRAP', 'EMOM', 'WOD',
  'PSI', 'BAR', 'PA', 'kPa', 'MPa', 'ATM', 'mmHg', 'inHg', 'mbar', 'Torr', 'PSF', 'PLF',
  // Currency codes
  'SAR', 'AED', 'QAR', 'BHD', 'KWD', 'OMR', 'JOD', 'EGP', 'LBP', 'IQD', 'SYP', 'YER', 'MAD',
  'DZD', 'TND', 'LYD', 'SDG', 'MRU', 'SOS', 'DJF', 'KMF', 'INR', 'PKR', 'BDT', 'LKR', 'NPR',
  'CNY', 'JPY', 'KRW', 'TWD', 'HKD', 'SGD', 'MYR', 'THB', 'IDR', 'PHP', 'VND', 'AUD', 'NZD',
  'CAD', 'MXN', 'BRL', 'ARS', 'CLP', 'COP', 'PEN', 'CHF', 'SEK', 'NOK', 'DKK', 'PLN', 'CZK',
  'HUF', 'RON', 'BGN', 'HRK', 'RUB', 'UAH', 'TRY', 'ZAR', 'NGN', 'KES', 'GHS', 'XOF', 'XAF',
]);

// Patterns to exclude
const URL_PATTERN = /^(https?:\/\/|www\.)/i;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FILE_PATH_PATTERN = /^(\/|\.\/|\.\.\/|[a-zA-Z]:\\)/;
const PURE_NUMBER_PATTERN = /^[\d.,\s%$€£¥₹₽₴₦₱₪₨฿₫₭₮₯₰₱₲₳₴₵₸₹₺₻₼₽₾₿+-×÷=<>()[\]{}]+$/;
const SINGLE_CHAR_PATTERN = /^.$/;

// Get all JSON files recursively
function getAllJsonFiles(dir) {
  const files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getAllJsonFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.json')) {
      files.push(fullPath);
    }
  }

  return files;
}

// Flatten nested object to get all key-value pairs
function flattenObject(obj, prefix = '') {
  const result = [];

  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      result.push(...flattenObject(value, fullKey));
    } else if (typeof value === 'string') {
      result.push({ key: fullKey, value });
    } else if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (typeof item === 'string') {
          result.push({ key: `${fullKey}[${index}]`, value: item });
        } else if (typeof item === 'object') {
          result.push(...flattenObject(item, `${fullKey}[${index}]`));
        }
      });
    }
  }

  return result;
}

// Check if a value should be excluded
function shouldExclude(value) {
  if (!value || typeof value !== 'string') return true;

  const trimmed = value.trim();

  // Exclude empty strings
  if (!trimmed) return true;

  // Exclude single characters
  if (SINGLE_CHAR_PATTERN.test(trimmed)) return true;

  // Exclude pure numbers/symbols
  if (PURE_NUMBER_PATTERN.test(trimmed)) return true;

  // Exclude URLs
  if (URL_PATTERN.test(trimmed)) return true;

  // Exclude emails
  if (EMAIL_PATTERN.test(trimmed)) return true;

  // Exclude file paths
  if (FILE_PATH_PATTERN.test(trimmed)) return true;

  // Exclude if it's just a technical term
  if (EXCLUDED_TERMS.has(trimmed.toUpperCase())) return true;

  return false;
}

// Check if value contains Arabic characters
function hasArabicCharacters(value) {
  return ARABIC_REGEX.test(value);
}

// Check if value starts with English letter
function startsWithEnglish(value) {
  return /^[a-zA-Z]/.test(value.trim());
}

// Extract English words from a value
function findEnglishWords(value) {
  const words = value.match(/[a-zA-Z]+/g) || [];
  const englishWords = [];

  for (const word of words) {
    const lowerWord = word.toLowerCase();
    const upperWord = word.toUpperCase();

    // Skip if it's an excluded technical term
    if (EXCLUDED_TERMS.has(upperWord) || EXCLUDED_TERMS.has(word)) continue;

    // Skip very short words (1-2 chars) unless they're known English words
    if (word.length <= 2 && !ENGLISH_WORDS.has(lowerWord)) continue;

    // Check if it's a known English word
    if (ENGLISH_WORDS.has(lowerWord)) {
      englishWords.push(word);
    } else if (word.length >= 3) {
      // For longer words not in our list, check if they look like English
      // (contains common English patterns)
      const looksLikeEnglish = /^[a-zA-Z]{3,}$/.test(word) &&
        !EXCLUDED_TERMS.has(upperWord) &&
        !/^[A-Z]{2,}$/.test(word); // Skip all-caps abbreviations

      if (looksLikeEnglish) {
        englishWords.push(word);
      }
    }
  }

  return [...new Set(englishWords)]; // Remove duplicates
}

// Determine severity based on content analysis
function determineSeverity(value, englishWords, hasArabic) {
  if (!hasArabic) {
    // No Arabic at all - HIGH severity
    return 'HIGH';
  }

  // Count total characters (excluding spaces and punctuation)
  const totalChars = value.replace(/[\s\p{P}\p{S}\d]/gu, '').length;
  const arabicChars = (value.match(/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/g) || []).length;
  const englishChars = (value.match(/[a-zA-Z]/g) || []).length;

  if (totalChars === 0) return 'LOW';

  const englishRatio = englishChars / totalChars;

  if (englishRatio > 0.7) return 'HIGH';
  if (englishRatio > 0.3) return 'MEDIUM';
  if (englishWords.length > 3) return 'MEDIUM';
  return 'LOW';
}

// Analyze a single value for English content
function analyzeValue(value) {
  if (shouldExclude(value)) {
    return null;
  }

  const hasArabic = hasArabicCharacters(value);
  const startsEnglish = startsWithEnglish(value);
  const englishWords = findEnglishWords(value);

  // Determine if this is a problem
  const noArabic = !hasArabic && value.match(/[a-zA-Z]/);
  const hasEnglishWords = englishWords.length > 0;

  if (!noArabic && !hasEnglishWords && !startsEnglish) {
    return null;
  }

  const severity = determineSeverity(value, englishWords, hasArabic);

  return {
    hasArabic,
    startsWithEnglish: startsEnglish,
    englishWords,
    severity,
    issues: [
      ...(noArabic ? ['NO_ARABIC_CHARACTERS'] : []),
      ...(startsEnglish ? ['STARTS_WITH_ENGLISH'] : []),
      ...(hasEnglishWords ? ['CONTAINS_ENGLISH_WORDS'] : []),
    ]
  };
}

// Main analysis function
function analyzeTranslationFiles() {
  const results = [];
  const summary = {
    totalFiles: 0,
    totalKeys: 0,
    totalIssues: 0,
    bySeverity: { HIGH: 0, MEDIUM: 0, LOW: 0 },
    byIssueType: {
      NO_ARABIC_CHARACTERS: 0,
      STARTS_WITH_ENGLISH: 0,
      CONTAINS_ENGLISH_WORDS: 0,
    }
  };

  const jsonFiles = getAllJsonFiles(AR_LOCALE_PATH);
  summary.totalFiles = jsonFiles.length;

  console.log(`\n${'='.repeat(80)}`);
  console.log('ARABIC TRANSLATION FILE ANALYSIS - ENGLISH TEXT DETECTION');
  console.log(`${'='.repeat(80)}\n`);
  console.log(`Analyzing ${jsonFiles.length} JSON files...\n`);

  for (const filePath of jsonFiles) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const json = JSON.parse(content);
      const flattenedPairs = flattenObject(json);

      summary.totalKeys += flattenedPairs.length;

      for (const { key, value } of flattenedPairs) {
        const analysis = analyzeValue(value);

        if (analysis) {
          const relativePath = path.relative(AR_LOCALE_PATH, filePath);

          results.push({
            file: relativePath,
            fullPath: filePath,
            key,
            value,
            ...analysis
          });

          summary.totalIssues++;
          summary.bySeverity[analysis.severity]++;

          for (const issue of analysis.issues) {
            summary.byIssueType[issue]++;
          }
        }
      }
    } catch (error) {
      console.error(`Error processing ${filePath}: ${error.message}`);
    }
  }

  // Sort results by severity (HIGH first), then by file
  results.sort((a, b) => {
    const severityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
    if (severityOrder[a.severity] !== severityOrder[b.severity]) {
      return severityOrder[a.severity] - severityOrder[b.severity];
    }
    return a.file.localeCompare(b.file);
  });

  return { results, summary };
}

// Format and print results
function printResults({ results, summary }) {
  // Print summary
  console.log(`${'='.repeat(80)}`);
  console.log('SUMMARY');
  console.log(`${'='.repeat(80)}`);
  console.log(`Total files analyzed: ${summary.totalFiles}`);
  console.log(`Total key-value pairs: ${summary.totalKeys}`);
  console.log(`Total issues found: ${summary.totalIssues}`);
  console.log(`\nBy Severity:`);
  console.log(`  HIGH:   ${summary.bySeverity.HIGH} (mostly or entirely English)`);
  console.log(`  MEDIUM: ${summary.bySeverity.MEDIUM} (mixed Arabic/English)`);
  console.log(`  LOW:    ${summary.bySeverity.LOW} (few English words)`);
  console.log(`\nBy Issue Type:`);
  console.log(`  No Arabic characters:     ${summary.byIssueType.NO_ARABIC_CHARACTERS}`);
  console.log(`  Starts with English:      ${summary.byIssueType.STARTS_WITH_ENGLISH}`);
  console.log(`  Contains English words:   ${summary.byIssueType.CONTAINS_ENGLISH_WORDS}`);

  // Print detailed results by severity
  for (const severity of ['HIGH', 'MEDIUM', 'LOW']) {
    const severityResults = results.filter(r => r.severity === severity);

    if (severityResults.length === 0) continue;

    console.log(`\n${'='.repeat(80)}`);
    console.log(`${severity} SEVERITY ISSUES (${severityResults.length})`);
    console.log(`${'='.repeat(80)}`);

    let currentFile = '';
    for (const result of severityResults) {
      if (result.file !== currentFile) {
        currentFile = result.file;
        console.log(`\n--- File: ${currentFile} ---`);
      }

      console.log(`\n  Key: ${result.key}`);
      console.log(`  Value: "${result.value}"`);
      if (result.englishWords.length > 0) {
        console.log(`  English words: [${result.englishWords.join(', ')}]`);
      }
      console.log(`  Issues: ${result.issues.join(', ')}`);
    }
  }

  // Output JSON report
  const reportPath = '/Users/raedtayyem/Desktop/work/alathasiba-claudecode/english-in-arabic-report.json';
  const report = {
    generatedAt: new Date().toISOString(),
    summary,
    results: results.map(r => ({
      file: r.file,
      fullPath: r.fullPath,
      key: r.key,
      value: r.value,
      englishWords: r.englishWords,
      severity: r.severity,
      issues: r.issues
    }))
  };

  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\n${'='.repeat(80)}`);
  console.log(`JSON report saved to: ${reportPath}`);
  console.log(`${'='.repeat(80)}\n`);
}

// Run the analysis
const analysisResults = analyzeTranslationFiles();
printResults(analysisResults);
