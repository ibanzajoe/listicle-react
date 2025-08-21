// src/components/common/ErrorMessage.tsx
import React from 'react';
import clsx from 'clsx';
// Optional: Import an icon library if you want error icons
// import { ExclamationTriangleIcon } from '@heroicons/react/24/solid'; // Example using Heroicons (npm install @heroicons/react)

interface ErrorMessageProps {
    /** The error message text to display */
    message?: string;
    /** Detailed error information (optional, could be Error object, string, etc.) */
    error?: unknown; // Accept various error types
    /** Visual style of the error message */
    variant?: 'inline' | 'alert';
    /** Additional CSS classes */
    className?: string;
    /** Title for alert variant */
    title?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
    message = 'An unexpected error occurred.', // Default message
    error,
    variant = 'inline',
    className,
    title = 'Error',
}) => {
    // Attempt to extract a more specific message from the error object
    let detailedErrorMessage = '';
    if (error) {
        if (error instanceof Error) {
            detailedErrorMessage = error.message;
        } else if (typeof error === 'string') {
            detailedErrorMessage = error;
        }
        // You could add more checks here for specific API error structures
        // else if (typeof error === 'object' && error !== null && 'data' in error) {
        //    detailedErrorMessage = (error as any).data?.message || JSON.stringify(error);
        // }
    }

    const displayMessage = detailedErrorMessage || message; // Use detailed if available, else default/prop

    // --- Styling based on variant ---

    const baseClasses = 'text-sm';

    const inlineClasses = clsx(
        baseClasses,
        'text-red-600 dark:text-red-400', // Adjust dark mode color if needed
        className
    );

    const alertClasses = clsx(
        baseClasses,
        'border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20 p-4 rounded-md shadow-sm',
        className
    );

    const alertTitleClasses = 'font-semibold text-red-800 dark:text-red-200 mb-1';
    const alertMessageClasses = 'text-red-700 dark:text-red-300';

    // --- Render Logic ---

    if (!displayMessage) return null; // Don't render if there's no message

    if (variant === 'alert') {
        return (
            <div role="alert" className={alertClasses}>
                 <div className="flex items-start">
                     {/* Optional Icon */}
                     {/* <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mr-3 flex-shrink-0" aria-hidden="true" /> */}
                     <div className="flex-1">
                         <h3 className={alertTitleClasses}>{title}</h3>
                         <p className={alertMessageClasses}>
                             {displayMessage}
                         </p>
                     </div>
                 </div>
            </div>
        );
    }

    // Default to 'inline' variant
    return (
        <p role="alert" className={inlineClasses}>
             {/* Optional Icon (smaller for inline) */}
             {/* <ExclamationTriangleIcon className="h-4 w-4 inline-block mr-1 align-text-bottom text-red-500" aria-hidden="true" /> */}
            {displayMessage}
        </p>
    );
};

export default ErrorMessage;