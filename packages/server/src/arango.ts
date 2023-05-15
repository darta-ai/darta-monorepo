import {Database} from 'arangojs';
import https from 'https';

(async () => {
  console.log('Hello, world!');
  try {
    const agent = new https.Agent({
      rejectUnauthorized: false,
    });

    // Configure the ArangoDB connection
    const db = new Database({
      // {service name}.{namespace}
      url: 'https://arango-dev-cluster.arango-cluster:8529/',
      databaseName: 'darta1',
      auth: {
        username: 'darta',
        password: '',
      },
      agent,
    });

    console.log('got db ');

    console.log('was it a blip?');
    // Create a new collection of users
    const collection = db.collection('users');
    await collection.create();
    console.log('Created `users`');

    // Create a new document
    const document = {
      _key: 'helloWorld',
      message: 'Hello, world!',
    };

    await collection.save(document);

    // Read the document
    const retrievedDocument = await collection.document('users');
    console.log('Retrieved document:', retrievedDocument);

    // Update the document
    const updatedDocument = {
      ...retrievedDocument,
      message: 'Hello, ArangoDB!',
    };

    await collection.update('helloWorld', updatedDocument);

    // Read the updated document
    const retrievedUpdatedDocument = await collection.document('helloWorld');
    console.log('Retrieved updated document:', retrievedUpdatedDocument);

    // Delete the document
    // await collection.remove('helloWorld');
    // console.log('Document deleted');

    await collection.drop();
    console.log('Good job, cya later.');
  } catch (err: any) {
    console.error(err.message);
  }
})();
