const dbConnection = require("./config/mongoConnection");
const users = require("./data/user");

async function main() {
  const db = await dbConnection.connectToDb();
  await db.dropDatabase();

  try {
    let user1 = await users.createUser(
      "user1",
      "thiru",
      "naa",
      "thiru@gmail.com",
      "Password@123",
      "4235687123",
      "male",
      "1995-12-12",
      ["Programming and Tech"]
    );

    // setting a five second delay between user creation to ensure we don't send verification emails in quick succession
    await new Promise((r) => setTimeout(r, 5000));

    let user2 = await users.createUser(
      "user2",
      "jesh",
      "wanth",
      "test8@gmail.com",
      "Password@123",
      "5513581851",
      "male",
      "1999-01-12",
      ["Sales"]
    );

    // let user3 = await users.createUser('user3', 'aravindth', 'shiva', 'test@gmail.com', 'Password@123', '2891999999', 'male',
    //     '1996-01-11', 'Sales')
    // let user4 = await users.createUser('user4', 'koushal', 'raja', 'test1@gmail.com', 'Password@123', '5514351872', 'male',
    //     '1995-02-02', 'Programming and Tech')
    // let user5 = await users.createUser('user5', 'swathy', 'purush', 'test2@gmail.com', 'Password@123', '7689543256', 'female',
    //     '1998-12-12', 'Programming and Tech')
    // let user6 = await users.createUser('user6', 'pravar', 'goel', 'test3@gmail.com', 'Password@123', '9826512367', 'male',
    //     '1992-03-03', 'Graphics and Design')
    // let user7 = await users.createUser('user7', 'ruchir', 'shri', 'test4@gmail.com', 'Password@123', '6543789213', 'male',
    //     '1997-01-04', 'Programming and Tech')
    // let user8 = await users.createUser('user8', 'rakesh', 'balaji', 'test5@gmail.com', 'Password@123', '8765341230', 'male',
    //     '1995-01-02', 'Graphics and Design')
    // let user9 = await users.createUser('user9', 'keer', 'thana', 'test6@gmail.com', 'Password@123', '5528791265', 'female',
    //     '1995-07-03', 'Sales')
    // let user10 = await users.createUser('user10', 'thiru', 'naa', 'test7@gmail.com', 'Password@123', '5513581851', 'female',
    //     '1997-07-12', 'Programming and Tech')

    // Updating emailVerified flag
    const userCollection = await db.collection("users");
    const userDoc = await userCollection.findOne({ userName: "user1" });
    userDoc.emailVerified = true;
    await userCollection.updateOne({ userName: "user1" }, { $set: userDoc });

    const userTwoDoc = await userCollection.findOne({ userName: "user2" });
    userTwoDoc.emailVerified = true;
    await userCollection.updateOne({ userName: "user2" }, { $set: userTwoDoc });
  } catch (error) {
    console.log(error);
  }
  console.log("Done seeding database");

  await dbConnection.closeConnection();
}
main();

// module.exports = {
//     seedUsers: main
// }
