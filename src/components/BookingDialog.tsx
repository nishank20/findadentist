import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Clock, Shield } from "lucide-react";
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

const insuranceOptions = [
  "- no insurance -",
  "Delta Dental",
  "Aetna",
  "Cigna",
  "UnitedHealthcare",
  "MetLife",
  "Humana",
];

export function BookingDialog({ open, onOpenChange, dentistName }: BookingDialogProps) {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>();
  const [selectedInsurance, setSelectedInsurance] = useState<string>("- no insurance -");

  const handleBooking = () => {
    if (selectedDate && selectedTime) {
      // Handle booking logic here
      console.log("Booking:", { date: selectedDate, time: selectedTime, insurance: selectedInsurance });
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

        <div className="space-y-6 py-6">
          {/* Insurance Selection */}
          <div>
            <div className="flex items-center gap-2 mb-4 text-lg font-medium">
              <Shield className="w-5 h-5 text-primary" />
              <span>Insurance</span>
            </div>
            <Select value={selectedInsurance} onValueChange={setSelectedInsurance}>
              <SelectTrigger className="h-12 text-base">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card">
                {insuranceOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
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
                className="rounded-lg border bg-card pointer-events-auto"
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
