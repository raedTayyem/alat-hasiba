import { Calculator } from './types';

// Education Calculators
const educationCalculators: Calculator[] = [
  {
    id: 905,
    name: 'حاسبة التقييم الدراسي',
    nameEn: 'Grade Calculator - Calculate School Grades and Scores',
    slug: 'grade-calculator',
    description: 'حساب الدرجات والتقديرات الدراسية',
    descriptionEn: 'Calculate school grades, test scores, and academic performance online. Free grade calculator for students and teachers. Determine your final grade and GPA easily.',
    category: 'education',
    icon: '📝',
    popularity: 7,
    componentName: 'GradeCalculator'
  },
  {
    id: 906,
    name: 'حاسبة المعدل التراكمي (GPA)',
    nameEn: 'GPA Calculator - Calculate Semester and Cumulative GPA',
    slug: 'gpa-calculator',
    description: 'حساب المعدل التراكمي والفصلي بسهولة',
    descriptionEn: 'Calculate your semester and cumulative GPA (Grade Point Average) using our free online tool. Supports 4.0 and 5.0 scales with weighted credits.',
    category: 'education',
    icon: '🎓',
    popularity: 9,
    componentName: 'GPACalculator'
  },
  {
    id: 907,
    name: 'حاسبة الدرجة النهائية المطلوبة',
    nameEn: 'Final Grade Calculator - What Score Do You Need?',
    slug: 'final-grade-calculator',
    description: 'حساب الدرجة المطلوبة في الاختبار النهائي للوصول لهدفك',
    descriptionEn: 'Calculate the score you need on your final exam to achieve your desired overall grade in a course.',
    category: 'education',
    icon: '🎯',
    popularity: 8,
    componentName: 'FinalGradeCalculator'
  },
  {
    id: 908,
    name: 'حاسبة الغياب والحضور',
    nameEn: 'Attendance Calculator - Track Your Attendance',
    slug: 'attendance-calculator',
    description: 'حساب نسبة الحضور والغياب وعدد المحاضرات المتبقية',
    descriptionEn: 'Calculate your attendance percentage and find out how many more classes you can miss or need to attend to reach your target.',
    category: 'education',
    icon: '📅',
    popularity: 6,
    componentName: 'AttendanceCalculator'
  },
  {
    id: 909,
    name: 'حاسبة معدل الفصل الدراسي',
    nameEn: 'Semester Grade Calculator',
    slug: 'semester-grade-calculator',
    description: 'حساب المعدل الموزون لجميع مواد الفصل الدراسي',
    descriptionEn: 'Calculate your overall weighted average for multiple courses in a single semester or term.',
    category: 'education',
    icon: '📚',
    popularity: 7,
    componentName: 'SemesterGradeCalculator'
  },
  {
    id: 910,
    name: 'حاسبة درجات الاختبار',
    nameEn: 'Test Score Calculator - Easy Grading',
    slug: 'test-score-calculator',
    description: 'حساب النسبة المئوية والتقدير لدرجات الاختبار',
    descriptionEn: 'Quickly calculate test scores, percentages, and letter grades based on the number of questions and wrong answers.',
    category: 'education',
    icon: '📋',
    popularity: 5,
    componentName: 'TestScoreCalculator'
  },
  {
    id: 911,
    name: 'متتبع المهام والواجبات',
    nameEn: 'Assignment Tracker - Organize Your Studies',
    slug: 'assignment-tracker',
    description: 'تنظيم المهام والواجبات الدراسية وتتبع تقدمك',
    descriptionEn: 'Keep track of your school assignments, projects, and deadlines. Organize your studies and visualize your completion progress.',
    category: 'education',
    icon: '📑',
    popularity: 4,
    componentName: 'AssignmentTracker'
  },
  {
    id: 912,
    name: 'حاسبة وقت الدراسة',
    nameEn: 'Study Time Calculator - Plan Your Learning',
    slug: 'study-time-calculator',
    description: 'حساب الوقت الموصى به للدراسة بناءً على الساعات المعتمدة',
    descriptionEn: 'Determine how many hours you should spend studying based on your course load, difficulty, and available days.',
    category: 'education',
    icon: '⏰',
    popularity: 3,
    componentName: 'StudyTimeCalculator'
  },
  {
    id: 913,
    name: 'حاسبة سرعة القراءة',
    nameEn: 'Reading Speed Calculator - Words Per Minute',
    slug: 'reading-speed-calculator',
    description: 'قياس سرعة القراءة بالكلمات في الدقيقة وتقدير وقت القراءة',
    descriptionEn: 'Measure your reading speed in words per minute (WPM) and estimate how long it will take to read books or articles.',
    category: 'education',
    icon: '📖',
    popularity: 4,
    componentName: 'ReadingSpeedCalculator'
  },
];

export default educationCalculators;
