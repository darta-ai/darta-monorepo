import { Database } from 'arangojs';
import https from 'https';

// This is just an example.
// Let's think about how to use it.
(async () => {
  try {
    const agent = new https.Agent({
      rejectUnauthorized: false,
    });

    // Configure the ArangoDB connection
    const db = new Database({
      // {service name}.{namespace}
      url: 'https://arango-dev-cluster.arango-cluster:8529',
      databaseName: 'darta1',
      auth: {
        username: 'darta',
        password: '',
      },
      agent,
    });
  
    // Create a new collection
    const collection = db.collection('helloWorldCollection');
    await collection.create();
    console.log("Created `helloWorldCollection`")
  
    // Create a new document
    const document = {
      _key: 'helloWorld',
      message: 'Hello, world!',
    };
  
    await collection.save(document);
  
    // Read the document
    const retrievedDocument = await collection.document('helloWorld');
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
    await collection.remove('helloWorld');
    console.log('Document deleted');

    await collection.drop()
    console.log("Good job, cya later.")

  } catch (err: any) {
    console.error(err.message);
  }
})();
