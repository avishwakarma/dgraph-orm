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
   * Generated Dgraph schema
   * 
   * user.password password .
   */
  password: dgraph.Types.PASSWORD,

  /**
   * Generated Dgraph Schema
   * 
   * user.email string @index(excat) .
   */
  email: {
    type: dgraph.Types.STRING,
    index: true,
    unique: true,
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

(async () => {
  // const user = await User.create({
  //   name: 'Rahul Singh',
  //   email: 'rahulsingh0818@gmail.com',
  //   bio: 'Performance and load tester',
  //   password: 'p@ssw0rd'
  // });

  // await User.update({
  //   name: 'Parinita Sharma',
  //   bio: 'Co Founder and COO, Impulsive Web Pvt. Ltd.'
  // }, {
  //   email: 'parinitashr413@gmail.com'
  // });

  // await User.update({
  //   name: 'Parinita Sharma',
  //   bio: 'Co Founder and COO, Impulsive Web Pvt. Ltd.'
  // }, '0x8');

  // await User.delete('0x8');

  // console.log(user);

  // const data = await User.has('name');

  // console.log(data);

  // const _check = await User.checkPassword('0x1', 'password', 'p@ssw0rd');

  // console.log(_check);

  // await User.update({
  //   friend: ['0x2711', '0x271c']
  // }, '0x1');

  // await User.delete({
  //   friend: ['0x271c', '0x2711']
  // }, '0x1');

  // const users = await User.has('name', {
  //   include: {
  //     friend: {
  //       as: 'friends'
  //     }
  //   }
  // });

  // await User.delete({
  //   name: null
  // }, ['0x271c', '0x2711']);

  const users = await User.has('email', {
    include: {
      friend: {
        as: 'friends'
      }
    }
  });

  console.log(users);
})();