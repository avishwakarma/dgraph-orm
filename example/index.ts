import grpc from 'grpc';

import dgraph from '../src';

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
  credentails: grpc.credentials.createInsecure(),

  /**
   * debug
   * 
   * set debug mode
   * 
   * @default false
   */
  debug: false
});

/**
 * logging
 * 
 * Set your own logger Function
 */
dgraph.logging(console.log);

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
   * user.name string @index(term, trigram) .
   */
  name: {
    type: dgraph.Types.STRING,
    index: true,
    lang: true,
    token: {
      term: true,
      trigram: true
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
   * GeneratedDgraph schema
   * user.age int @index(int)
   */
  age: {
    type: dgraph.Types.INT,
    index: true
  },

  /**
   * Generated Dgraph Schema
   * 
   * user.friend uid @count @reverse
   */
  friend: {
    type: dgraph.Types.UID,
    model: 'user',
    count: true
  },
  avatar: {
    type: dgraph.Types.UID,
    model: 'media',
    replace: true
  }
});

/**
 * dgraph.model
 * 
 * Generate the Dgraph model
 */
const User = dgraph.model(UserSchema);

const PostSchema = new dgraph.Schema('post', {
  title: dgraph.Types.STRING,
  content: dgraph.Types.STRING,
  author: {
    type: dgraph.Types.UID,
    model: 'user',
    replace: true
  }
});

const Post = dgraph.model(PostSchema);

const MediaSchema = new dgraph.Schema('media', {
  type: dgraph.Types.STRING,
  src: dgraph.Types.STRING
});

const Media = dgraph.model(MediaSchema);

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
  //   name: 'Someone',
  //   email: 'someone@gmail.com',
  //   bio: 'Performance and load tester',
  //   password: 'p@ssw0rd'
  // });

  // await User.delete(['0x2']);

  // await User.update({
  //   'name@fr': 'Parinita Sharma',
  // }, '0x1');

  // const pari = await User.uid('0x1', {
  //   first: 1
  // });
  // console.log(pari);

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
  //   friend: ['0x1', '0x2711']
  // }, '0x271c');

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

  // await User.update({
  //   age: 32
  // }, '0x271c');

  // const users = await User.has('email');

  // const posts = await Post.has('title');

  // console.log(users);
  // console.log(posts);

  // await Media.create({
  //   type: 'image',
  //   src: 'https://miro.medium.com/max/3150/1*RJuEp_08DylEspADBgsHoQ.jpeg'
  // });

  // const _isDeleted = await Media.has('src');

  // console.log(_isDeleted);

  // const user = await User.relation('0x2711', {
  //   field: 'friend',
  //   attributes: {
  //     friend: ['uid', 'name']
  //   }
  // });

  // console.log(user);

  // await Post.delete({
  //   author: '0x1'
  // }, '0xc351');

  // await Post.update({
  //   author: '0x1'
  // }, '0x9c42');

  // const post = await Post.create({
  //   title: 'A new sample post',
  //   content: '<p>Sample content</p>',
  //   author: '0x1'
  // })

  // console.log(post);

  // await User.delete({
  //   name: null
  // }, '0xea63');

})();