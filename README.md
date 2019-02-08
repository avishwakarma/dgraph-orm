# DgraphORM
An ORM for Dgraph (in development)

## What its all about

DgraphORM is a package to simplify the schema creation for Dgraph similar to Mongoose, Sequilize.

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
    token: {
      exact: true,
      upsert: true // for unique
    }
  },
  bio: dgraph.Types.STRING
});

const User = dgraph.model(UserSchema);

User.query({
  query: '', // Dgraph Query string,
  variables: {} // Query variables
});
```

## Types
DgraphORM suports all the types supported in Dgraph

```javascript

import dgraph from 'dgraph-orm';

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
