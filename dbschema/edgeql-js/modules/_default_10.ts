// GENERATED by @edgedb/generate v0.4.1

import * as $ from "../reflection";
import * as _ from "../imports";
import type * as _default from "./default";
export type $current_userλShape = $.typeutil.flatten<_default.$UserλShape & {
}>;
type $current_user = $.ObjectType<"__default::current_user", $current_userλShape, null, [
  ..._default.$User['__exclusives__'],
]>;
const $current_user = $.makeType<$current_user>(_.spec, "3a09729e-2824-11ef-b1ba-a5a9dbd54405", _.syntax.literal);

const current_user: $.$expr_PathNode<$.TypeSet<$current_user, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($current_user, $.Cardinality.Many), null);



export { $current_user, current_user };

type __defaultExports = {
  "current_user": typeof current_user
};
const __defaultExports: __defaultExports = {
  "current_user": current_user
};
export default __defaultExports;
