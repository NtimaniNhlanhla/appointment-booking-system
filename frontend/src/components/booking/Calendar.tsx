import {
  startOfMonth, endOfMonth, eachDayOfInterval,
  startOfWeek, endOfWeek, format, isSameDay,
  isBefore, isAfter, addMonths, subMonths,
} from 'date-fns';
import React from 'react';

interface CalendarProps {
  selectedDate: string;           // YYYY-MM-DD or ''
  onSelect: (date: string) => void;
  minDate?: Date;
  maxDate?: Date;
}

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function Calendar({ selectedDate, onSelect, minDate, maxDate }: CalendarProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const min = minDate ?? today;
  const max = maxDate ?? addMonths(today, 1);

  const [viewDate, setViewDate] = React.useState<Date>(() => {
    if (selectedDate) return new Date(selectedDate);
    return today;
  });

  const monthStart = startOfMonth(viewDate);
  const monthEnd = endOfMonth(viewDate);
  const calStart = startOfWeek(monthStart);
  const calEnd = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: calStart, end: calEnd });

  const prevMonth = () => setViewDate((d) => subMonths(d, 1));
  const nextMonth = () => setViewDate((d) => addMonths(d, 1));

  const canGoPrev = isBefore(min, monthStart);
  const canGoNext = isAfter(max, monthEnd);

  function getDayClasses(day: Date): string {
    const isSelected = selectedDate ? isSameDay(day, new Date(selectedDate)) : false;
    const isToday = isSameDay(day, today);
    const isOtherMonth = day.getMonth() !== viewDate.getMonth();
    const isDisabled = isBefore(day, min) || isAfter(day, max);

    if (isDisabled || isOtherMonth) return 'text-gray-300 cursor-not-allowed';
    if (isSelected) return 'bg-primary text-white rounded-full font-semibold cursor-pointer';
    if (isToday) return 'bg-gray-100 text-gray-900 rounded-full cursor-pointer hover:bg-primary-light';
    return 'text-gray-900 rounded-full cursor-pointer hover:bg-primary-light';
  }

  function handleDayClick(day: Date) {
    const isOtherMonth = day.getMonth() !== viewDate.getMonth();
    const isDisabled = isBefore(day, min) || isAfter(day, max);
    if (isDisabled || isOtherMonth) return;
    onSelect(format(day, 'yyyy-MM-dd'));
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 select-none">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          disabled={!canGoPrev}
          aria-label="Previous month"
          className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          ‹
        </button>
        <span className="text-sm font-semibold text-gray-900">
          {format(viewDate, 'MMMM yyyy')}
        </span>
        <button
          onClick={nextMonth}
          disabled={!canGoNext}
          aria-label="Next month"
          className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          ›
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-2">
        {DAY_LABELS.map((d) => (
          <div key={d} className="text-center text-xs font-medium text-gray-400 py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-y-1">
        {days.map((day) => (
          <div
            key={day.toISOString()}
            onClick={() => handleDayClick(day)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleDayClick(day)}
            aria-label={format(day, 'EEEE, d MMMM yyyy')}
            aria-pressed={selectedDate ? isSameDay(day, new Date(selectedDate)) : false}
            className={`flex items-center justify-center w-8 h-8 mx-auto text-sm transition-colors ${getDayClasses(day)}`}
          >
            {format(day, 'd')}
          </div>
        ))}
      </div>
    </div>
  );
}
