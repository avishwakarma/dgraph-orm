`dgraph-orm` model

## Defining model

In `dgraph-orm` defining a model is very easy

```javascript
/**
 * model
 * 
 * @param schema {Schema}
 * @returns Model
 */
const Model = model(SampleSchema);
```

## Properties

The available properties in `dgraph-orm` model

### schema

Every `dgraph-orm` model contains its schema in it

```javascript
Model.schema // returns passed schema object
```

### connection

Every `dgraph-orm` model contains the connection object in it

```javascript
Model.connection // returns the connection object
```

## Methods

The available methods in `dgraph-orm` model

### query

Executes raw query

```javascript
/**
 * query
 * 
 * @param query {string}
 * @retuns Promise<any>
 */

const query = `
  user (func: has(user.email)) {
    uid
    name: user.name
    email: user.email
  }
`;
Model.query(query)
```

### queryWithVars

Executes raw query with variables

```javascript
/**
 * queryWithVars
 * 
 * @param param {QueryParams}
 * @retuns Promise<any>
 */

const query = `
  query test ($email: string) {
    test(func: eq(user.email, $email)) {
      uid
      name: user.name
      email: user.email
    }
  }
`;

const variables = {
  $email: 'akvlko@gmail.com'
}
Model.queryWithVars({
  query,
  variables
})
```

### create

Create data

```javascript
/**
 * create
 * 
 * @param param {any}
 * @retuns Promise<any>
 */
Model.create({
  name: 'Ashok',
  email: 'akvlko@gmail.com'
});
```

### update

Update data

```javascript
/**
 * update
 * 
 * @param param {any}
 * @param condition {string | any}
 * @retuns Promise<any>
 */
Model.update({
  name: 'Ashok Vishwakarma',
}, {
  email: 'akvlko@gmail.com'
});

// or using uid

Model.update({
  name: 'Ashok Vishwakarma',
}, '0x1');
```

### delete

Delete edges and values

```javascript
/**
 * delete
 * 
 * @param param {any}
 * @param condition {string | Array<string> | any}
 * @retuns Promise<any>
 */

// Delete edges and values of single model
Model.delete('0x1');

// Delete edges and values of mutliple model
Model.delete(['0x1', '0x2']);

// Delete edges
Model.delete({
  freind: ['0x2']
}, '0x1');

// Delete values
Model.delete({
  name: null,
  email: null
}, '0x1');

// Delete using condition
Model.delete({
  email: 'akvlko@gmail.com'
})
```

### checkPassword

To validate a password value on PASSWORD type field

*The `PASSWORD` type field stores data in encrypted format*

```javascript
/**
 * checkPassword
 * 
 * @param uid {string}
 * @param field {string}
 * @param password {string}
 * @retuns Promise<any>
 */
Model.checkPassword('0x1', 'password', 'p@ssw0rd');
```

### relation

The `realtion` root method to fetch the relationship data 

```javascript
/**
 * realtion
 * 
 * @param uid {string}
 * @param params {RelationParam}
 * 
 */

// Single relation default attributes ['uid']
Model.realtion('0x1', {
  field: 'friend'
});

// Multiple relation default attributes ['uid']
Model.realtion('0x1', {
  field: ['friend', 'location']
});

// With attributes
Model.realtion('0x1', {
  field: 'friend' // string | Array<string>
  attributes: {
    friend: ['uid', 'name']
  }
});
```

### has

The `has` root method of dgraph 

```javascript
/**
 * has
 * 
 * @param field {string}
 * @param params {Params}
 * @retuns Promise<any>
 */
Model.has('email');
```

### eq

The `eq` root method of dgraph 

```javascript
/**
 * eq
 * 
 * @param field {string}
 * @param value {string}
 * @param params {Params}
 * @retuns Promise<any>
 */

Model.eq('email', 'akvlko@gmail.com');
```

### uid

The `uid` root method of dgraph 

```javascript
/**
 * uid
 * 
 * @param field {string | Array<string>}
 * @param params {Params}
 * @retuns Promise<any>
 */

// for single uid
Model.uid('0x1');

// for multiple uid
Model.uid(['0x1', '0x2']);
```

### allofterms

The `allofterms` root method of dgraph 

```javascript
/**
 * allofterms
 * 
 * @param field {string}
 * @param value {string}
 * @param params {Params}
 * @retuns Promise<any>
 */

Model.allofterms('email', 'akvlko');
```

### anyofterms

The `anyofterms` root method of dgraph 

```javascript
/**
 * anyofterms
 * 
 * @param field {string}
 * @param value {string}
 * @param params {Params}
 * @retuns Promise<any>
 */

Model.anyofterms('email', 'akvlko');
```

### alloftext

The `alloftext` root method of dgraph 

```javascript
/**
 * alloftext
 * 
 * @param field {string}
 * @param value {string}
 * @param params {Params}
 * @retuns Promise<any>
 */

Model.alloftext('email', 'akvlko');
```

### anyoftext

The `anyoftext` root method of dgraph 

```javascript
/**
 * anyoftext
 * 
 * @param field {string}
 * @param value {string}
 * @param params {Params}
 * @retuns Promise<any>
 */

Model.anyoftext('email', 'akvlko');
```

### regexp

The `regexp` root method of dgraph 

```javascript
/**
 * regexp
 * 
 * @param field {string}
 * @param regex {RegExp}
 * @param params {Params}
 * @retuns Promise<any>
 */

Model.regexp('email', /^akvlko.*$/);
```

### near

The `near` root method of dgraph 

*Only with `GEO` type field*

```javascript
/**
 * near
 * 
 * @param field {string}
 * @param value {any}
 * @param params {Params}
 * @retuns Promise<any>
 */

Model.near('location', {
  latitude: 77.389001,
  longitude: 28.557416,
  distance: 1000 // in meters
});
```

### contains

The `contains` root method of dgraph 

*Only with `GEO` type field*

```javascript
/**
 * near
 * 
 * @param field {string}
 * @param value {any}
 * @param params {Params}
 * @retuns Promise<any>
 */

Model.contains('location', {
  latitude: 77.389001,
  longitude: 28.557416
});
```

## Params

Methods `has`, `eq`, `uid`, `allofterms`, `anyofterms`, `alloftext`, `anyoftext`, `regexp`, `near` and `contains` have a last parameter of `Param` type which can be used for follwings

### attributes

To determine the attributes to fetch from database

```javascript
/**
 * attributes
 * 
 * @type Array<string>
 */
Mode.has('email', {
  attributes: ['name', 'email', 'age']
});
```

### include

To fetch the related models

```javascript
/**
 * include
 * 
 * @type Include
 */
Mode.has('email', {
  include: {
    friend: {
      as: 'freinds',
      filter: {} // filter object
      attributes: ['name', 'age', 'email'],
      order: ['age', 'ASC']
    }
  }
});

// nested include
// Includes freinds of friends in the result

Mode.has('email', {
  include: {
    friend: {
      as: 'freinds',
      include: {
        freind: {
          as: 'freinds'
        }
      }
    }
  }
});
```

### filter

To filter the records

```javascript
/**
 * filter
 * 
 * @type Filter
 */

// using multiple fields in filter
// will use the AND condition
Model.has('email', {
  filter: {
    name: 'Ashok Vishwakarma',
    email: 'akvlko@gmail.com'
  }
})
```

#### or

OR condition between fields

```javascript
Model.has('email', {
  filter: {
    $or: {
      name: 'Ashok Vishwakarma',
      age: 25
    }
  }
})
```

#### and

AND conditon between fields

```javascript
Model.has('email', {
  filter: {
    name: 'Ashok Vishwakarma',
    age: 25
  }
})

// you use $and property as well

Model.has('email', {
  filter: {
    $and: {
      name: 'Ashok Vishwakarma',
      age: 25
    }
  }
})
```

#### equals

Equality check

```javascript
Model.has('email', {
  filter: {
    name: 'Ashok Vishwakarma'
  }
})
```

#### not equals

Inequality check

```javascript
Model.has('email', {
  filter: {
    name: {
      $ne: 'Ashok Vishwakarma'
    }
  }
})
```

#### le

Less than or equal to

```javascript
Model.has('email', {
  filter: {
    age: {
      $le: 25
    }
  }
})
```

#### lt

Less than

```javascript
Model.has('email', {
  filter: {
    age: {
      $lt: 25
    }
  }
})
```

#### ge

Greater than or equal to

```javascript
Model.has('email', {
  filter: {
    age: {
      $ge: 25
    }
  }
})
```

#### gt

Greater than

```javascript
Model.has('email', {
  filter: {
    age: {
      $gt: 25
    }
  }
})
```

#### uid_in

Filter by edges (relationships)

```javascript
// One UID
Model.has('email', {
  filter: {
    friend: {
      $uid_in: '0x1'
    }
  }
});

// multiple UIDs
Model.has('email', {
  filter: {
    friend: {
      $uid_in: ['0x1', '0x2']
    }
  }
})
```

### Order

Sort the records

```javascript
/**
 * order
 * 
 * @type Array<any>
 */

// Assending
Model.has('email', {
  order: ['email', 'ASC']
})

// Desending
Model.has('email', {
  order: ['email', 'DESC']
})

// Multiple order
Model.has('email', {
  order: [['email', 'DESC'], ['name', 'ASC']]
})
```

### Pagination

Pagination allows returning only a portion, rather than the whole, result set. This can be useful for top-k style queries as well as to reduce the size of the result set for client side processing or to allow paged access to results.

*Without order specified, the results are sorted by `uid`, which is assigned randomly. So the ordering, while deterministic, might not be what you expected.*

#### first

For positive `N`, first: `N` retrieves the first `N` results, by sorted or `UID` order.

```javascript
/**
 * first
 * 
 * @type number
 */

// first 5 records
Model.has('email', {
  first: 5
})
```

#### offset

With offset: `N` the first `N` results are not returned. Used in combination with first, first: `M`, offset: `N` skips over `N` results and returns the following `M`.

```javascript
/**
 * offset
 * 
 * @type number
 */

// 5 records after sckiping first 4 records
Model.has('email', {
  first: 5,
  offset: 4
})
```

#### after

Another way to get results after skipping over some results is to use the default UID ordering and skip directly past a node specified by UID

```javascript
/**
 * after
 * 
 * @type string
 */

// 5 records after uid '0x1'
Model.has('email', {
  first: 5,
  after: '0x1'
})
```
