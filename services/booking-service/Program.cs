using booking_service.Models;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Load config values from environment
var flightServiceBaseUrl = builder.Configuration["FlightServiceBaseUrl"];
var frontendBaseUrl = builder.Configuration["FrontendBaseUrl"];
var dbConnectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// Fallbacks (optional)
flightServiceBaseUrl ??= "http://localhost:5290";
frontendBaseUrl ??= "http://localhost:3000";
dbConnectionString ??= "Data Source=bookings.db";

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(frontendBaseUrl)
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// EF Core
builder.Services.AddDbContext<BookingDbContext>(options =>
    options.UseSqlite(dbConnectionString));

var app = builder.Build();

app.UseCors("AllowFrontend");

// DB Init
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<BookingDbContext>();
    db.Database.EnsureCreated();
}

// POST /bookings
app.MapPost("/bookings", async (Booking booking, BookingDbContext db) =>
{
    var validationContext = new ValidationContext(booking);
    var validationResults = new List<ValidationResult>();
    if (!Validator.TryValidateObject(booking, validationContext, validationResults, true))
    {
        return Results.BadRequest(validationResults);
    }

    var httpClient = new HttpClient();
    var reserveUrl = $"{flightServiceBaseUrl}/flights/{booking.FlightId}/reserve";

    var response = await httpClient.PutAsJsonAsync(reserveUrl, new { seatsToReserve = booking.SeatsReserved });

    if (!response.IsSuccessStatusCode)
    {
        return Results.BadRequest($"Failed to reserve seats for flight {booking.FlightId}. Reason: {await response.Content.ReadAsStringAsync()}");
    }

    booking.BookingTime = DateTime.UtcNow;
    db.Bookings.Add(booking);
    await db.SaveChangesAsync();

    return Results.Created($"/bookings/{booking.Id}", booking);
});

// GET /bookings
app.MapGet("/bookings", async (BookingDbContext db) =>
    await db.Bookings.ToListAsync());

// GET /bookings/{id}
app.MapGet("/bookings/{id}", async (int id, BookingDbContext db) =>
{
    var booking = await db.Bookings.FindAsync(id);
    return booking is not null
        ? Results.Ok(booking)
        : Results.NotFound(new { message = $"No booking found with ID {id}" });
});

// DELETE /bookings/{id}
app.MapDelete("/bookings/{id}", async (int id, BookingDbContext db) =>
{
    var booking = await db.Bookings.FindAsync(id);
    if (booking == null)
    {
        return Results.NotFound(new { errorMessage = $"No booking with id {id} exists." });
    }

    var httpClient = new HttpClient();
    var releaseUrl = $"{flightServiceBaseUrl}/flights/{booking.FlightId}/release";
    var payload = new StringContent(booking.SeatsReserved.ToString(), Encoding.UTF8, "application/json");

    var response = await httpClient.PutAsync(releaseUrl, payload);
    var content = await response.Content.ReadAsStringAsync();

    if (!response.IsSuccessStatusCode)
    {
        return Results.BadRequest($"Failed to release seats. Reason: {content}");
    }

    db.Bookings.Remove(booking);
    await db.SaveChangesAsync();

    return Results.Ok(new { message = $"Booking {id} cancelled successfully." });
});

app.Run();
