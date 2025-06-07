using Microsoft.EntityFrameworkCore;
using flight_service.Models;

namespace flight_service.Data
{
    public class FlightDbContext : DbContext
    {
        public FlightDbContext(DbContextOptions<FlightDbContext> options) : base(options) { }

        public DbSet<Flight> Flights => Set<Flight>();
    }
}