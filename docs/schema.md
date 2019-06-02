The complete `dgraph-orm` guide on Schema

## Types
`dgraph-orm` suports all the types from Dgraph scaler and UID

### Scaler Type
For all triples with a predicate of scalar types the object is a literal.

|dgraph-orm|Dgraph Schema Type|Uses|
|:---|:---|:---|
|`dgraph.Types.INT`|`int`|to stores integer values in 64 bit format|
|`dgraph.Types.STRING`|`string`|to stores string values|
|`dgraph.Types.FLOAT`|`float`|to store floating points|
|`dgraph.Types.BOOL`|`bool`| to store boolean values|
|`dgraph.Types.DATETIME`|`dateTime`|to store date and time in RFC3339 format|
|`dgraph.Types.GEO`|`geo`|to store geo cordinates in go-gem format|
|`dgraph.Types.PASSWORD`|`password`|to store password in encrypted format|

*Dgraph supports date and time formats for dateTime scalar type only if they are RFC 3339 compatible which is different from ISO 8601(as defined in the RDF spec). You should convert your values to RFC 3339 format before sending them to Dgraph.*

### UID Type
The `uid` type denotes a node-node edge; internally each node is represented as a `uint64` id.

|dgraph-orm|Dgraph Schema Type|Uses|
|:---|:---|:---|
|`dgraph.Types.UID`|`uid`|to stores integer values in 64 bit format|

## Defining Schema
`dgraph-orm` schema definition is very similar to mongoose ORM

```javascript
import { Schema } from 'dgraph-orm';

/**
 * Schema
 * 
 * @param name {string}
 * @param fields {SchemaFields}
 * @returns Schema 
 */
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
```

## Schema Fields

`dgraph-orm` supports all the indexes and toknizers available in Dgraph.

*`upsert` requires `index` property*

*`count` requires `list` property*

### INT

Supports `list`, `count`, `index` and `upsert` properties.

```javascript
import { Schema, Types } from 'dgraph-orm';

const SampleSchema = new Schema('sample', {
  phone: {
    type: Types.INT,
    list: true,
    count: true,
    index: true,
    upsert: true
  }
})
```

### String
Supports `list`, `count`, `lang`, `index`, `upsert`, `token`, `unique` properies and `exact`, `hash`, `term`, `fulltext`, `trigram` tokenizers.

*`exact` and `hash` tokenizers should not be used along side `term` tokenizers.*

*`lang` can be used to define values with language*

```javascript
import {Schema, Types} from 'dgraph-orm';

const SampleSchema = new Schema('sample', {
  email: {
    type: Types.STRING,
    unique: true,
    count: true,
    index: true,
    upsert: true,
    token: {
      exact: true,
      fulltext: true,
      trigram: true
    }
  }
});
```

### FLOAT

Supports `list`, `count`, `index` and `upsert` properties.

```javascript
import { Schema, Types } from 'dgraph-orm';

const SampleSchema = new Schema('sample', {
  price: {
    type: Types.FLOAT,
    list: true,
    count: true,
    index: true,
    upsert: true
  }
})
```

### BOOL

Supports `list`, `count`, `index` and `upsert` properties.

```javascript
import { Schema, Types } from 'dgraph-orm';

const SampleSchema = new Schema('sample', {
  isActive: {
    type: Types.BOOL,
    list: true,
    count: true,
    index: true,
    upsert: true
  }
})
```

### DATETIME

Supports `list`, `count`, `index`, `upsert` and `token` properties with anyone tokenizer from `year`, `month`, `day`, `hour`.

```javascript
import { Schema, Types } from 'dgraph-orm';

const SampleSchema = new Schema('sample', {
  createdAt: {
    type: Types.DATETIME,
    list: true,
    count: true,
    index: true,
    upsert: true,
    token: 'day'
  }
})
```

### GEO

Supports `list`, `count`, `index` and `upsert` properties.

```javascript
import { Schema, Types } from 'dgraph-orm';

const SampleSchema = new Schema('sample', {
  geo: {
    type: Types.BOOL,
    list: true,
    count: true,
    index: true,
    upsert: true
  }
})
```

### PASSWORD

Does not supports any properties.

```javascript
import { Schema, Types } from 'dgraph-orm';

const SampleSchema = new Schema('sample', {
  password: Types.PASSWORD
})
```

### UID
Supports `count` and `reverse` properties

```javascript

import {Schema, Types} from 'dgraph-orm';

const SampleSchema = new Schema('sample', {
  friend: {
    type: Types.UID,
    count: true,
    reverse: true,
    model: 'user' // related model name
  }
})
```
