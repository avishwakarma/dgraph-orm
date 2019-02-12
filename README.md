# DgraphORM
An ORM for Dgraph

## What its all about

DgraphORM is a package to simplify the schema creation for Dgraph similar to Mongoose, Sequilize and etc.

## Installation

```
npm install dgraph-orm
```

## Sample schema

```javascript
import dgraph from 'dgraph-orm';

const UserSchema = new dgraph.Schema('user', {
  name: {
    type: dgraph.Types.STRING,
    index: true,
    token: {
      term: true
    }
  },
  email: {
    type: dgraph.Types.STRING,
    index: true,
    unique: true,
    token: {
      exact: true
    }
  },
  password: dgraph.Types.PASSWORD,
  bio: dgraph.Types.STRING,
  friend: {
    type: dgraph.Types.UID,
    model: 'user', // related model name
    count: true,
    reverse: true
  }
});

/**
 * Set and create model out of the schema
 */
const User = dgraph.model(UserSchema);
```

## Types
DgraphORM suports all the types supported in Dgraph

```javascript

// uid
dgraph.Types.UID

// int
dgraph.Types.INT

// string
dgraph.Types.STRING

// float
dgraph.Types.FLOAT

// bool
dgraph.Types.BOOL

// datetime
dgraph.Types.DATETIME

// geo
dgraph.Types.GEO

// password
dgraph.Types.PASSWORD

```

## Indexes

DgraphORM supports all the index types and tokenizers

```javascript
import dgraph from 'dgraph-orm';

const UserSchema = new dgraph.Schema('user', {
  name: {
    type: dgraph.Types.STRING,
    unique: true, // enable unique constraint on the field (only works with type STRING, INT and FLOAT)
    list: true, // enable list type
    count: true, // enable count on the field
    lang: true, // enable lang type 
    index: true, // enable index
    token: {
      term: true, // enable term index tokenizer
      fulltext: true, // enable fulltext index tokenizer
      trigram: true // enable trigram index tokenizer
    }
  }
});
```

Different field type can have diferent type of indexes and tokenizers, please see [Dgraph Documentaion](https://docs.dgraph.io/query-language/#indexing) for the same.

## Main methods

```javascript
import dgraph from 'dgraph-orm';

/**
 * connect
 * 
 * Connect dgraph database
 */
dgraph.connect(host, port, credential);

/**
 * model
 * 
 * Generate model from schema
 */
dgraph.model(Schema);

/**
 * logging
 * 
 * set custom logger
 * 
 * Default is console.log
 */
dgraph.logging(logger: function)

/**
 * disconnect
 * 
 * close database connection
 */
dgraph.disconnect();

/**
 * original 
 * 
 * dgraph-js properties
 * 
 * All properties from dgraph-js are also availble in the dgraph object
 * 
 * Payload
 * createPayload
 * Response
 * createResponse
 * Mutation
 * Operation
 * Request
 * Assigned
 * TxnContext
 * Check
 * Version
 * NQuad
 * Value
 * Facet
 * SchemaNode
 * LinRead
 * Latency
 * DgraphClientStub
 * DgraphClient
 * deleteEdges
 * Txn
 * ERR_NO_CLIENTS
 * ERR_FINISHED
 * ERR_ABORTED
 * 
 * Check dgraph-js documentaion for more details
 * 
 * https://github.com/dgraph-io/dgraph-js
 */
dgraph.original;

```


## Model methods

The created model have methods to query the dgraph database

```javascript
/**
 * query
 * 
 * dgraph's raw query
 */
User.query(query: String);

/**
 * queryWithVars
 * 
 * dgraph's raw query with varibales
 * 
 * to know more visit
 * https://docs.dgraph.io/master/query-language/#graphql-variables
 * 
 */
User.queryWithVars(params = {
  query: String,
  variables: {}
});

/**
 * create
 * 
 * dgraph's create mutation
 * 
 */
User.create({
  field_name: value
});

/**
 * update
 * 
 * dgraph's update mutation
 * 
 */
User.update({
  field_name: value
}, {
  field: value
} or uid: String);

/**
 * delete
 * 
 * dgraph's delete mutation
 * 
 */
User.delete(uid: String);

// Delete multiple uids
User.delete([uid1: String, uid2: String]);

/**
 * checkPassword
 * 
 * dgraph's checkpwd query
 * 
 * Note: A field type PASSWORD 
 * 
 */
User.checkPassword(uid: String, field: string, password: String);

/**
 * has
 * 
 * dgraph has root method to query nodes
 */ 
User.has(field_name: String, options);

/**
 * eq
 * 
 * dgraph eq root method to query nodes
 */
User.eq(field_name: String, value: String, options);

/**
 * uid
 * 
 * dgraph's uid root method to query nodes
 */
User.uid(uid_value: String | String[], options);

/**
 * allofterms
 * 
 * dgraph's allofterms root method to query nodes
 * 
 */
User.allofterms(field: String, value: String, options);

/**
 * anyofterms
 * 
 * dgraph's anyofterm root method to quert nodes
 */
User.anyofterms(field: String, value: String, options);

/**
 * anyoftext
 * 
 * dgraph's anyoftext root method to query nodes
 */
User.anyoftext(field: String, value: String, options);

/**
 * alloftext
 * 
 * dgaph's alloftext root method to query nodes
 */
User.alloftext(field: String, value: String, options);

/**
 * regexp
 * 
 * dgraph's regexp method to query nodes
 */
User.regexp(field: String, regex: String, options);

/**
 * near
 * 
 * dgraph's near root method to query nodes
 * 
 * Note: only works with geo type predicate
 */
User.near(field: String, value = {
  latitude: float,
  longitude: float
  distance: number
}, options);

/**
 * contains
 * 
 * dgraph's contains root method to query nodes
 * 
 * Note: only works with geo type predicate
 */
User.contains(field: String, value = {
  latitude: float,
  longitude: float
}, options);
```

### Options

Every model method acceopts options to filter, paginate and order the nodes

```javascript
// Simple filtering

// retrive all nodes having user.name and user.email 'akvlko@gmail.com'

User.has('name', {
  filter: {
    email: {
      $eq: 'akvlko@gmail.com'
    }
  }
});

// OR condition

// retrives all the nodes having user.name where user.email is 'akvlko@gmail.com' or user.name is 'Ashok'

User.has('name', {
  filter: {
    $or: {
      name: {
        $eq: 'Ashok'
      },
      email: {
        $eq: 'akvlko@gmail.com'
      }
    }
  }
});

// Specific Attributes

// retrives all the nodes having user.name with their name and email only

// PS: by default fetches all the fields defined in the schema (exepct relations) if attributes property is not given.

User.has('name', {
  attribute: ['name', 'email']
});

// Single Order

// retrives all the nodes having user.name and order them by user.email ASC

User.has('name', {
  order: ['email', 'ASC']
});


// Multiple order

// retrives all the nodes having user.name and order them user.name ASC and user.email DESC

User.has('name', {
  order: [['name', 'ASC'], ['email', 'DESC']]
});

// Pagination

// Retrives 10 nodes having user.name skipping first 5 after 0.x25 uid

User.has('name', {
  first: 10,
  offset: 5,
  after: '0x25'
});

// Quering Relation

// Retrives all the nodes haing user.name along with count of their friend as friends

User.has('name', {
  include: {
      freind: {
      count: true,
      as: 'freinds'
    }
  }
});

// Full options in relation

User.has('name', {
  include: {
    friend: {
      as: 'freinds',
      filter: {}, // accept a filter like the above example
      attributes: ['name', 'email'], // accepts attributes like the abobe example
      order: [], // accepts order like the above example
      first: 10, // accepts first
      offset: 2, // accepts offset
      after: '0x21' // accepts after
    }
  }
});
```

## Create

Create example using model

```javascript
// Create

/**
 * Creates a new user with passed fields
 * 
 * Returns the created user along with the generated uid
 */
const user = await User.create({
  name: 'Ashok Vishwakarma',
  email: 'akvlko@gmail.com',
  bio: 'My bio ...'
});

console.log(user);
// {
//    uid: '0x1',
//    name: 'Ashok Vishwakarma',
//    email: 'akvlko@gmail.com',
//    bio: 'My bio ...'
// }
```


## Update

Update example using model

```javascript
/**
 * Recommended
 * 
 * using uid
 */
User.update({
  name: 'Ashok Kumar Vishwakarma',
}, '0x1');

/**
 * Not Recommended
 * 
 * using field
 * Using field will update the first users matching with the field values
 */
User.update({
  name: 'Ashok Kumar Vishwakarma',
}, {
  email: 'akvlko@gmail.com'
});
```


## Delete

Delete example using model

__PS:__ Delete only support `<uid> * *` pattern, which means all the related predices will be deleted

```javascript
/**
 * single user
 * 
 * Will delete the user having uid 0x1
 */
User.delete('0x1');

/**
 * multiple users
 * 
 * Will delete the users having uid 0x1 and 0x2
 */
User.delete(['0x1', '0x2']);
```

## Futute releases

* Relation of relation
* More delete paterns
* Other geo queries witin, intersects
* Groupby


## Contribution

Issues and pull requests are welcome for

* Unit test cases
* Feature and query method implementation
* Bug fixes

## Author
![my_pic](https://avatars1.githubusercontent.com/u/389185?s=100&v=1)

[](https://avatars1.githubusercontent.com/u/389185?s=460&v=4)
### Ashok Vishwakarma

[LinkedIn](https://www.linkedin.com/in/ashokvishwakarmaa/) &bull; [Twitter](https://twitter.com/_avishwakarma) &bull; [Medium](https://medium.com/@avishwakarma)