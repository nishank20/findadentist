import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";

interface BookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dentistName: string;
}

const timeSlots = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
];

export function BookingDialog({ open, onOpenChange, dentistName }: BookingDialogProps) {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>();

  const handleBooking = () => {
    if (selectedDate && selectedTime) {
      // Handle booking logic here
      console.log("Booking:", { date: selectedDate, time: selectedTime });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            Choose your appointment time with {dentistName}
          </DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-8 py-6">
          {/* Date Selection */}
          <div>
            <div className="flex items-center gap-2 mb-4 text-lg font-medium">
              <CalendarIcon className="w-5 h-5 text-primary" />
              <span>Select Date</span>
            </div>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-lg border bg-card"
              disabled={(date) => date < new Date()}
            />
          </div>

          {/* Time Selection */}
          <div>
            <div className="flex items-center gap-2 mb-4 text-lg font-medium">
              <Clock className="w-5 h-5 text-primary" />
              <span>Select Time</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {timeSlots.map((time) => (
                <Button
                  key={time}
                  variant={selectedTime === time ? "default" : "outline"}
                  className="h-14 text-base"
                  onClick={() => setSelectedTime(time)}
                >
                  {time}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="px-8"
          >
            Cancel
          </Button>
          <Button
            onClick={handleBooking}
            disabled={!selectedDate || !selectedTime}
            className="px-8"
          >
            Book Appointment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
