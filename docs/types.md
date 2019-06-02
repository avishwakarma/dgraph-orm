# Types

For TypeScript uses

## ConnectionConfig

The `ConnectionConfig` type

```javascript
interface ConnectionConfig {
  host?: string
  port?: number
  debug?: boolean
  credentails?: ChannelCredentials // from grpc
}
```

## Token

The `Token` type

```javascript
interface Token {
  term?: boolean
  trigram?: boolean
  fulltext?: boolean
  exact?: boolean
  hash?: boolean
}
```

## FieldProps

The `FieldProps` type

```javascript
interface FieldProps {
  type: string
  index?: boolean
  token?: string | Token
  unique?: boolean
  list?: boolean
  count?: Boolean
  lang?: boolean
  model?: string
  reverse?: boolean
}
```

## QueryParams

The `QueryParams` type

```javascript
interface QueryParams {
  query: string
  variables: {
    [key: string]: any
  }
}
```

## SchemaFields

The `SchemaFields` type

```javascript
interface SchemaFields {
  [key: string]: string | FieldProps
}
```

## TypesType

The `TypesType` type

```javascript
interface TypesType {
  INT: string
  FLOAT: string
  STRING: string
  BOOL: string
  DATETIME: string
  GEO: string
  PASSWORD: string
  UID: string
}
```

## MethodsType

The `MethodsType` type

```javascript
interface MethodsType {
  eq: string
  uid: string
  allofterms: string
  anyofterms: string
  regexp: string
  anyoftext: string
  alloftext: string
  has: string
  near: string
  contains: string
}
```

## Filter

The `Filter` type

```javascript
interface Filter {
  [key: string]: any
  $or?: any
  $and?: any
}
```

## Include

The `Include` type

```javascript
interface Include {
  [key: string]: any
  as?: string
  include?: Include
  filter?: Filter,
  attributes?: Array<string>
  order?: Array<any>
  first?: number
  offset?: number
  after?: string
}
```

## Params

The `Params` type

```javascript
interface Params {
  include?: Include
  filter?: Filter,
  attributes?: Array<string>
  order?: Array<any>
  first?: number
  offset?: number
  after?: string
}
```