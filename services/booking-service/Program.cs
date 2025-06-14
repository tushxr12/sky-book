using booking_service.Models;
using System.Net.Http.Json;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

// In-memory list to store bookings
var bookings = new List<Booking>();
int nextId = 1;

string flightServiceBaseUrl = "http://localhost:5290";

app.MapPost("/bookings", async(Booking booking) =>
{
    var httpClient = new HttpClient();
    var reserveUrl = $"{flightServiceBaseUrl}/flights/{booking.FlightId}/reserve";
    var response = await httpClient.PutAsJsonAsync(reserveUrl , new {seatsToReserve = booking.SeatsReserved});

    if(!response.IsSuccessStatusCode)
    {
        return Results.BadRequest($"Failed to reserve seats for flight {booking.FlightId}. Reason: {await response.Content.ReadAsStringAsync()}");
    }

    booking.Id = nextId++;
    booking.BookingTime = DateTime.UtcNow;

    bookings.Add(booking);
    return Results.Created($"/bookings/{booking.Id}", booking);
});

app.MapGet("/bookings" , ()=>
{
    return Results.Ok(bookings);
});

app.Run();
