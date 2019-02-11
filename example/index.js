import grpc from 'grpc';

import dgraph from '../lib';

/**
 * dgraph.connect
 * 
 * Connect to dgraph instance
 * 
 * @param {objact} {
 *  host: 'localhost', // dgraph database host default is localhost
 *  port: 9080, // dgrpah port default is 9080
 *  credentails: // gprc credential default grpc.credentials.createInsecure()
 * }
 */
dgraph.connect({
  /**
   * host
   * 
   * Dgraph host
   * 
   * @default 'localhost'
   */
  host: 'localhost',

  /**
   * port
   * 
   * Dgraph port
   * 
   * @default 9080
   */
  port: 9080,

  /**
   * credentails
   * 
   * Dgraph database grpc credentials
   * 
   * @default grpc.credentials.createInsecure()
   * 
   */
  credentails: grpc.credentials.createInsecure() 
});

/**
 * dgraph.Schema
 * 
 * Create a Dgraph Schema
 * 
 * @params {string} name // name of the schema
 * @params {object} schema // schema options
 * 
 * in the below code the schame will be generated a nd prefixed with name
 * 
 * user.name string @index(term)
 */
const UserSchema = new dgraph.Schema('user', {
  /**
   * Generated Dgraph Schema
   * 
   * user.name string @index(term) .
   */
  name: {
    type: dgraph.Types.STRING,
    index: true,
    token: {
      term: true
    }
  },

  /**
   * Generated Dgraph Schema
   * 
   * user.email string @index(excat) @upsert .
   */
  email: {
    type: dgraph.Types.STRING,
    index: true,
    upsert: true, // for unique
    token: {
      exact: true
    }
  },
  /**
   * Generated Dgraph Schema
   * 
   * user.bio string .
   */
  bio: dgraph.Types.STRING,

  /**
   * Generated Dgraph Schema
   * 
   * user.friend uid @count @reverse
   */
  friend: {
    type: dgraph.Types.UID,
    model: 'user',
    count: true,
    reverse: true
  }
});

/**
 * dgraph.model
 * 
 * Generate the Dgraph model
 */
const User = dgraph.model(UserSchema);

/**
 * @example
 * 
 * User.has(field_name: String, options);
 * 
 * User.eq(field_name: String, value: String, options);
 * 
 * User.uid(uid_value: String | String[], options);
 * 
 * User.allofterms(field: String, value: String, options);
 * 
 * User.anyofterms(field: String, value: String, options);
 * 
 * User.anyoftext(field: String, value: String, options);
 * 
 * User.alloftext(field: String, value: String, options);
 * 
 * User.regexp(field: String, regex: String, options);
 * 
 * User.near(field: String, value = {
 *  latitude: float,
 *  longitude: float
 *  distance: number
 * }, options);
 * 
 * User.contains(field: String, value = {
 *  latitude: float,
 *  longitude: float
 * }, options);
 */