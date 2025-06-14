using System;
using System.ComponentModel.DataAnnotations;

namespace booking_service.Models
{
    public class Booking
    {
        public int Id { get; set; }

        [Required]
        public int FlightId { get; set; }

        [Required]
        [MinLength(2)]
        public string PassengerName { get; set; } = string.Empty;

        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "At least 1 seat must be reserved")]
        public int SeatsReserved { get; set; }
        
        public DateTime BookingTime { get; set; } = DateTime.UtcNow;
    }
}