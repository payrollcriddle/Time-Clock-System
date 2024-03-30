# Time Clock System

The Time Clock System is a web-based application designed to streamline and automate the process of tracking employee work hours, generating timecards, and managing employee information. This system is particularly useful for businesses with hourly employees who need to accurately record their time worked.

## Features

- **User Authentication**: Employees, supervisors, and administrators can log in to the system using their respective credentials.
- **Employee Management**: Administrators have the ability to add, edit, and remove employee records. They can input employee details such as name, employee ID, job title, and location.
- **Clock In/Out**: Employees can easily clock in and out using the system, recording their start and end times for each shift.
- **Timecard Generation**: The system automatically generates timecards based on the employee's clock in/out records. Timecards display daily and weekly hours worked, including regular hours, overtime hours, and double time hours.
- **Meal Period Tracking**: Employees can track their meal periods, indicating whether they took their required breaks. The system ensures compliance with state-specific labor laws regarding meal periods.
- **Timecard Submission and Approval**: Employees can submit their timecards for review, and supervisors can approve or reject the submitted timecards. The system includes a submission dialog that captures the employee's acknowledgment of the accuracy of their timecard.
- **Notifications**: Supervisors receive notifications for important events, such as missing clock out records or short meal periods, helping them identify and address any issues promptly.
- **Reporting**: The system generates reports on employee hours, overtime, and compliance with labor regulations. These reports can be filtered by date range, employee, or location.

## Technologies Used

- Front-end: HTML, CSS, JavaScript
- Back-end: Node.js, Express.js
- Database: MongoDB
- Authentication: JSON Web Tokens (JWT)
- Notifications: Microsoft Teams API

## Project Architecture

The Time Clock System follows a client-server architecture. The front-end is built using HTML, CSS, and JavaScript, while the back-end is implemented using Node.js and Express.js. The application uses MongoDB as the database to store employee records, timecards, and other relevant data.

The project is structured into the following main directories:

- `client`: Contains the client-side code, including HTML, CSS, and JavaScript files.
- `server`: Contains the server-side code, including the Express.js application and API routes.
- `config`: Contains configuration files for the application, such as database connection settings.
- `models`: Contains the MongoDB database models for employees, timecards, and other entities.
- `routes`: Contains the API route definitions for various endpoints.
- `middleware`: Contains custom middleware functions used in the Express.js application.
- `utils`: Contains utility functions and helper modules.
- `tests`: Contains test files for unit testing and integration testing.

## Getting Started

To set up and run the Time Clock System locally, follow these steps:

1. Clone the repository: `git clone https://github.com/your-username/time-clock-system.git`
2. Install the dependencies: `npm install`
3. Set up the MongoDB database and configure the connection in `config/database.js`
4. Start the server: `npm start`
5. Open the application in your web browser at `http://localhost:3000`

## Testing

The Time Clock System includes a test suite to ensure the correctness and reliability of the application. To run the tests, use the following command:

The test suite includes unit tests for individual components and integration tests to verify the proper functioning of the system as a whole.

## Deployment

To deploy the Time Clock System to a production environment, follow these steps:

1. Set up a production MongoDB database and update the connection settings in `config/database.js`
2. Build the client-side code for production: `npm run build`
3. Start the server in production mode: `npm run start:prod`
4. Configure any necessary environment variables, such as API keys and secrets.
5. Deploy the application to your preferred hosting platform, such as AWS, Heroku, or DigitalOcean.

## Contributing

Contributions to the Time Clock System project are welcome! If you find any issues or have suggestions for improvements, please submit an issue or a pull request. Make sure to follow the established coding conventions and provide appropriate documentation for your changes.

## License

This project is licensed under the [MIT License](LICENSE).

## Contact

If you have any questions, suggestions, or feedback, please feel free to contact the project maintainer
