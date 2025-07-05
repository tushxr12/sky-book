using flight_service.Data;
using Microsoft.EntityFrameworkCore;
using flight_service.Models;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Mvc;

var builder = WebApplication.CreateBuilder(args);
var config = builder.Configuration;

// ✅ Read config values
var frontendBaseUrl = config["FrontendBaseUrl"] ?? "http://localhost:3000";
var useInMemoryDb = bool.TryParse(config["UseInMemoryDatabase"], out var inMemoryDbEnabled) && inMemoryDbEnabled;

// ✅ Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(frontendBaseUrl).AllowAnyHeader().AllowAnyMethod();
    });
});

// ✅ Configure DB
if (useInMemoryDb)
{
    builder.Services.AddDbContext<FlightDbContext>(options =>
        options.UseInMemoryDatabase("FlightsDb"));
}
else
{
    builder.Services.AddDbContext<FlightDbContext>(options =>
        options.UseSqlite(config.GetConnectionString("DefaultConnection")));
}

// ✅ Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();
app.UseHttpsRedirection();
app.UseCors("AllowFrontend");

// ✅ Seed Flights (only in-memory mode)
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<FlightDbContext>();

    if (useInMemoryDb)
    {
        db.Flights.AddRange(
            new Flight { Id = 1, Origin = "Delhi", Destination = "Mumbai", DepartureTime = DateTime.UtcNow.AddHours(2), ArrivalTime = DateTime.UtcNow.AddHours(4), TotalSeats = 150, AvailableSeats = 150 },
            new Flight { Id = 2, Origin = "Bangalore", Destination = "Hyderabad", DepartureTime = DateTime.UtcNow.AddHours(1), ArrivalTime = DateTime.UtcNow.AddHours(2.5), TotalSeats = 100, AvailableSeats = 100 },
            new Flight { Id = 3, Origin = "Delhi", Destination = "Dubai", DepartureTime = DateTime.UtcNow.AddHours(3), ArrivalTime = DateTime.UtcNow.AddHours(6), TotalSeats = 180, AvailableSeats = 180 },
            new Flight { Id = 4, Origin = "Mumbai", Destination = "Singapore", DepartureTime = DateTime.UtcNow.AddHours(4), ArrivalTime = DateTime.UtcNow.AddHours(8), TotalSeats = 200, AvailableSeats = 200 },
            new Flight { Id = 5, Origin = "Kolkata", Destination = "Bangkok", DepartureTime = DateTime.UtcNow.AddHours(5), ArrivalTime = DateTime.UtcNow.AddHours(9), TotalSeats = 160, AvailableSeats = 160 },
            new Flight { Id = 6, Origin = "Chennai", Destination = "London", DepartureTime = DateTime.UtcNow.AddHours(6), ArrivalTime = DateTime.UtcNow.AddHours(13), TotalSeats = 220, AvailableSeats = 220 },
            new Flight { Id = 7, Origin = "New York", Destination = "Delhi", DepartureTime = DateTime.UtcNow.AddHours(8), ArrivalTime = DateTime.UtcNow.AddHours(20), TotalSeats = 300, AvailableSeats = 300 },
            new Flight { Id = 8, Origin = "Paris", Destination = "Delhi", DepartureTime = DateTime.UtcNow.AddHours(7), ArrivalTime = DateTime.UtcNow.AddHours(15), TotalSeats = 250, AvailableSeats = 250 },
            new Flight { Id = 9, Origin = "Sydney", Destination = "Mumbai", DepartureTime = DateTime.UtcNow.AddHours(10), ArrivalTime = DateTime.UtcNow.AddHours(20), TotalSeats = 180, AvailableSeats = 180 }
        );
    }

    db.Database.EnsureCreated(); // for SQLite only
    db.SaveChanges();
}

// ✈️ API Endpoints
app.MapGet("/flights", async (FlightDbContext db) =>
    await db.Flights.ToListAsync());

app.MapGet("/flights/{id}", async (int id, FlightDbContext db) =>
{
    var flight = await db.Flights.FindAsync(id);
    return flight == null
        ? Results.NotFound(new { error = "FlightNotFound", message = $"No flight with id {id} exists!" })
        : Results.Ok(flight);
});

app.MapPost("/flights", async (Flight flight, FlightDbContext db) =>
{
    var validationContext = new ValidationContext(flight);
    var validationResults = new List<ValidationResult>();

    if (!Validator.TryValidateObject(flight, validationContext, validationResults, true))
    {
        var errors = validationResults.Select(v => new { field = v.MemberNames.FirstOrDefault(), error = v.ErrorMessage });
        return Results.BadRequest(new { message = "Validation Failed", errors });
    }

    await db.Flights.AddAsync(flight);
    await db.SaveChangesAsync();
    return Results.Created($"/flights/{flight.Id}", flight);
});

app.MapPut("/flights/{id}", async (int id, Flight updatedFlight, FlightDbContext db) =>
{
    var existing = await db.Flights.FindAsync(id);
    if (existing is null) return Results.NotFound(new { message = $"Flight with ID {id} not found." });

    existing.Origin = updatedFlight.Origin;
    existing.Destination = updatedFlight.Destination;
    existing.DepartureTime = updatedFlight.DepartureTime;
    existing.ArrivalTime = updatedFlight.ArrivalTime;
    existing.TotalSeats = updatedFlight.TotalSeats;
    existing.AvailableSeats = updatedFlight.AvailableSeats;

    var validationContext = new ValidationContext(existing);
    var validationResults = new List<ValidationResult>();
    if (!Validator.TryValidateObject(existing, validationContext, validationResults, true))
    {
        var errors = validationResults.Select(v => new { field = v.MemberNames.FirstOrDefault(), error = v.ErrorMessage });
        return Results.BadRequest(new { message = "Validation Failed", errors });
    }

    await db.SaveChangesAsync();
    return Results.Ok(existing);
});

app.MapPut("/flights/{id}/reserve", async (int id, SeatReservationRequest request, FlightDbContext db) =>
{
    if (request.SeatsToReserve <= 0)
        return Results.BadRequest(new { message = "SeatsToReserve must be greater than 0." });

    var flight = await db.Flights.FindAsync(id);
    if (flight == null)
        return Results.NotFound(new { message = $"Flight with id {id} not found." });

    if (flight.AvailableSeats < request.SeatsToReserve)
        return Results.BadRequest(new { message = "Not enough available seats." });

    flight.AvailableSeats -= request.SeatsToReserve;
    await db.SaveChangesAsync();

    return Results.Ok(new { message = $"Reserved {request.SeatsToReserve} seat(s) on flight {id}." });
});

app.MapPut("/flights/{id}/release", async (int id, [FromBody] int seatsToRelease, FlightDbContext db) =>
{
    var flight = await db.Flights.FindAsync(id);
    if (flight == null)
        return Results.NotFound(new { error = $"No flight found with id {id}" });

    flight.AvailableSeats += seatsToRelease;
    if (flight.AvailableSeats > flight.TotalSeats)
        flight.AvailableSeats = flight.TotalSeats;

    await db.SaveChangesAsync();
    return Results.Ok(flight);
});

app.MapDelete("/flights/{id}", async (int id, FlightDbContext db) =>
{
    var flight = await db.Flights.FindAsync(id);
    if (flight == null)
        return Results.NotFound(new { message = $"Flight with ID {id} not found." });

    db.Flights.Remove(flight);
    await db.SaveChangesAsync();
    return Results.Ok(new { message = $"Flight with ID {id} has been deleted." });
});

app.Run();

// ✅ Request DTO
public class SeatReservationRequest
{
    public int SeatsToReserve { get; set; }
}