import { MethodsType } from "../types";

const eq: string = 'eq';

const uid: string = 'uid';

const allofterms: string = 'allofterms';

const anyofterms: string = 'anyofterms';

const regexp: string = 'regexp';

const anyoftext: string = 'anyoftext';

const alloftext: string = 'alloftext';

const has: string = 'has';

const near: string = 'near';

const contains: string = 'contains';

const Methods: MethodsType = {
  eq,
  uid,
  allofterms,
  anyofterms,
  regexp,
  anyoftext,
  alloftext,
  has,
  near,
  contains
}
export default Methods;