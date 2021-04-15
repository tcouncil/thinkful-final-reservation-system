# Thinkful-Final-Capstone: Restaurant Reservation System

[Live Site](https://front-end-tcouncil.vercel.app "Restaurant Reservation System")  
[Live API](https://back-end-tcouncil.vercel.app "Restaurant Reservation System API")

## API Documentation

| Route       | Method      | Status Code | Description   |
| :---        |    :----:   |     :----:   |        ---: |
| /reservations      | GET   | 200  | Returns a list of reservations for the current date |
| /reservations?date=####-##-##      | GET |  200    | Returns a list of reservations for the given date |
| /reservations      | POST  | 201    | Creates a new reservation |
| /reservations/:reservation_id      | GET  | 200     | Returns the reservation for the given ID |
| /reservations/:reservation_id      | PUT  | 200     | Updates the reservation for the given ID |
| /reservations/:reservation_id/status      | PUT  | 200     | Updates the status of the reservation for the given ID |
| /tables   | GET  | 200      | Returns a list of tables     |
| /tables   | POST  | 201      | Creates a new table     |
| /tables/:table_id   | GET   |      | Returns the table for the given ID     |
| /tables/:table_id/seat   | PUT | 200      | Seats a reservation at the given table_id     |
| /tables/:table_id/seat   | DELETE  | 200      | Changes the occupied status to be unoccupied for the given table_id     |


 Reservation JSON
 ```json
{
  "reservation_id": 1,
  "first_name": "Rick",
  "last_name": "Sanchez",
  "mobile_number": "202-555-0164",
  "reservation_date": "2020-12-31",
  "reservation_time": "20:00:00",
  "people": 6,
  "status": "booked",
  "created_at": "2020-12-10T08:30:32.326Z",
  "updated_at": "2020-12-10T08:30:32.326Z"
}
```

Table JSON
 ```json
{
  "table_id": 1,
  "table_name": "#1",
  "capacity": 6,
  "occupied": false,
  "reservation_id": null
}
```
