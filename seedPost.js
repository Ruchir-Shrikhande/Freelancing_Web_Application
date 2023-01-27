const dbConnection = require("./config/mongoConnection");
const posts = require("./data/post");
const application = require("./data/applications");

async function mainTwo() {
  const db = await dbConnection.connectToDb();
  // await db.dropDatabase();
  try {
    let post1 = await posts.createPost(
      "New York",
      "As a software developer intern, you will get the opportunity to learn about various aspects of our trucks and how they correlate to the work that our team does. You will get to see the development work that we do in support of our future truck launches and the production support as issues surface.You will get exposure to Agile Methodology for software development, internal customer interviews and developing tools based on their needs!",
      "Software Engineer",
      "Programming and Tech",
      "#software engineer",
      "Remote",
      "15",
      "user1"
    );
    let post2 = await posts.createPost(
      "New York",
      "We look for potential candidates who is Major in Computer Science, MIS, or other related technology majors",
      "Web Scraper",
      "Sales",
      "#scrapig",
      "Remote",
      "20",
      "user1"
    );
    let post3 = await posts.createPost(
      "New York",
      "The primary function of the Database Developer would be database deployments and maintenance. To work with application development team in supporting and enhancing current products as well as development of new products. Optimizing data schemes based on application needs.",
      "Database Developer",
      "Programming and Tech",
      "databaseengineer java",
      "Remote",
      "25",
      "user1"
    );
    let post4 = await posts.createPost(
      "New York",
      " looking for a remote based Associate (2-4 yrs experience) UI/UX Visual Designer to turn software into easy-to-use products for our clients. UI/UX Designer responsibilities include gathering user requirements, designing graphic elements and building navigation components. To be successful in this role, you should have experience with design software and wireframe tools.",
      "Associate Virtual Designer",
      "Sales",
      "design logo",
      "Remote",
      "15",
      "user1"
    );
    let post5 = await posts.createPost(
      "New York",
      "Looking for the individual who assists in the design, development, testing, and implementation of software applications Develop test cases, and conduct visual and functional testing based on project requirements Properly document all test cases, bugs, and remediation as required for the project team",
      "Software Engineer",
      "Programming and Tech",
      "software engineer",
      "Remote",
      "50",
      "user1"
    );

    let post6 = await posts.createPost(
      "New Jersey",
      "looking for a Software Developer (Entry Level) to support our customer in creating capabilities and providing technical services and subject matter expertise in Mission Command and C2 Maneuver systems. You will provide primary technical support to various radar systems to include AN/TPQ – 53 Radar System.",
      "Software Engineer",
      "Programming and Tech",
      "software engineer nj",
      "Remote",
      "30",
      "user2"
    );
    let post7 = await posts.createPost(
      "New Jersey",
      "The Senior Software Developer will be tasked with fostering and growing the companys various software solutions and infrastructure. The ideal candidate should be well-versed in customer facing software, with a hunger to learn in technology spaces which they have not been exposed to, as well as open to evolve our technology stack to address market changes.",
      "Senior Software Developer",
      "Programming and Tech",
      "sde nj",
      "Remote",
      "35",
      "user2"
    );
    let post8 = await posts.createPost(
      "New Jersey",
      "Candidate should collaborate with business and end users to understand the requirement and come up with the delivery plan.Analyze requirement and provide delivery estimates.Coordinate within the technology teams to resolve ongoing data related issues.",
      "Software Developer",
      "Programming and Tech",
      "software engineer nj",
      "Hybrid",
      "40",
      "user2"
    );
    let post9 = await posts.createPost(
      "New Jersey",
      "Creates, develops, plans, writes, and edits operational, instructional, maintenance, or test procedures for paper, multimedia, web-based publications, and user sites; may produce content for embedded user assistance technology.",
      "Content Writer",
      "Writing",
      "software engineer writer",
      "Remote",
      "20",
      "user2"
    );
    let post10 = await posts.createPost(
      "New Jersey",
      "The Data Analytics Intern is primarily responsible for assisting other Data Analytics team with data mining, data interpretation, and report generation. Be ready to collaborate in a team environment. They will also be working with others who are passionate about making a positive impact on the industry, building data integration solutions to meet the requirements of the business. Manage data analysis and data integration across various systems.",
      "Data Analyst",
      "Sales",
      "analyst data",
      "Hybrid",
      "15",
      "user2"
    );

    // let post11 = await posts.createPost('Texas', 'The Database Developer will be responsible for database development in support of a large business applications including new initiatives as well as existing support.', 'SQL Developer',
    //     'Programming and Tech', '#dev', 'Hybrid', '25', 'user3')
    // let post12 = await posts.createPost('Texas', 'This position’s primary responsibility will be to translate software requirements into working and maintainable solutions within the existing application frameworks. The chosen candidate will apply technical proficiency across different stages of the Software Development Life Cycle, gather accurate requirements and work closely with stakeholders to prioritize tasks and the scope of development. The role will require strong attention to detail with the ability to identify errors and make adjustments in a testing environment while contributing towards developing and adhering to best-practices for developing applications that are scalable, relevant, and critical to the project.', 'Java Developer',
    //     'Programming and Tech', '#dev', 'Hybrid', '30', 'user3')
    // let post13 = await posts.createPost('Texas', 'Our Application Development teams use their expertise in programming languages and software design to develop next-generation technology. They are responsible for developing the applications which track and move up to 38 million packages in a single day', 'Application Developer',
    //     'Programming and Tech', '#app, #dev', 'Hybrid', '15', 'user3')
    // let post14 = await posts.createPost('Texas', 'The Software Engineer is responsible for creation, design, continuous improvement, support, and validation of software to control OEM equipment and support systems for a world class design and manufacturer of finishing equipment for the digital/ink jet market and label industry. All engineering and manufacturing (including parts) are performed in-house so the engineers can see in the entire process.', 'Software Engineer',
    //     'Programming and Tech', '#dev', 'Hybrid', '40', 'user3')
    // let post15 = await posts.createPost('Texas', 'We are looking for smart, hardworking candidates who excel in fast-paced, results oriented environments. We look for candidates that take initiative and have a strong sense of responsibility. The candidate must be able to work as a team, communicate openly and honestly and be interested in taking on growing responsibilities within the company.', 'Sales Manager',
    //     'Sales', '#sales', 'In-Person', '25', 'user3')

    // let post16 = await posts.createPost('California', 'Design, develop and implement automation scripts for various types of data loads.Responsible for the successful execution of daily, monthly and quarterly data loads.Support production support team, investigate and provide resolution for ongoing data issues.Report status and progress on assigned and ongoing tasks.2+ years of programming knowledge is required for this position', 'python developer',
    //     'Programming and Tech', '#python, #dev', 'Remote', '15', 'user4')
    // let post17 = await posts.createPost('California', 'When you come to work for New Jersey Judiciary you will join an 8500-member strong team that operates with the highest standards of independence, integrity, fairness and quality service. You will be engaged with work that has purpose, meaning and makes a difference in lives of the public we serve.', 'cyber Securiy Analyst',
    //     'Programming and Tech', '#security', 'In-Person', '20', 'user4')
    // let post18 = await posts.createPost('California', 'The Database Developer will be responsible for database development in support of a large business applications including new initiatives as well as existing support.', 'Database Developer',
    //     'Programming and Tech', '#database, #dev', 'Hybrid', '25', 'user4')
    // let post19 = await posts.createPost('California', 'We are looking for a Web Developer to build frontend experiences across our public site, from the radar.com homepage, to product landing pages, developer documentation, new landing pages and micro-sites. You will work closely with both our Engineering/Product/Design team and our Marketing team. This is a very visible and critical role that will help supercharge our public website.', 'web development',
    //     'Programming and Tech', '#web, #dev', 'Hybrid', '30', 'user4')
    // let post20 = await posts.createPost('California', 'The Data Engineer role will work closely with an agile development team to analyze and optimize ETL processes, tables, views, materialized views, and stored procedures to create a high-performance data warehouse solution for our client. This role will be working with a diverse set of technology including Amazon Redshift and S3 and Snowflake. The Data Engineer will focus on optimizing existing systems as well as developing designs and strategies for implementing new systems. This role will be responsible for requirements gathering, analysis, data categorization, interpreting requirements, and developing development tasks for sprint execution.', 'Database Engineer',
    //     'Programming and Tech', '#dev,#db', 'Remote', '35', 'user4')

    // let post21 = await posts.createPost('Virginia', 'Web developer is required for this position, prior work experience in developing websites is required',
    //     'web developer', 'Programming and Tech', '#web ,#javascript, #react', 'Remote', '20', 'user5')
    // let post22 = await posts.createPost('Virginia', 'Our customer is looking to bring on a BI Developer to help their data visualization team generate Tabular Models. They use SQL Server Analysis Service for the primary technology in order to design and build these tabular models (so experience with SQL will help). This role will serve in creating the models which are a final step before the data is visualized using Power BI, so experience within Power BI will help inform someone in this role what design decisions they should make. On a day to day basis, this person will work with people across various business units and the data warehouse developers to help understand the requirements for each specific model this person will be tasked with creating using DAX and SSAS.',
    //     'PowerBI developer', 'Programming and Tech', '#powerBI ,#dashboard', 'Hybrid', '25', 'user5')
    // let post23 = await posts.createPost('Virginia', 'We are currently seeking a Software Engineering to join our dynamic and growing engineering team.2+ years of work experience is required',
    //     'Software developer', 'Programming and Tech', '#software ,#dev', 'Hybrid', '30', 'user5')
    // let post24 = await posts.createPost('Virginia', 'The Business Intelligence Analyst/ Marketing CRM Analyst will assist Business Intelligence Manager to create and do regular updates/maintenance of dashboards and reports in Salesforce for the business. She/he will also be responsible for helping conducting regular analysis on the sales pipeline, lead and opportunity conversion rates. Marketing Salesforce CRM analyst will also help the organization optimize the utilization Marketing Automation.',
    //     'Business Intellegence Data Engineer', 'Sales', '#data ,#engineering', 'Hybrid', '35', 'user5')
    // let post25 = await posts.createPost('Virginia', 'Data analyst sought to enhance an existing business intelligence group responsible for building and maintaining a corporate wide enterprise data warehouse. Seeking an individual eager to expand their current skillset into data modeling and database design. Primary responsibilities include evaluating and documenting data needs of key stakeholders, data mart design, ETL development, and general data analysis.',
    //     'Data Analyst', 'Sales', '#data', 'In-Person', '40', 'user5')

    //console.log("User: ", post1._id);
    let app1 = await application.createApplication(
      "user1",
      post1._id.toString(),
      "Masters",
      "2",
      "126 Manhattan,NJ",
      "25000"
    );
    let app2 = await application.createApplication(
      "user1",
      post2._id.toString(),
      "Masters",
      "2",
      "126 Manhattan,NJ",
      "25000"
    );
    let app3 = await application.createApplication(
      "user1",
      post3._id.toString(),
      "Masters",
      "2",
      "126 Manhattan,NJ",
      "25000"
    );
    let app4 = await application.createApplication(
      "user1",
      post4._id.toString(),
      "Masters",
      "2",
      "126 Manhattan,NJ",
      "25000"
    );
    let app5 = await application.createApplication(
      "user2",
      post5._id.toString(),
      "Bachelors",
      "2",
      "26 Graham st,NJ",
      "25000"
    );
    let app6 = await application.createApplication(
      "user2",
      post6._id.toString(),
      "Bachelors",
      "2",
      "26 Graham st,NJ",
      "25000"
    );
  } catch (e) {
    console.log(e);
  }

  await dbConnection.closeConnection();
}

mainTwo();

// module.exports = {
//     seedPosts: mainTwo
// }
