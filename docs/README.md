# dgraph-orm
Simplified schema creation, queries and mutation for Dgraph.

## Install

```javascript
npm install dgraph-orm
```

## Define schema

```javascript
import {Schema, model} from 'dgraph-orm';

const UserSchema = new Schema('user', {
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
const User = model(UserSchema);
```

## Use model

```javascript
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
## Author

![my_pic](https://avatars1.githubusercontent.com/u/389185?s=100&v=1)

[](https://avatars1.githubusercontent.com/u/389185?s=460&v=4)
### Ashok Vishwakarma

[LinkedIn](https://www.linkedin.com/in/ashokvishwakarmaa/) &bull; [Twitter](https://twitter.com/_avishwakarma) &bull; [Medium](https://medium.com/@avishwakarma)