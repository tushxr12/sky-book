using booking_service.Models;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

// In-memory list to store bookings
var bookings = new List<Booking>();

int nextId = 1;

app.MapPost("/bookings", (Booking booking) =>
{
    booking.Id = nextId++;
    booking.BookingTime = DateTime.UtcNow;

    bookings.Add(booking);
    return Results.Created($"/bookings/{booking.Id}", booking);
});

app.Run();
