using flight_service.Data;
using Microsoft.EntityFrameworkCore;
using flight_service.Models;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Mvc;



var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options => 
{
    options.AddPolicy("AllowFrontend",
    policy => 
    {
        policy.WithOrigins("http://localhost:3000").AllowAnyHeader().AllowAnyMethod();
    });
});

// Use in-memory DB for now
builder.Services.AddDbContext<FlightDbContext>(options =>
    options.UseInMemoryDatabase("FlightsDb"));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();
app.UseHttpsRedirection();
app.UseCors("AllowFrontend");


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
    var existingFlight = await db.Flights.FindAsync(id);
    if (existingFlight is null)
    {
        return Results.NotFound(new { message = $"Flight with ID {id} not found." });
    }

    // Apply updates
    existingFlight.Origin = updatedFlight.Origin;
    existingFlight.Destination = updatedFlight.Destination;
    existingFlight.DepartureTime = updatedFlight.DepartureTime;
    existingFlight.ArrivalTime = updatedFlight.ArrivalTime;
    existingFlight.TotalSeats = updatedFlight.TotalSeats;
    existingFlight.AvailableSeats = updatedFlight.AvailableSeats;

    // Validate
    var validationContext = new ValidationContext(existingFlight);
    var validationResults = new List<ValidationResult>();
    if (!Validator.TryValidateObject(existingFlight, validationContext, validationResults, true))
    {
        var errors = validationResults.Select(v => new { field = v.MemberNames.FirstOrDefault(), error = v.ErrorMessage });
        return Results.BadRequest(new { message = "Validation Failed", errors });
    }

    await db.SaveChangesAsync();
    return Results.Ok(existingFlight);
});


app.MapPut("/flights/{id}/reserve", async (int id, SeatReservationRequest request, FlightDbContext db) =>
{
    if (request.SeatsToReserve <= 0)
    {
        return Results.BadRequest(new {message = "SeatsToReserve must be greater than 0."});
    }

    var flight = await db.Flights.FindAsync(id);
    if (flight == null) 
        return Results.NotFound($"Flight with id {id} not found.");

    if (flight.AvailableSeats < request.SeatsToReserve)
        return Results.BadRequest("Not enough available seats.");

    flight.AvailableSeats -= request.SeatsToReserve;
    await db.SaveChangesAsync();

    return Results.Ok($"Reserved {request.SeatsToReserve} seat(s) on flight {id}.");
});

app.MapDelete("/flights/{id}", async (int id, FlightDbContext db) =>
{
    var flight = await db.Flights.FindAsync(id);
    if (flight is null)
        return Results.NotFound(new { message = $"Flight with ID {id} not found." });

    db.Flights.Remove(flight);
    await db.SaveChangesAsync();

    return Results.Ok(new { message = $"Flight with ID {id} has been deleted." });
});

app.MapPut("/flights/{id}/release", async (int id, [FromBody] int seatsToRelease, FlightDbContext db) =>
{
    var flight = await db.Flights.FindAsync(id);
    if (flight == null)
        return Results.NotFound(new { error = $"No flight found with id {id}" });

    flight.AvailableSeats += seatsToRelease;

    // Prevent exceeding total seats
    if (flight.AvailableSeats > flight.TotalSeats)
        flight.AvailableSeats = flight.TotalSeats;

    await db.SaveChangesAsync();
    return Results.Ok(flight);
});

app.Run();

public class SeatReservationRequest
{
    public int SeatsToReserve { get; set; }
}