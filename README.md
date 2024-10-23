# Personal Expense Tracker

## Setup Instructions
1. Clone the repository.
2. Run `npm install` to install the dependencies.
3. Start the server using `node index.js`.

## API Endpoints

### Add a Transaction
**POST** /transactions
```json
{
  "type": "income",
  "category": "salary",
  "amount": 1000,
  "date": "2024-10-23",
  "description": "Monthly salary"
}
