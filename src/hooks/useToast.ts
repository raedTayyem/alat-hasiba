/**
 * Toast Hook
 * Re-exports the useToast hook from the Toast component for convenience.
 *
 * Usage:
 * ```tsx
 * import { useToast } from '@/hooks/useToast';
 *
 * function MyComponent() {
 *   const toast = useToast();
 *
 *   const handleSuccess = () => {
 *     toast.success('Operation completed successfully!');
 *   };
 *
 *   const handleError = () => {
 *     toast.error('Something went wrong!');
 *   };
 *
 *   const handleInfo = () => {
 *     toast.info('Here is some information.');
 *   };
 *
 *   const handleWarning = () => {
 *     toast.warning('Please be careful!');
 *   };
 *
 *   // With custom duration (in milliseconds)
 *   const handleCustomDuration = () => {
 *     toast.success('This will disappear in 10 seconds', 10000);
 *   };
 *
 *   return (
 *     <button onClick={handleSuccess}>Show Toast</button>
 *   );
 * }
 * ```
 */

export { useToast } from '@/components/ui/Toast';
export type { ToastContextType, ToastVariant, Toast } from '@/components/ui/Toast';
