using flight_service.Data;
using Microsoft.EntityFrameworkCore;
using flight_service.Models;
var builder = WebApplication.CreateBuilder(args);

// Use in-memory DB for now
builder.Services.AddDbContext<FlightDbContext>(options =>
    options.UseInMemoryDatabase("FlightsDb"));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();
app.UseHttpsRedirection();

// Seed data
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<FlightDbContext>();
    db.Flights.AddRange(
        new flight_service.Models.Flight
        {
            Id = 1,
            Origin = "New York",
            Destination = "London",
            DepartureTime = DateTime.UtcNow.AddHours(5),
            ArrivalTime = DateTime.UtcNow.AddHours(10),
            TotalSeats = 100,
            AvailableSeats = 100
        },
        new flight_service.Models.Flight
        {
            Id = 2,
            Origin = "Delhi",
            Destination = "Dubai",
            DepartureTime = DateTime.UtcNow.AddHours(3),
            ArrivalTime = DateTime.UtcNow.AddHours(7),
            TotalSeats = 80,
            AvailableSeats = 60
        }
    );
    db.SaveChanges();
}

app.MapGet("/flights", async (FlightDbContext db) =>
    await db.Flights.ToListAsync());

app.MapGet("/flights/{id}", async (int id, FlightDbContext db) =>
{
    var flight = await db.Flights.FindAsync(id);
    if (flight == null)
    {
        return Results.NotFound(new
        {
            error = "FlightNotFound",
            message = $"No flight with id {id} exists!"
        });
    }

    return Results.Ok(flight);
});



app.MapPut("/flights/{id}/reserve", async (int id, SeatReservationRequest request, FlightDbContext db) =>
{
    var flight = await db.Flights.FindAsync(id);
    if (flight == null) 
        return Results.NotFound($"Flight with id {id} not found.");

    if (flight.AvailableSeats < request.SeatsToReserve)
        return Results.BadRequest("Not enough available seats.");

    flight.AvailableSeats -= request.SeatsToReserve;
    await db.SaveChangesAsync();

    return Results.Ok($"Reserved {request.SeatsToReserve} seat(s) on flight {id}.");
});

app.Run();

public class SeatReservationRequest
{
    public int SeatsToReserve { get; set; }
}