# DriveEase Car Rental

A modern full-stack car rental web application for discovering vehicles, checking availability, creating reservations, managing bookings, and cancelling upcoming rentals.

## Live Demo

**DriveEase:** https://driveease-car-rental-tm74.hatchable.site

> The live deployment currently uses Hatchable authentication. Anonymous visitors may need the Hatchable project visibility set to Public.

## Features

- Responsive premium car-rental interface
- Vehicle discovery and filtering
- Dedicated vehicle details pages
- Date/time-based availability checking
- Server-side booking validation
- Automatic rental-day and total-price calculation
- Authenticated booking creation
- My Bookings dashboard
- Booking cancellation before pickup
- Booking confirmation page
- Deterministic local vehicle image mapping
- PostgreSQL-backed rental schema
- Protected user booking APIs

## Booking Flow

1. Browse the fleet.
2. Open a vehicle details page.
3. Select pickup and return dates/times.
4. Check live availability.
5. Enter customer details and confirm the reservation.
6. View the booking confirmation.
7. Manage or cancel eligible upcoming bookings from **My Bookings**.

## Tech Stack

- HTML5
- CSS3
- JavaScript
- PostgreSQL
- Hatchable authentication and serverless APIs
- Responsive custom CSS

## Project Structure

```text
api/
migrations/
public/
  cars/
  index.html
  app.html
  car.html
  booking.html
  bookings.html
  confirmation.html
  login.html
  theme.css
hatchable.toml
seed.sql
README.md
.gitignore
```

## API Endpoints

| Endpoint | Method | Purpose | Access |
|---|---|---|---|
| `/api/cars` | GET | List active vehicles | Public |
| `/api/car?id=` | GET | Get vehicle details | Public |
| `/api/check-availability` | GET | Check date/time conflicts | Public |
| `/api/create-booking` | POST | Create a reservation | Authenticated |
| `/api/my-bookings` | GET | Get signed-in user's bookings | Authenticated |
| `/api/cancel-booking` | POST | Cancel an eligible booking | Authenticated |

## Database

The project uses two core tables:

- `cars` — vehicle information, pricing, specifications, and active/featured state.
- `bookings` — customer reservation details, rental period, locations, status, and total amount.

Booking conflict protection prevents overlapping `pending` or `confirmed` reservations for the same vehicle.

## Security

- Booking APIs require authentication where appropriate.
- Users can only access their own bookings.
- Booking ownership is checked server-side.
- Cancellation is restricted to upcoming eligible bookings.
- Do not commit API keys, database passwords, tokens, or other secrets.

## Setup

This repository is structured for the Hatchable runtime. Import the project into Hatchable, configure authentication/database access, apply the migrations and seed data, then deploy.

The frontend files under `public/` can be inspected directly, while API routes and authentication require the Hatchable runtime.

## Portfolio Highlights

This project demonstrates authentication, REST-style API design, relational database modeling, validation, availability logic, booking state management, responsive frontend design, and an end-to-end reservation flow.

## Future Improvements

- Online payments and invoices
- Email/SMS booking notifications
- Admin fleet management
- Vehicle maintenance tracking
- Customer reviews and ratings
- Advanced pickup/location search
- Automated reminder notifications
- Production analytics integrations

## License

This project is provided for portfolio and learning purposes.
