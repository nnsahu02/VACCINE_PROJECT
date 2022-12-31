### VACCINE_PROJECT

## Tech Stack: NodeJS, MongoDB

# Task Description:
Develop APIs to access/manage data on MongoDB (should be deployed on Mongodb
Atlas) for the given use case.

# Use case : 
Imagine there is an app created for vaccine registration (similar to that of Arogyasetu Cowin part).

App has the two functionality 


## => FOR USER

## USER MODEL
```yaml
{Name : {string,mandatory},
PhoneNumber : {Number,mandatory,unique},
Password : {String,mandatory}
Age : {Number,mandatory},
Pincode : {Number,mandatory},
AadharNo : {Number,mandatory}
}
```
## USER APIs
### post/Register
● Register user (Mandatory fields: Name, PhoneNumber, Age, Pincode, AadharNo)

### post/login
● User can login through his PhoneNumber and password (set during registration)

### get/timeSlot
● User should be able to see the available time slots on a given day for vaccine
registration (first/second dose based on his vaccination status)

### post/user/:userId/vaccination/firstDose
● Users can register a slot for the first/second dose of the vaccine (example:
register for 1st dose on 1st June 11 AM).

### post/user/:userId/vaccination/secondDose
● Users should be able to register for the second dose, only after completing their
first dose of vaccine. Once the registered time slot is lapsed, the user should be
considered as vaccinated for that registered dose (first/second).

### put/user/:userId/vaccination/slot
● User can update/change his registered slot, till 24 hours prior to his registered
slot time




## => FOR ADMIN

● Login using admin credentials (There won’t be any api for registering the admin.
His credentials should be manually created in the database)
● Check the total users registered and [filter them by Age/Pincode/Vaccination
status (none/First dose completed/All completed)] - Optional

● Check the registered slots for the vaccine (first dose /second dose/total) on a
given day
Vaccine slot details

● Assume that vaccination drive is happening only from 1st June ‘21 to 30th June
‘21
● Timings of the vaccine : 10 AM to 5 PM everyday
● Each vaccine slot will be of duration 30 minutes. (So slots will be like 10:00 AM to
10:30 AM, 10:30 AM to 11:00 AM etc)
● In each vaccine slot there will be 10 vaccine doses available (vaccine dose is
same for first/second doses. So both users with first dose or second dose can
register).
● So total available vaccine doses => 30*14*10 => 4,200
● Once 10 vaccine doses in a slot is registered, that time slot shouldn’t be available
for further registrations (unless the registered user modifies his time slot to a
different slot)












## BRIFE
To develop the APIs for this use case, you will need to first set up a MongoDB Atlas cluster and create a database to store the user and admin data. You will then need to define the API endpoints and the functionality that they will provide.

For the user-facing endpoints, you will need to create routes for registering a new user, logging in, and viewing the available time slots for vaccine registration. You will also need to create routes for registering a slot for the first or second dose of the vaccine, as well as updating or changing a registered slot.

For the admin-facing endpoints, you will need to create routes for logging in, viewing the total number of users registered and filtering them by various criteria, and checking the registered slots for the vaccine on a given day.

Once you have defined the endpoints, you will need to implement the logic for each endpoint using a web framework such as Express.js. This will involve querying the MongoDB database to retrieve and update data, as well as implementing any necessary validation and error handling.

It may also be helpful to create a test suite to ensure that the APIs are working as expected. This could include unit tests for individual functions and integration tests to verify the end-to-end functionality of the APIs.





To implement the functionality described in the use case, you will need to create the following APIs:

### 1.User registration API:
This API will allow users to register with the vaccine registration app by providing their name, phone number, age, pincode, and Aadhar number.

### 2.User login API: 
This API will allow users to log in to the app using their phone number and password.

### 3.Available vaccine slots API:
 This API will allow users to view the available vaccine slots on a given day, filtered by their vaccination status (first dose or second dose).

### 4.Register for vaccine slot API: 
This API will allow users to register for a vaccine slot by providing the date and time of the slot and the dose (first or second).

### 5.Update registered vaccine slot API: 
This API will allow users to update their registered vaccine slot, as long as the update is made at least 24 hours prior to the original slot time.

### 6.Admin login API: 
This API will allow an admin to log in to the app using their admin credentials.

### 7.Admin user list API: 
This API will allow the admin to view the list of registered users, with the option to filter the list by age, pincode, or vaccination status.

### 8.Admin vaccine slots API: 
This API will allow the admin to view the registered vaccine slots for a given day, including the number of first dose slots, second dose slots, and total slots.