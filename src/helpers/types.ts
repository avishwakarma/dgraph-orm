import { TypesType } from "../types";

/**
 * INT
 * 
 * dgraph int type
 */
const INT: string = 'int';

/**
 * FLOAT
 * 
 * dgraph float type
 */
const FLOAT: string = 'float';

/**
 * STRING
 * 
 * dgraph string type
 */
const STRING: string = 'string';

/**
 * BOOL
 * 
 * dgraph bool type
 */
const BOOL: string = 'bool';

/**
 * DATETIME
 * 
 * dgraph datetime type
 */
const DATETIME: string = 'datetime';

/**
 * GEO
 * 
 * dgraph geo type
 */
const GEO: string = 'geo';

/**
 * PASSWORD
 * 
 * dgraph password type
 */
const PASSWORD: string = 'password';

/**
 * UID
 * 
 * dgraph uid type
 */
const UID: string = 'uid';

const Types: TypesType = {
  INT,
  FLOAT,
  STRING,
  BOOL,
  DATETIME,
  GEO,
  PASSWORD,
  UID
}

export default Types;