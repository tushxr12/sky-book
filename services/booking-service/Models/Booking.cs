using System;

namespace booking_service.Models
{
    public class Booking
    {
        public int Id { get; set; }
        public int FlightId { get; set; }
        public string PassengerName { get; set; } = string.Empty;
        public int SeatsReserved { get; set; }
        public DateTime BookingTime { get; set; } = DateTime.UtcNow;
    }
}