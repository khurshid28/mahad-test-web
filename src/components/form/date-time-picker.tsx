import { useCallback } from "react";
import DatePicker from "./date-picker";
import Input from "./input/InputField";

type PropsType = {
  dateId: string;
  timeId: string;
  dateLabel?: string;
  timeLabel?: string;
  datePlaceholder?: string;
  timePlaceholder?: string;
  dateValue?: string;
  timeValue?: string;
  onDateChange?: (date: string) => void;
  onTimeChange?: (time: string) => void;
  dateDefaultDate?: Date;
  timePattern?: string;
  timeTitle?: string;
};

export default function DateTimePicker({
  dateId,
  timeId,
  dateLabel = "",
  timeLabel = "",
  datePlaceholder = "Sana tanlang",
  timePlaceholder = "08:00",
  dateValue,
  timeValue,
  onDateChange,
  onTimeChange,
  dateDefaultDate,
  timePattern = "^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$",
  timeTitle = "24-soat formatda vaqt kiriting (HH:MM)",
}: PropsType) {
  const handleDateChange = useCallback((selectedDates: Date[]) => {
    if (selectedDates && selectedDates.length > 0 && onDateChange) {
      onDateChange(selectedDates[0].toISOString().split('T')[0]);
    }
  }, [onDateChange]);

  const handleTimeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (onTimeChange) {
      onTimeChange(e.target.value);
    }
  }, [onTimeChange]);

  return (
    <div>
      {dateLabel && <label className="block text-sm font-medium text-gray-700 mb-1">{dateLabel}</label>}
      <div className="grid grid-cols-2 gap-2">
        <DatePicker
          id={dateId}
          label=""
          placeholder={datePlaceholder}
          defaultDate={dateDefaultDate}
          onChange={handleDateChange}
        />
        <Input
          type="text"
          value={timeValue || ""}
          onChange={handleTimeChange}
          placeholder={timePlaceholder}
          pattern={timePattern}
          title={timeTitle}
        />
      </div>
      {timeLabel && <p className="text-xs text-gray-500 mt-1">{timeLabel}</p>}
    </div>
  );
}