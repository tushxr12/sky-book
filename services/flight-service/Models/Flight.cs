using System;
using System.ComponentModel.DataAnnotations;

namespace flight_service.Models
{
    public class Flight
    {
        public int Id { get; set; }

        [Required]
        public string Origin { get; set; } = string.Empty;

        [Required]
        public string Destination { get; set; } = string.Empty;

        [Required]
        public DateTime DepartureTime { get; set; }

        [Required]
        public DateTime ArrivalTime { get; set; }

        [Range(1, int.MaxValue, ErrorMessage = "TotalSeats must be at least 1")]
        public int TotalSeats { get; set; }

        [Range(0, int.MaxValue, ErrorMessage = "AvailableSeats cannot be negative")]
        public int AvailableSeats { get; set; }
    }
}