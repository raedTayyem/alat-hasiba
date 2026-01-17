import { Calculator } from './types';

// Subdirectory Calculators
const subdirectoryCalculators: Calculator[] = [
  // Islamic Inheritance
  {
    id: 1004,
    name: 'حاسبة المواريث الإسلامية',
    nameEn: 'Islamic Inheritance Calculator',
    slug: 'islamic-inheritance',
    description: 'حاسبة المواريث وفق الشريعة الإسلامية',
    descriptionEn: 'Free online Islamic inheritance calculator based on Sharia law. Calculate estate distribution among heirs accurately.',
    category: 'finance',
    icon: '📜',
    popularity: 7,
    componentName: 'InheritanceCalculator'
  },
  // Yazidi Calendar
    {
      id: 1007,
      name: 'تقويم يزيدي',
      nameEn: 'Yazidi Calendar Converter',
      slug: 'yazidi-calendar',
      description: 'حاسبة التقويم اليزيدي وتحويل التواريخ',
      descriptionEn: 'Free online Yazidi calendar converter. Convert dates between Gregorian and Yazidi calendar systems instantly.',
      category: 'date-time',
      icon: '📅',
      popularity: 3,
      componentName: 'YazidiCalendar'
    }
];

// --- Add the 14 new calculator entries below ---
const newSubdirectoryCalculators: Calculator[] = [
    // Fixed Christian Feasts
    {
      id: 1012,
      name: 'حاسبة الأعياد المسيحية الثابتة',
      nameEn: 'Fixed Christian Feasts Calculator',
      slug: 'fixed-christian-feasts-calculator',
      description: 'حساب وعرض تواريخ الأعياد المسيحية الثابتة (مثل عيد الميلاد، البشارة، الغطاس) لسنة معينة.',
      descriptionEn: 'Free Christian feast calculator. Find dates for fixed holidays like Christmas, Epiphany, and Annunciation for any year.',
      category: 'date-time',
      icon: '⛪',
      componentName: 'FixedFeastsCalculator',
      keywords: ['christian', 'feast', 'holiday', 'fixed', 'calendar', 'christmas', 'epiphany', 'annunciation', 'مسيحي', 'عيد', 'ثابت', 'تقويم', 'ميلاد', 'غطاس', 'بشارة'],
      popularity: 50
    },
    // Movable Christian Holy Days
    {
      id: 1013,
      name: 'حاسبة المناسبات المسيحية المتحركة',
      nameEn: 'Movable Christian Holy Days Calculator',
      slug: 'movable-christian-holy-days-calculator',
      description: 'حساب تواريخ المناسبات المسيحية المعتمدة على تاريخ عيد الفصح (مثل أربعاء الرماد، العنصرة) للتقاليد الغربية والشرقية.',
      descriptionEn: 'Free Easter-based holy days calculator. Calculate movable Christian dates like Ash Wednesday, Pentecost, and Ascension.',
      category: 'date-time',
      icon: '🕊️',
      componentName: 'HolyDaysCalculator',
      keywords: ['christian', 'holy day', 'movable', 'easter', 'lent', 'pentecost', 'ascension', 'ash wednesday', 'orthodox', 'western', 'مسيحي', 'مناسبة', 'متحرك', 'فصح', 'صوم كبير', 'عنصرة', 'صعود', 'أربعاء الرماد', 'أرثوذكسي', 'غربي'],
      popularity: 50
    },
    // Coptic Holy Days
    {
      id: 1014,
      name: 'حاسبة الأعياد والمناسبات القبطية',
      nameEn: 'Coptic Holy Days Calculator',
      slug: 'coptic-holy-days-calculator',
      description: 'حساب وعرض تواريخ الأعياد والمناسبات الدينية الثابتة والمتغيرة في التقويم القبطي لسنة قبطية معينة (بالتواريخ الميلادية التقريبية).',
      descriptionEn: 'Free Coptic holy days calculator. Find dates for fixed and movable Coptic Orthodox feasts and religious occasions.',
      category: 'date-time',
      icon: '☦️',
      componentName: 'CopticHolyDays',
      keywords: ['coptic', 'christian', 'holy day', 'feast', 'calendar', 'easter', 'orthodox', 'egypt', 'قبطي', 'مسيحي', 'عيد', 'مناسبة', 'تقويم', 'فصح', 'أرثوذكسي', 'مصر'],
      popularity: 50
    },
    // Gregorian to Coptic Converter
    // Hebrew Holidays
    {
      id: 1017,
      name: 'تقويم الأعياد والمناسبات العبرية',
      nameEn: 'Hebrew Holidays Calendar',
      slug: 'hebrew-holidays-calendar',
      description: 'عرض قائمة الأعياد والمناسبات والصيام في التقويم العبري لسنة عبرية معينة مع وصف موجز وتواريخ تقريبية.',
      descriptionEn: 'Free Jewish holidays calendar. Find dates for Hebrew feasts and fasts including Rosh Hashanah, Yom Kippur, and Passover.',
      category: 'date-time',
      icon: '🕎',
      componentName: 'HebrewHolidays',
      keywords: ['hebrew', 'jewish', 'holiday', 'feast', 'fast', 'calendar', 'rosh hashanah', 'yom kippur', 'passover', 'hanukkah', 'عبري', 'يهودي', 'عيد', 'مناسبة', 'صيام', 'تقويم', 'روش هشناه', 'يوم الغفران', 'بيساح', 'حانوكا'],
      popularity: 50
    },
    // Holy Week Dates
    {
      id: 1018,
      name: 'حاسبة تواريخ الأسبوع المقدس',
      nameEn: 'Holy Week Dates Calculator',
      slug: 'holy-week-dates-calculator',
      description: 'حساب وعرض التواريخ الدقيقة لأيام الأسبوع المقدس (من أحد الشعانين إلى اثنين الفصح) لسنة معينة وللتقاليد الغربية والشرقية.',
      descriptionEn: 'Free Holy Week calculator. Find exact dates for Palm Sunday, Maundy Thursday, Good Friday, and Easter for any year.',
      category: 'date-time',
      icon: '✝️',
      componentName: 'HolyWeekDates',
      keywords: ['holy week', 'easter', 'christian', 'calendar', 'palm sunday', 'good friday', 'maundy thursday', 'orthodox', 'western', 'أسبوع مقدس', 'فصح', 'مسيحي', 'تقويم', 'أحد الشعانين', 'الجمعة العظيمة', 'خميس العهد', 'أرثوذكسي', 'غربي'],
      popularity: 50
    },
    // Samaritan Converter
    {
      id: 1019,
      name: 'محول التقويم السامري',
      nameEn: 'Samaritan Calendar Converter',
      slug: 'samaritan-calendar-converter',
      description: 'تحويل التواريخ بين التقويم الميلادي والتقويم السامري (بشكل تقريبي).',
      descriptionEn: 'Free Samaritan calendar converter. Convert dates between Gregorian and Samaritan calendar systems online easily.',
      category: 'date-time',
      icon: '🔯',
      componentName: 'SamaritanCalendarConverter',
      keywords: ['samaritan', 'gregorian', 'calendar', 'converter', 'date', 'jewish', 'hebrew', 'سامري', 'ميلادي', 'تقويم', 'محول', 'تاريخ', 'يهودي', 'عبري'],
      popularity: 50
    },
    // Samaritan Festivals
    {
      id: 1020,
      name: 'حاسبة الأعياد السامرية',
      nameEn: 'Samaritan Festivals Calculator',
      slug: 'samaritan-festivals-calculator',
      description: 'حساب وعرض التواريخ الميلادية التقريبية للأعياد والمناسبات الدينية في التقويم السامري لسنة سامرية معينة.',
      descriptionEn: 'Free Samaritan festivals calculator. Find dates for religious holidays including Passover, Shavuot, and Sukkot.',
      category: 'date-time',
      icon: '⛰️',
      componentName: 'SamaritanFestivalsCalculator',
      keywords: ['samaritan', 'festival', 'holiday', 'calendar', 'passover', 'shavuot', 'sukkot', 'gerizim', 'سامري', 'عيد', 'مناسبة', 'تقويم', 'فصح', 'حصاد', 'مظال', 'جرزيم'],
      popularity: 50
    },
    // Yazidi New Year
    {
      id: 1021,
      name: 'حاسبة رأس السنة اليزيدية',
      nameEn: 'Yazidi New Year Calculator',
      slug: 'yazidi-new-year-calculator',
      description: 'حساب تاريخ رأس السنة اليزيدية (جارشنبه سور - الأربعاء الأحمر) للسنة الميلادية المحددة وعرض التواريخ القادمة.',
      descriptionEn: 'Free Yazidi New Year calculator. Find the date of Charshema Sor (Red Wednesday) and upcoming celebrations online.',
      category: 'date-time',
      icon: '🦚',
      componentName: 'YazidiNewYearCalculator',
      keywords: ['yazidi', 'ezidi', 'new year', 'calendar', 'charshema sor', 'red wednesday', 'tawûsê melek', 'يزيدي', 'ايزيدي', 'رأس السنة', 'تقويم', 'جارشنبه سور', 'الأربعاء الأحمر', 'طاووس ملك'],
      popularity: 50
    }
];

export default [...subdirectoryCalculators, ...newSubdirectoryCalculators];
