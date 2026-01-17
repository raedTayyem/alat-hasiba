import { Calculator } from './types';

/**
 * Construction & Building Calculators (40 calculators)
 * Comprehensive construction, building, and material calculation tools
 */

const constructionCalculators: Calculator[] = [
  // Concrete & Foundation
  {
    id: 2400,
    nameKey: "calc/construction:concrete-calculator.title", name: 'حاسبة الخرسانة',
    nameEn: 'Concrete Calculator - Cubic Yards & Meters',
    descriptionKey: "calc/construction:concrete-calculator.description", description: 'احسب كمية الخرسانة المطلوبة للصب بالمتر المكعب',
    descriptionEn: 'Calculate concrete volume needed for your project in cubic yards or meters. Our free concrete calculator helps contractors and DIY builders estimate cement, sand, aggregate, and water quantities. Perfect for slabs, footings, and foundations.',
    slug: 'concrete-calculator',
    category: 'construction',
    icon: '🏗️',
    componentName: 'ConcreteCalculator',
    popularity: 90,
    keywords: ['خرسانة', 'صب', 'أساسات', 'بناء', 'متر مكعب']
  },
  {
    id: 2401,
    nameKey: "calc/construction:foundation-calculator.title", name: 'حاسبة الأساسات',
    nameEn: 'Foundation Calculator - Footing Dimensions',
    descriptionKey: "calc/construction:foundation-calculator.description", description: 'احسب أبعاد وكميات مواد الأساسات',
    descriptionEn: 'Calculate foundation dimensions and material quantities for building projects. Our free foundation calculator helps engineers and contractors design proper footings, determine concrete volume, and estimate rebar needs for strong foundations.',
    slug: 'foundation-calculator',
    category: 'construction',
    icon: '🏛️',
    componentName: 'FoundationCalculator',
    popularity: 85,
    keywords: ['أساسات', 'قواعد', 'أعمدة', 'خرسانة مسلحة']
  },
  {
    id: 2402,
      nameKey: "calc/construction:footing-calculator.title", name: 'حاسبة القواعد الخرسانية',
      nameEn: 'Concrete Footing Calculator - Load Bearing',
      descriptionKey: "calc/construction:footing-calculator.description", description: 'احسب حجم القواعد المطلوبة حسب الحمل',
      descriptionEn: 'Calculate footing size required based on structural load. Our free footing calculator helps engineers determine proper footing dimensions for columns and walls. Essential for structural design and load-bearing capacity assessment.',
      slug: 'footing-calculator',
      category: 'construction',
      icon: '⚒️',
      componentName: 'FootingCalculator',
      popularity: 80,
      keywords: ['قواعد', 'حمل', 'تصميم إنشائي']
    },

  // Masonry & Walls
  {
    id: 2403,
    nameKey: "calc/construction:brick-calculator.title", name: 'حاسبة الطوب',
    nameEn: 'Brick Calculator - Wall Material Estimator',
    descriptionKey: "calc/construction:brick-calculator.description", description: 'احسب عدد الطوب المطلوب لبناء الجدران',
    descriptionEn: 'Calculate number of bricks needed for wall construction. Our free brick calculator helps contractors and builders estimate brick quantities, mortar needs, and project costs. Perfect for residential and commercial masonry projects.',
    slug: 'brick-calculator',
    category: 'construction',
    icon: '🧱',
    componentName: 'BrickCalculator',
    popularity: 92,
    keywords: ['طوب', 'بلوك', 'جدران', 'بناء']
  },
    {
      id: 2404,
      nameKey: "calc/construction:block-calculator.title", name: 'حاسبة البلوك',
      nameEn: 'Block Calculator - CMU & Cinder Blocks',
      descriptionKey: "calc/construction:block-calculator.description", description: 'احسب عدد البلوك الإسمنتي المطلوب',
      descriptionEn: 'Calculate concrete blocks (CMU) needed for construction. Our free block calculator helps determine quantity of cinder blocks, concrete blocks, and mortar required. Essential for wall and foundation building projects.',
      slug: 'block-calculator',
      category: 'construction',
      icon: '🟫',
      componentName: 'BlockCalculator',
      popularity: 88,
      keywords: ['بلوك', 'طوب إسمنتي', 'جدار']
    },
    {
      id: 2405,
      nameKey: "calc/construction:mortar-calculator.title", name: 'حاسبة المونة',
      nameEn: 'Mortar Calculator - Cement Mix Estimator',
      descriptionKey: "calc/construction:mortar-calculator.description", description: 'احسب كمية المونة اللازمة للبناء',
      descriptionEn: 'Calculate mortar quantity needed for masonry work. Our free mortar calculator helps estimate cement, sand, and water ratios for bricklaying and blockwork. Get accurate mortar mix proportions for construction projects.',
      slug: 'mortar-calculator',
      category: 'construction',
      icon: '🪣',
      componentName: 'MortarCalculator',
      popularity: 83,
      keywords: ['مونة', 'أسمنت', 'رمل', 'خلطة']
    },
    {
      id: 2406,
      nameKey: "calc/construction:wall-area-calculator.title", name: 'حاسبة مساحة الجدران',
      nameEn: 'Wall Area Calculator - Paint & Coverage',
      descriptionKey: "calc/construction:wall-area-calculator.description", description: 'احسب مساحة الجدران لتقدير الطلاء والدهان',
      descriptionEn: 'Calculate wall area for paint and coating estimates. Our free wall calculator helps homeowners and painters determine square footage, estimate paint gallons, and plan material needs. Accounts for windows and doors.',
      slug: 'wall-area-calculator',
      category: 'construction',
      icon: '📏',
      componentName: 'WallAreaCalculator',
      popularity: 87,
      keywords: ['جدران', 'مساحة', 'طلاء', 'دهان']
    },

  // Roofing
    {
      id: 2407,
      nameKey: "calc/construction:roofing-calculator.title", name: 'حاسبة الأسقف',
      nameEn: 'Roofing Calculator - Shingles & Materials',
      descriptionKey: "calc/construction:roofing-calculator.description", description: 'احسب مواد التسقيف والعزل المطلوبة',
      descriptionEn: 'Calculate roofing materials needed for your project. Our free roofing calculator estimates shingles, underlayment, and insulation quantities. Perfect for contractors and DIYers planning roof installations or replacements.',
      slug: 'roofing-calculator',
      category: 'construction',
      icon: '🏠',
      componentName: 'RoofingCalculator',
      popularity: 85,
      keywords: ['سقف', 'تسقيف', 'عزل', 'قرميد']
    },
    {
      id: 2408,
      nameKey: "calc/construction:roof-pitch-calculator.title", name: 'حاسبة ميل السقف',
      nameEn: 'Roof Pitch Calculator - Slope & Angle',
      descriptionKey: "calc/construction:roof-pitch-calculator.description", description: 'احسب زاوية وميل السقف',
      descriptionEn: 'Calculate roof pitch, slope, and angle for construction projects. Our free roof pitch calculator helps determine proper roof inclination, estimate materials for angled roofs, and ensure proper water drainage.',
      slug: 'roof-pitch-calculator',
      category: 'construction',
      icon: '📐',
      componentName: 'RoofPitchCalculator',
      popularity: 78,
      keywords: ['ميل سقف', 'زاوية', 'انحدار']
    },
    {
      id: 2409,
      nameKey: "calc/construction:shingle-calculator.title", name: 'حاسبة القرميد',
      nameEn: 'Shingle Calculator - Roof Coverage Estimator',
      descriptionKey: "calc/construction:shingle-calculator.description", description: 'احسب كمية القرميد المطلوبة للسقف',
      descriptionEn: 'Calculate roof shingles needed for complete coverage. Our free shingle calculator helps estimate asphalt shingles, tiles, and roofing squares required. Includes waste factor for accurate material ordering.',
      slug: 'shingle-calculator',
      category: 'construction',
      icon: '🔶',
      componentName: 'ShingleCalculator',
      popularity: 82,
      keywords: ['قرميد', 'سقف', 'تغطية']
    },

  // Flooring
    {
      id: 2410,
      nameKey: "calc/construction:flooring-calculator.title", name: 'حاسبة الأرضيات',
      nameEn: 'Flooring Calculator - Tile & Laminate',
      descriptionKey: "calc/construction:flooring-calculator.description", description: 'احسب كمية بلاط الأرضيات المطلوب',
      descriptionEn: 'Calculate flooring materials for your project. Our free flooring calculator estimates tiles, laminate, hardwood, and vinyl quantities. Perfect for homeowners and contractors planning floor installations with waste factor included.',
      slug: 'flooring-calculator',
      category: 'construction',
      icon: '🔲',
      componentName: 'FlooringCalculator',
      popularity: 90,
      keywords: ['أرضيات', 'بلاط', 'سيراميك', 'رخام']
    },
    {
      id: 2411,
      nameKey: "calc/construction:tile-calculator.title", name: 'حاسبة البلاط',
      nameEn: 'Tile Calculator - Ceramic & Porcelain',
      descriptionKey: "calc/construction:tile-calculator.description", description: 'احسب عدد البلاط مع نسبة الهدر',
      descriptionEn: 'Calculate tiles needed for floors and walls with waste allowance. Our free tile calculator helps estimate ceramic, porcelain, and stone tiles required. Accounts for tile size, pattern, and cutting waste for accurate ordering.',
      slug: 'tile-calculator',
      category: 'construction',
      icon: '⬜',
      componentName: 'TileCalculator',
      popularity: 88,
      keywords: ['بلاط', 'سيراميك', 'مربعات']
    },
    {
      id: 2412,
      nameKey: "calc/construction:grout-calculator.title", name: 'حاسبة الجروت',
      nameEn: 'Grout Calculator - Tile Joint Filler',
      descriptionKey: "calc/construction:grout-calculator.description", description: 'احسب كمية الجروت لفواصل البلاط',
      descriptionEn: 'Calculate grout quantity needed for tile joints. Our free grout calculator estimates grout amounts based on tile size, joint width, and installation area. Perfect for ceramic, porcelain, and stone tile projects.',
      slug: 'grout-calculator',
      category: 'construction',
      icon: '🧴',
      componentName: 'GroutCalculator',
      popularity: 75,
      keywords: ['جروت', 'فواصل', 'بلاط']
    },

  // Paint & Finishing
  {
    id: 2413,
    nameKey: "calc/construction:paint-calculator.title", name: 'حاسبة الطلاء',
    nameEn: 'Paint Calculator - Wall Coverage Estimator',
    descriptionKey: "calc/construction:paint-calculator.description", description: 'احسب كمية الطلاء المطلوبة للجدران',
    descriptionEn: 'Calculate paint quantity needed for walls and ceilings. Our free paint calculator estimates gallons or liters required based on room dimensions and paint coverage. Perfect for interior and exterior painting projects.',
    slug: 'paint-calculator',
    category: 'construction',
    icon: '🎨',
    componentName: 'PaintCalculator',
    popularity: 93,
    keywords: ['طلاء', 'دهان', 'جدران', 'لتر']
  },
  {
    id: 2414,
      nameKey: "calc/construction:wallpaper-calculator.title", name: 'حاسبة ورق الجدران',
      nameEn: 'Wallpaper Calculator - Roll Estimator',
      descriptionKey: "calc/construction:wallpaper-calculator.description", description: 'احسب كمية ورق الجدران المطلوب',
      descriptionEn: 'Calculate wallpaper rolls needed for your room. Our free wallpaper calculator estimates quantity based on wall dimensions and pattern repeat. Includes waste allowance for accurate wallpaper ordering and budgeting.',
      slug: 'wallpaper-calculator',
      category: 'construction',
      icon: '📄',
      componentName: 'WallpaperCalculator',
      popularity: 76,
      keywords: ['ورق جدران', 'ديكور', 'تغطية']
    },
    {
      id: 2415,
      nameKey: "calc/construction:ceiling-calculator.title", name: 'حاسبة الأسقف المستعارة',
      nameEn: 'Drop Ceiling Calculator - Suspended Ceiling',
      descriptionKey: "calc/construction:ceiling-calculator.description", description: 'احسب مواد الأسقف المستعارة',
      descriptionEn: 'Calculate suspended ceiling materials needed. Our free drop ceiling calculator estimates ceiling tiles, grid system, and hardware required. Perfect for commercial spaces and basement finishing projects.',
      slug: 'ceiling-calculator',
      category: 'construction',
      icon: '⬜',
      componentName: 'CeilingCalculator',
      popularity: 79,
      keywords: ['سقف مستعار', 'جبس', 'ديكور']
    },

  // Insulation & Waterproofing
    {
      id: 2416,
      nameKey: "calc/construction:insulation-calculator.title", name: 'حاسبة العزل',
      nameEn: 'Insulation Calculator - Thermal & Sound',
      descriptionKey: "calc/construction:insulation-calculator.description", description: 'احسب كمية مواد العزل الحراري والصوتي',
      descriptionEn: 'Calculate insulation materials needed for thermal and sound control. Our free insulation calculator estimates fiberglass, foam, and batts required. Perfect for energy efficiency and noise reduction projects.',
      slug: 'insulation-calculator',
      category: 'construction',
      icon: '🧊',
      componentName: 'InsulationCalculator',
      popularity: 84,
      keywords: ['عزل', 'عزل حراري', 'صوف زجاجي']
    },
    {
      id: 2417,
      nameKey: "calc/construction:waterproofing-calculator.title", name: 'حاسبة العزل المائي',
      nameEn: 'Waterproofing Calculator - Moisture Protection',
      descriptionKey: "calc/construction:waterproofing-calculator.description", description: 'احسب كمية مواد العزل المائي',
      descriptionEn: 'Calculate waterproofing materials needed for moisture protection. Our free waterproofing calculator estimates membrane, coating, and sealant quantities. Essential for basements, foundations, and wet areas.',
      slug: 'waterproofing-calculator',
      category: 'construction',
      icon: '💧',
      componentName: 'WaterproofingCalculator',
      popularity: 81,
      keywords: ['عزل مائي', 'رطوبة', 'حماية']
    },

  // Drywall & Gypsum
    {
      id: 2418,
      nameKey: "calc/construction:drywall-calculator.title", name: 'حاسبة الجبس بورد',
      nameEn: 'Drywall Calculator - Gypsum Board Sheets',
      descriptionKey: "calc/construction:drywall-calculator.description", description: 'احسب عدد ألواح الجبس بورد المطلوبة',
      descriptionEn: 'Calculate drywall sheets needed for walls and ceilings. Our free drywall calculator estimates gypsum boards, screws, and joint compound required. Perfect for new construction and remodeling projects.',
      slug: 'drywall-calculator',
      category: 'construction',
      icon: '📋',
      componentName: 'DrywallCalculator',
      popularity: 86,
      keywords: ['جبس بورد', 'دراي وول', 'ألواح جبس']
    },
    {
      id: 2419,
      nameKey: "calc/construction:joint-compound-calculator.title", name: 'حاسبة معجون الجبس',
      nameEn: 'Joint Compound Calculator - Drywall Mud',
      descriptionKey: "calc/construction:joint-compound-calculator.description", description: 'احسب كمية المعجون لفواصل الجبس',
      descriptionEn: 'Calculate joint compound needed for drywall finishing. Our free mud calculator estimates compound quantity for taping, bedding, and topping coats. Essential for smooth drywall installation and repairs.',
      slug: 'joint-compound-calculator',
      category: 'construction',
      icon: '🪛',
      componentName: 'JointCompoundCalculator',
      popularity: 72,
      keywords: ['معجون', 'جبس', 'فواصل']
    },

  // Wood & Carpentry
    {
      id: 2420,
      nameKey: "calc/construction:lumber-calculator.title", name: 'حاسبة الأخشاب',
      nameEn: 'Lumber Calculator - Wood Board Feet',
      descriptionKey: "calc/construction:lumber-calculator.description", description: 'احسب كمية الأخشاب المطلوبة للبناء',
      descriptionEn: 'Calculate lumber quantities needed for construction projects. Our free lumber calculator estimates board feet, studs, and framing materials required. Perfect for carpentry, framing, and woodworking projects.',
      slug: 'lumber-calculator',
      category: 'construction',
      icon: '🪵',
      componentName: 'LumberCalculator',
      popularity: 83,
      keywords: ['أخشاب', 'خشب', 'نجارة', 'متر مكعب']
    },
    {
      id: 2421,
      nameKey: "calc/construction:deck-calculator.title", name: 'حاسبة الأرضيات الخشبية',
      nameEn: 'Deck Calculator - Wood Decking Materials',
      descriptionKey: "calc/construction:deck-calculator.description", description: 'احسب مواد أرضية الشرفة الخشبية',
      descriptionEn: 'Calculate deck materials needed for outdoor projects. Our free deck calculator estimates decking boards, its, posts, and fasteners required. Perfect for building patios, porches, and outdoor living spaces.',
      slug: 'deck-calculator',
      category: 'construction',
      icon: '🏞️',
      componentName: 'DeckCalculator',
      popularity: 77,
      keywords: ['أرضية خشبية', 'شرفة', 'ديك']
    },
    {
      id: 2422,
      nameKey: "calc/construction:fence-calculator.title", name: 'حاسبة السور',
      nameEn: 'Fence Calculator - Fencing Material Estimator',
      descriptionKey: "calc/construction:fence-calculator.description", description: 'احسب مواد بناء السور أو السياج',
      descriptionEn: 'Calculate fence materials needed for your property. Our free fence calculator estimates posts, panels, rails, and fasteners required. Perfect for wood, vinyl, and chain-link fence installation projects.',
      slug: 'fence-calculator',
      category: 'construction',
      icon: '🚧',
      componentName: 'FenceCalculator',
      popularity: 80,
      keywords: ['سور', 'سياج', 'حماية', 'خشب']
    },

  // Stairs & Steps
    {
      id: 2423,
      nameKey: "calc/construction:stair-calculator.title", name: 'حاسبة الدرج',
      nameEn: 'Stair Calculator - Staircase Dimensions',
      descriptionKey: "calc/construction:stair-calculator.description", description: 'احسب أبعاد ومواد الدرج',
      descriptionEn: 'Calculate staircase dimensions and materials needed. Our free stair calculator determines riser height, tread depth, and total steps. Essential for building code compliance and safe stairway design.',
      slug: 'stair-calculator',
      category: 'construction',
      icon: '🪜',
      componentName: 'StairCalculator',
      popularity: 82,
      keywords: ['درج', 'سلم', 'خطوات', 'ارتفاع']
    },
    {
      id: 2424,
      nameKey: "calc/construction:stringer-calculator.title", name: 'حاسبة جوانب الدرج',
      nameEn: 'Stringer Calculator - Stair Stringer Layout',
      descriptionKey: "calc/construction:stringer-calculator.description", description: 'احسب قطع جوانب الدرج الخشبي',
      descriptionEn: 'Calculate stair stringer cuts and dimensions. Our free stringer calculator helps layout wooden stair stringers with precise riser and tread cuts. Essential for carpenters building custom staircases.',
      slug: 'stringer-calculator',
      category: 'construction',
      icon: '📐',
      componentName: 'StringerCalculator',
      popularity: 70,
      keywords: ['درج خشبي', 'جوانب درج']
    },

  // Excavation & Earthwork
    {
      id: 2425,
      nameKey: "calc/construction:excavation-calculator.title", name: 'حاسبة الحفر',
      nameEn: 'Excavation Calculator - Dirt & Soil Volume',
      descriptionKey: "calc/construction:excavation-calculator.description", description: 'احسب حجم التراب المحفور',
      descriptionEn: 'Calculate excavation volume and dirt removal needed. Our free excavation calculator estimates cubic yards of soil to dig for foundations, pools, and trenches. Essential for site preparation and grading.',
      slug: 'excavation-calculator',
      category: 'construction',
      icon: '🚜',
      componentName: 'ExcavationCalculator',
      popularity: 78,
      keywords: ['حفر', 'تراب', 'حجم', 'متر مكعب']
    },
    {
      id: 2426,
      nameKey: "calc/construction:fill-dirt-calculator.title", name: 'حاسبة التعبئة',
      nameEn: 'Fill Dirt Calculator - Backfill Material',
      descriptionKey: "calc/construction:fill-dirt-calculator.description", description: 'احسب كمية التراب للتعبئة والردم',
      descriptionEn: 'Calculate fill dirt needed for backfilling and grading. Our free fill calculator estimates soil and topsoil quantities for leveling, raising ground, and landscape filling projects. Get accurate cubic yard estimates.',
      slug: 'fill-dirt-calculator',
      category: 'construction',
      icon: '⛏️',
      componentName: 'FillDirtCalculator',
      popularity: 75,
      keywords: ['ردم', 'تعبئة', 'تراب']
    },
    {
      id: 2427,
      nameKey: "calc/construction:gravel-calculator.title", name: 'حاسبة الحصى',
      nameEn: 'Gravel Calculator - Stone & Aggregate',
      descriptionKey: "calc/construction:gravel-calculator.description", description: 'احسب كمية الحصى والزلط المطلوب',
      descriptionEn: 'Calculate gravel and crushed stone needed for driveways and paths. Our free gravel calculator estimates tons or cubic yards of aggregate required. Perfect for landscaping, base layers, and drainage projects.',
      slug: 'gravel-calculator',
      category: 'construction',
      icon: '🪨',
      componentName: 'GravelCalculator',
      popularity: 81,
      keywords: ['حصى', 'زلط', 'رمل', 'طن']
    },
    {
      id: 2428,
      nameKey: "calc/construction:sand-calculator.title", name: 'حاسبة الرمل',
      nameEn: 'Sand Calculator - Construction Sand',
      descriptionKey: "calc/construction:sand-calculator.description", description: 'احسب كمية الرمل المطلوبة',
      descriptionEn: 'Calculate sand quantity needed for construction projects. Our free sand calculator estimates tons or cubic yards of sand required for concrete, mortar, landscaping, and base layers. Accurate material ordering.',
      slug: 'sand-calculator',
      category: 'construction',
      icon: 'Beach',
      componentName: 'SandCalculator',
      popularity: 84,
      keywords: ['رمل', 'بناء', 'طن', 'متر مكعب']
    },

  // Windows & Doors
    {
      id: 2429,
      nameKey: "calc/construction:window-calculator.title", name: 'حاسبة النوافذ',
      nameEn: 'Window Calculator - Glass & Frame Size',
      descriptionKey: "calc/construction:window-calculator.description", description: 'احسب حجم ومواد النوافذ',
      descriptionEn: 'Calculate window dimensions and materials needed. Our free window calculator helps determine glass size, frame measurements, and installation materials. Perfect for window replacement and new construction projects.',
      slug: 'window-calculator',
      category: 'construction',
      icon: '🪟',
      componentName: 'WindowCalculator',
      popularity: 79,
      keywords: ['نوافذ', 'شبابيك', 'زجاج']
    },
    {
      id: 2430,
      nameKey: "calc/construction:door-calculator.title", name: 'حاسبة الأبواب',
      nameEn: 'Door Calculator - Door Size & Materials',
      descriptionKey: "calc/construction:door-calculator.description", description: 'احسب مقاسات وتكلفة الأبواب',
      descriptionEn: 'Calculate door dimensions and installation costs. Our free door calculator helps determine proper door size, frame measurements, and material quantities. Essential for residential and commercial door projects.',
      slug: 'door-calculator',
      category: 'construction',
      icon: '🚪',
      componentName: 'DoorCalculator',
      popularity: 76,
      keywords: ['أبواب', 'باب', 'مقاسات']
    },

  // Plumbing & Electrical (Construction Related)
    {
      id: 2431,
      nameKey: "calc/construction:pipe-calculator.title", name: 'حاسبة الأنابيب',
      nameEn: 'Pipe Calculator - Plumbing Pipe Length',
      descriptionKey: "calc/construction:pipe-calculator.description", description: 'احسب أطوال وأقطار الأنابيب المطلوبة',
      descriptionEn: 'Calculate pipe lengths and diameters for plumbing projects. Our free pipe calculator estimates PVC, copper, and steel pipe quantities. Perfect for water supply, drainage, and irrigation system installations.',
      slug: 'pipe-calculator',
      category: 'construction',
      icon: '🔧',
      componentName: 'PipeCalculator',
      popularity: 77,
      keywords: ['أنابيب', 'مواسير', 'سباكة']
    },
    {
      id: 2432,
      nameKey: "calc/construction:conduit-calculator.title", name: 'حاسبة مواسير الكهرباء',
      nameEn: 'Conduit Calculator - Electrical Conduit',
      descriptionKey: "calc/construction:conduit-calculator.description", description: 'احسب مواسير الكهرباء المطلوبة',
      descriptionEn: 'Calculate electrical conduit needed for wiring projects. Our free conduit calculator estimates EMT, PVC, and metal conduit quantities for electrical installations. Essential for safe wire routing and protection.',
      slug: 'conduit-calculator',
      category: 'construction',
      icon: '⚡',
      componentName: 'ConduitCalculator',
      popularity: 73,
      keywords: ['كهرباء', 'مواسير', 'تمديدات']
    },

  // Cost Estimation
    {
      id: 2433,
      nameKey: "calc/construction:construction-cost-calculator.title", name: 'حاسبة تكلفة البناء',
      nameEn: 'Construction Cost Calculator - Building Budget',
      descriptionKey: "calc/construction:construction-cost-calculator.description", description: 'احسب التكلفة الإجمالية لمشروع البناء',
      descriptionEn: 'Calculate total construction costs for building projects. Our free construction cost calculator estimates materials, labor, and overhead expenses. Perfect for budgeting home builds, renovations, and commercial projects.',
      slug: 'construction-cost-calculator',
      category: 'construction',
      icon: '💰',
      componentName: 'ConstructionCostCalculator',
      popularity: 95,
      keywords: ['تكلفة', 'بناء', 'ميزانية', 'تقدير']
    },
    {
      id: 2434,
      nameKey: "calc/construction:labor-cost-construction-calculator.title", name: 'حاسبة تكلفة العمالة',
      nameEn: 'Labor Cost Calculator - Construction Wages',
      descriptionKey: "calc/construction:labor-cost-construction-calculator.description", description: 'احسب تكلفة العمالة في البناء',
      descriptionEn: 'Calculate labor costs for construction projects. Our free labor cost calculator estimates worker wages, hours, and total workforce expenses. Essential for accurate project bidding and budget planning.',
      slug: 'labor-cost-construction-calculator',
      category: 'construction',
      icon: '👷',
      componentName: 'LaborCostConstructionCalculator',
      popularity: 85,
      keywords: ['عمالة', 'أجور', 'عمال']
    },
    {
      id: 2435,
      nameKey: "calc/construction:material-cost-calculator.title", name: 'حاسبة تكلفة المواد',
      nameEn: 'Material Cost Calculator - Building Materials',
      descriptionKey: "calc/construction:material-cost-calculator.description", description: 'احسب تكلفة مواد البناء',
      descriptionEn: 'Calculate building material costs for construction projects. Our free material cost calculator estimates expenses for lumber, concrete, steel, and supplies. Perfect for accurate project budgeting and cost control.',
      slug: 'material-cost-calculator',
      category: 'construction',
      icon: '📦',
      componentName: 'MaterialCostCalculator',
      popularity: 88,
      keywords: ['مواد', 'تكلفة', 'سعر']
    },

  // Specialized
    {
      id: 2436,
      nameKey: "calc/construction:rebar-calculator.title", name: 'حاسبة حديد التسليح',
      nameEn: 'Rebar Calculator - Reinforcement Steel',
      descriptionKey: "calc/construction:rebar-calculator.description", description: 'احسب كمية حديد التسليح المطلوب',
      descriptionEn: 'Calculate rebar quantities for reinforced concrete. Our free rebar calculator estimates steel reinforcement needed for slabs, foundations, and columns. Get accurate weight and length for structural projects.',
      slug: 'rebar-calculator',
      category: 'construction',
      icon: '🔩',
      componentName: 'RebarCalculator',
      popularity: 87,
      keywords: ['حديد تسليح', 'خرسانة مسلحة', 'طن']
    },
    {
      id: 2437,
      nameKey: "calc/construction:asphalt-calculator.title", name: 'حاسبة الأسفلت',
      nameEn: 'Asphalt Calculator - Paving Material',
      descriptionKey: "calc/construction:asphalt-calculator.description", description: 'احسب كمية الأسفلت للطرق والممرات',
      descriptionEn: 'Calculate asphalt quantity for driveways and roads. Our free asphalt calculator estimates tons of hot mix asphalt needed for paving projects. Perfect for parking lots, driveways, and road construction.',
      slug: 'asphalt-calculator',
      category: 'construction',
      icon: '🛣️',
      componentName: 'AsphaltCalculator',
      popularity: 79,
      keywords: ['أسفلت', 'طرق', 'رصف', 'طن']
    },
    {
      id: 2438,
      nameKey: "calc/construction:landscaping-calculator.title", name: 'حاسبة تنسيق الحدائق',
      nameEn: 'Landscaping Calculator - Garden Materials',
      descriptionKey: "calc/construction:landscaping-calculator.description", description: 'احسب مواد تنسيق الحدائق',
      descriptionEn: 'Calculate landscaping materials for outdoor projects. Our free landscaping calculator estimates mulch, soil, sod, and plants needed. Perfect for garden design, yard renovation, and outdoor beautification.',
      slug: 'landscaping-calculator',
      category: 'construction',
      icon: '🌳',
      componentName: 'LandscapingCalculator',
      popularity: 74,
      keywords: ['حدائق', 'تنسيق', 'عشب', 'نباتات']
    },
    {
      id: 2439,
      nameKey: "calc/construction:siding-calculator.title", name: 'حاسبة كسوة الجدران',
      nameEn: 'Siding Calculator - Exterior Wall Cladding',
      descriptionKey: "calc/construction:siding-calculator.description", description: 'احسب مواد كسوة الجدران الخارجية',
      descriptionEn: 'Calculate siding materials for exterior walls. Our free siding calculator estimates vinyl, fiber cement, and wood siding needed. Perfect for home exterior renovation and new construction facade projects.',
      slug: 'siding-calculator',
      category: 'construction',
      icon: '🏘️',
      componentName: 'SidingCalculator',
      popularity: 71,
      keywords: ['كسوة', 'واجهات', 'جدران خارجية']
    }
];

export default constructionCalculators;
