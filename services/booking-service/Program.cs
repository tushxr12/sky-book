using booking_service.Models;
using System.Net.Http.Json;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

var builder = WebApplication.CreateBuilder(args);

// Add EF Core with SQLite
builder.Services.AddDbContext<BookingDbContext>(options =>
    options.UseSqlite("Data Source=bookings.db"));

var app = builder.Build();

// Run EF migrations (create DB file if it doesn't exist)
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<BookingDbContext>();
    db.Database.EnsureCreated();
}

// In-memory list to store bookings
// var bookings = new List<Booking>();


// int nextId = 1;

string flightServiceBaseUrl = "http://localhost:5290";

app.MapPost("/bookings", async(Booking booking, BookingDbContext db) =>
{
    //Validating manually
    var validationContext = new ValidationContext(booking);
    var validationResults = new List<ValidationResult>();

    if(!Validator.TryValidateObject(booking, validationContext, validationResults, true))
    {
        return Results.BadRequest(validationResults);
    }

    //Calling flight service below to reserve seats
    var httpClient = new HttpClient();
    var reserveUrl = $"{flightServiceBaseUrl}/flights/{booking.FlightId}/reserve";
    var response = await httpClient.PutAsJsonAsync(reserveUrl , new {seatsToReserve = booking.SeatsReserved});

    if(!response.IsSuccessStatusCode)
    {
        return Results.BadRequest($"Failed to reserve seats for flight {booking.FlightId}. Reason: {await response.Content.ReadAsStringAsync()}");
    }

    // booking.Id = nextId++; We donot this with EF as it'll be taken care

    booking.BookingTime = DateTime.UtcNow;
    db.Bookings.Add(booking);
    
    await db.SaveChangesAsync();

    // bookings.Add(booking);
    return Results.Created($"/bookings/{booking.Id}", booking);
});

app.MapGet("/bookings" , async(BookingDbContext db)=>
    await db.Bookings.ToListAsync());

app.MapGet("/bookings/{id}", async(int id, BookingDbContext db)=>
{
    var booking = await db.Bookings.FindAsync(id);
    return booking is not null ? Results.Ok(booking) : Results.NotFound(new { message = $"No booking found with ID {id}" }); 
});


app.Run();
