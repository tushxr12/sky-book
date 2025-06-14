using Microsoft.EntityFrameworkCore;

namespace booking_service.Models
{
    public class BookingDbContext : DbContext
    {
        public BookingDbContext(DbContextOptions<BookingDbContext> options) : base(options)
        {
        }

        public DbSet<Booking> Bookings {get; set;}
    }
}