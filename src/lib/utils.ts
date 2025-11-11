import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { getISOWeek } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getCurrentISOWeek() {
  return getISOWeek(new Date());
}

export function formatDateTime(timestamp: number | undefined) {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleString('es-ES', { 
        year: 'numeric', month: '2-digit', day: '2-digit', 
        hour: '2-digit', minute: '2-digit' 
    });
}

// Get the current date and time in a format suitable for datetime-local input
export function getCurrentDateTimeLocal() {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
}
