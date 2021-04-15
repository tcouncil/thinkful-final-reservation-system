# Thinkful-Final-Capstone: Restaurant Reservation System

[Live Site](https://front-end-tcouncil.vercel.app/dashboard "Restaurant Reservation System")
[Live API](https://back-end-tcouncil.vercel.app "Restaurant Reservation System API")

## API Documentation

| Route       | Method      | Description   |
| :---        |    :----:   |          ---: |
| /reservations      | GET       | Returns a list of reservations for the current date |
| /reservations?date=####-##-##      | GET       | Returns a list of reservations for the given date |
| /reservations      | POST       | Creates a new reservation |
| /reservations/:reservation_id      | GET       | Returns the reservation for the given ID |
| /reservations/:reservation_id      | PUT       | Updates the reservation for the given ID |
| /reservations/:reservation_id/status      | PUT       | Updates the status of the reservation for the given ID |
| /tables   | GET        | Returns a list of tables     |
| /tables   | POST        | Creates a new table     |
| /tables/:table_id   | GET        | Returns the table for the given ID     |
| /tables/:table_id/seat   | PUT        | Seats a reservation at the given table_id     |
| /tables/:table_id/seat   | DELETE        | Changes the occupied status to be unoccupied for the given table_id     |


 
 ```json
{
  "firstName": "John",
  "lastName": "Smith",
  "age": 25
}
```
