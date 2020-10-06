# dgraph-orm
Simplified schema creation, queries and mutations for Dgraph.

## Installation

```
npm install dgraph-orm
```

Depending on the version of Dgraph that you are connecting to, you will have to
use a different version.

| Dgraph version | dgraph-orm version |
| :------------: | :----------------: |
|     1.0.X      |      _1.X.Y_       |
|     1.1.X      |      _2.X.Y_       |

Note: Only API breakage from _v1.X.Y_ to _v2.X.Y_ is in dependency -`dgraph-js`.
Function `DgraphClient.newTxn().mutate()` returns a `messages.Assigned`
type in _v1.X_ but a `messages.Response` type in _v2.X_.

## Full Documentation

https://avishwakarma.github.io/dgraph-orm

## Your first schema and model

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

For the full documentation please visit the below link

https://ashokvishwakarma.github.io/dgraph-orm


## Futute releases

* Other geo queries within, intersects
* Group by
* Aggregation


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
