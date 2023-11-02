from arango import ArangoClient
import os

def connect_to_arangodb():
    arango_url = os.environ.get('ARANGO_URL', 'http://localhost:8529')
    username = os.environ.get('ARANGO_USERNAME', 'root')
    password = os.environ.get('ARANGO_PASSWORD', '')
    dbname = os.environ.get('ARANGO_DBNAME', '_system')

    print(arango_url)

    client = ArangoClient(hosts=arango_url)
    db = client.db(dbname, username=username, password=password)
    return db

def test_connection():
    db = connect_to_arangodb()
    test_collection_name = 'your_test_collection'
    
    # Ensure the collection exists
    if not db.has_collection(test_collection_name):
        print(f"The collection '{test_collection_name}' does not exist.")
        return False

    # Try to fetch the first document from the collection
    try:
        collection = db.collection(test_collection_name)
        doc = collection.first()
        if doc is not None:
            print("Connection successful. Document fetched:", doc)
        else:
            print("Connection successful, but the collection is empty.")
        return True
    except Exception as e:
        print("Connection failed:", str(e))
        return False

if __name__ == "__main__":
    test_connection()
