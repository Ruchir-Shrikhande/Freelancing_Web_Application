## CS546-Project


This website is an online platform to freelance services like such as web 
development, app development, logo designing, photography, and digital 
marketing etc. This website serves for both people who are looking for 
freelancers as well as jobs.

Core Features
1. Landing Page: Will have the list of jobs that is available (to show more 
relevant result, will show the jobs that matches the user interest and jobs
available in his location). The page will also have search bar that includes 
keyword search (runs search over title/description/tags) and tag-based 
search, and filter.
2. Sign Up Page: Should have option to enter Email ID, Username, Password, 
Confirm Password.
3. Job Page (Employee View): Each job will have a name, location (inperson/remote/hybrid), posted time, detailed description (Roles and 
responsibilities), interested button, salary range (if mentioned by the 
employer), tags related to the service, 
4. There will be a change to the status of the “interested button” to accept 
or reject the offer (if the employer sends an offer). 
5. Post a Job Page (Employer View): Each job will have a name, location (inperson/remote/online), detailed description (Roles and responsibilities),
interested button, salary range(optional), tags related to the service
(maximum 5), 
6. There will be an additional tab that comes along once the job is posted 
where the employer will have the option to look at the applied candidates 
list.
7. User Profile: Created when users create an account. An account allows 
users to add job posting to freelance or to be an employee to take up a 
job. Employer should be able to add a job and delete it, can also update
the state to “position filled”. The Employer profile shows the username, 
resume, as well as recently posted jobs and its status. The Employee 
profile will show the jobs taken (cannot take more than 2 jobs at a point 
in time).
8. See interested candidates page: Employer should be able to see who are 
interested candidates listed under their job posting and link to user’s 
profile.
9. Review and Rating Page – Once a job is assigned (accepted by the 
employee), the Employer should be able to Review, Rate and Report an 
employee and the Employee should be able to Review, Rate and Report 
an employer.

Extra Features
1. Email verification - User should be able to create their profile through 
email verification, a token will be generated and sent to the user for 
him/her to verify their email ID. 
2. Save this job option – An Employee can add job posting to their wish list.
3. Know your Employer Option - Employees can see the history of all job 
posting and their reviews and rating for an employer.

About Website:
We have created a freelancing website. This website is an online platform for freelance services such as web development, app development, logo designing, photography, and digital marketing, etc. This website serves both people who are looking for freelancers as well as jobs.
Before running the code:
Run npm i to install all the dependencies.
Run npm run seed to seed the initial users, posts, and applications in the database.
Then run npm start to start the project.
SignUp and Login:
User have to register to use the freelancing website.
First, the user needs to sign up to the website in order to be able to login. They will need to enter all and valid inputs for the sign up form. Username and email already registered to the web site cannot be signed up again.
After the successful registration, the email verification is sent to the user. After that user can login and use the website.
Once the user has successfully signed up, they will be redirected to the login page. From there, they can enter their username and password and then the application will ask them to validate their email in case both the username and password are correct.
Once the user has verified their email through the provided url, they will be automatically logged in just that once.
Freelancing page :
After the user can see the landing/home page of the application. The user has the option to navigate to various pages like 'profile' and 'post a job page', logout out, and even search and filter through displayed jobs via a search bar and dropdown displayed on the nav bar. The main page of the home screen has a list of jobs displaying various info about them.
The user can click on any of the jobs and they will be redirected to that specific post's page which will have all the details about the post. If it is not posted by the user and the job is still marked as active, they can see an option to apply to that job posting. Once the user applies to the job by clicking on apply and entering valid input in the rendered form, The application gets submitted.
After that you can see the user's username under the applicant section of the applied post.
The employer for that post can send an invite to the applicant and similarly, the employee can accept the invite.

Upon completion of the job, the employer can mark that job as completed and only upon completion the user will see the review and rating button. The user will be redirected to.a form where they can post the review and rating for their employer or employee.
After successfully submitting, the user can see the posted reviews under the reviews section on the viewPost page

