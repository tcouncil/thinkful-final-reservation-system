# Thinkful-Final-Capstone: Restaurant Reservation System

[Live Site](https://front-end-tcouncil.vercel.app/dashboard "Restaurant Reservation System")
[Live API](https://back-end-tcouncil.vercel.app "Restaurant Reservation System API")

## API Documentation

| Route       | Method      | Description   |
| :---        |    :----:   |          ---: |
| /reservations      | GET       | Returns a list of reservations for the current date |
| /reservations?date=####-##-##      | GET       | Returns a list of reservations for the given date |
| /reservations      | POST       | Creates a new reservation |
| /reservations/:reservation_id      | PUT       | Updates the reservation for the given ID |
| /tables   | GET        | And more      |


 ```json
{
  "firstName": "John",
  "lastName": "Smith",
  "age": 25
}
```
