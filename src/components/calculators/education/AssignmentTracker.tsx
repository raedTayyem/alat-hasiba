'use client';

/**
 * Assignment Tracker - Education Category
 * 
 * Features:
 * - Track assignments, deadlines, and completion status
 * - Calculate progress percentage
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Trash2, CheckCircle2, Circle, Calendar, ClipboardList, Info } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================
interface Assignment {
  id: string;
  name: string;
  dueDate: string;
  completed: boolean;
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function AssignmentTracker() {
  // ---------------------------------------------------------------------------
  // HOOKS
  // ---------------------------------------------------------------------------
  const { t } = useTranslation(['calc/education', 'common']);

  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------------------------
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [newName, setNewName] = useState('');
  const [newDate, setNewDate] = useState('');
  const [error, setError] = useState('');

  // ---------------------------------------------------------------------------
  // EFFECTS
  // ---------------------------------------------------------------------------
  useEffect(() => {
    initDateInputRTL();
    // Load from local storage if needed, but for a calculator it's usually transient
  }, []);

  // ---------------------------------------------------------------------------
  // ACTIONS
  // ---------------------------------------------------------------------------
  const addAssignment = () => {
    if (!newName.trim()) {
      setError(t('assignment_tracker.errors.name_required'));
      return;
    }

    const newAssignment: Assignment = {
      id: Math.random().toString(36).substr(2, 9),
      name: newName,
      dueDate: newDate || new Date().toISOString().split('T')[0],
      completed: false
    };

    setAssignments([...assignments, newAssignment]);
    setNewName('');
    setNewDate('');
    setError('');
  };

  const toggleComplete = (id: string) => {
    setAssignments(assignments.map(a => 
      a.id === id ? { ...a, completed: !a.completed } : a
    ));
  };

  const deleteAssignment = (id: string) => {
    setAssignments(assignments.filter(a => a.id !== id));
  };

  const completedCount = assignments.filter(a => a.completed).length;
  const progress = assignments.length > 0 ? (completedCount / assignments.length) * 100 : 0;

  // ---------------------------------------------------------------------------
  // JSX SECTIONS
  // ---------------------------------------------------------------------------
  const inputSection = (
    <div className="space-y-6">
      <div className="bg-muted/30 p-4 rounded-2xl space-y-4">
        <h4 className="font-semibold flex items-center gap-2">
          <Plus className="w-4 h-4" />
          {t('assignment_tracker.add_new')}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label={t('assignment_tracker.course_assignment')}>
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder={t('assignment_tracker.placeholder_name')}
            />
          </FormField>
          <FormField label={t('assignment_tracker.due_date')}>
            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="w-full h-12 px-4 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary outline-none transition-all"
            />
          </FormField>
        </div>
        <button
          onClick={addAssignment}
          className="w-full bg-primary text-primary-foreground h-12 rounded-xl font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-md"
        >
          <Plus className="w-5 h-5" />
          {t('assignment_tracker.add_button')}
        </button>
        <ErrorDisplay error={error} />
      </div>

      <div className="space-y-3">
        <h4 className="font-semibold flex items-center gap-2">
          <ClipboardList className="w-4 h-4" />
          {t('assignment_tracker.list_title')}
        </h4>
        {assignments.length === 0 ? (
          <div className="text-center py-10 border-2 border-dashed border-border rounded-2xl text-muted-foreground italic">
            {t('assignment_tracker.no_assignments')}
          </div>
        ) : (
          <div className="space-y-2">
            {assignments.map((assignment) => (
              <div 
                key={assignment.id}
                className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                  assignment.completed ? 'bg-success/5 border-success/20 opacity-70' : 'bg-card border-border'
                }`}
              >
                <button 
                  onClick={() => toggleComplete(assignment.id)}
                  className={`shrink-0 ${assignment.completed ? 'text-success' : 'text-muted-foreground'}`}
                >
                  {assignment.completed ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                </button>
                <div className="flex-1 min-w-0">
                  <p className={`font-medium truncate ${assignment.completed ? 'line-through' : ''}`}>
                    {assignment.name}
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {assignment.dueDate}
                  </p>
                </div>
                <button 
                  onClick={() => deleteAssignment(assignment.id)}
                  className="p-2 text-muted-foreground hover:text-error transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const resultSection = (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="text-center space-y-4">
        <h3 className="text-xl font-bold text-foreground">{t('assignment_tracker.progress_title')}</h3>
        
        <div className="relative pt-8 pb-4 flex flex-col items-center">
          <div className="relative w-48 h-48 flex items-center justify-center">
            {/* Simple Circular Progress with SVG */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                className="text-muted/30"
              />
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={552.92}
                strokeDashoffset={552.92 * (1 - progress / 100)}
                className="text-primary transition-all duration-1000 ease-out"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black text-primary">{Math.round(progress)}%</span>
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mt-1">
                {t('assignment_tracker.completed_label')}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-muted/50 rounded-xl">
            <div className="text-2xl font-bold text-foreground">{assignments.length}</div>
            <div className="text-xs text-muted-foreground">{t('assignment_tracker.total_count')}</div>
          </div>
          <div className="p-4 bg-muted/50 rounded-xl">
            <div className="text-2xl font-bold text-success">{completedCount}</div>
            <div className="text-xs text-muted-foreground">{t('assignment_tracker.completed_count')}</div>
          </div>
        </div>
      </div>

      <div className="bg-info/5 rounded-2xl p-6 border border-info/10">
        <h4 className="font-semibold mb-3 flex items-center gap-2 text-info">
          <Info className="w-4 h-4" />
          {t('assignment_tracker.tips_title')}
        </h4>
        <ul className="space-y-2 text-xs text-muted-foreground list-disc list-inside">
          <li>{t('assignment_tracker.tip_1')}</li>
          <li>{t('assignment_tracker.tip_2')}</li>
          <li>{t('assignment_tracker.tip_3')}</li>
        </ul>
      </div>
    </div>
  );

  return (
    <CalculatorLayout
      title={t('assignment_tracker.title')}
      description={t('assignment_tracker.description')}
      inputSection={inputSection}
      resultSection={resultSection}
      category="education"
    />
  );
}
