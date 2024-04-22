// GENERATED by @edgedb/generate v0.4.1

import * as $ from "../reflection";
import * as _ from "../imports";
import type * as _std from "./std";
import type * as _auth from "./ext/auth";
export type $AllowBareDDL = {
  "AlwaysAllow": $.$expr_Literal<$AllowBareDDL>;
  "NeverAllow": $.$expr_Literal<$AllowBareDDL>;
} & $.EnumType<"cfg::AllowBareDDL", ["AlwaysAllow", "NeverAllow"]>;
const AllowBareDDL: $AllowBareDDL = $.makeType<$AllowBareDDL>(_.spec, "50264e27-859e-5d2b-a589-ebb3d8ba4d8c", _.syntax.literal);

export type $ConnectionTransport = {
  "TCP": $.$expr_Literal<$ConnectionTransport>;
  "TCP_PG": $.$expr_Literal<$ConnectionTransport>;
  "HTTP": $.$expr_Literal<$ConnectionTransport>;
  "SIMPLE_HTTP": $.$expr_Literal<$ConnectionTransport>;
  "HTTP_METRICS": $.$expr_Literal<$ConnectionTransport>;
  "HTTP_HEALTH": $.$expr_Literal<$ConnectionTransport>;
} & $.EnumType<"cfg::ConnectionTransport", ["TCP", "TCP_PG", "HTTP", "SIMPLE_HTTP", "HTTP_METRICS", "HTTP_HEALTH"]>;
const ConnectionTransport: $ConnectionTransport = $.makeType<$ConnectionTransport>(_.spec, "1adbf789-39c3-5070-bc17-776f94d59e46", _.syntax.literal);

export type $QueryCacheMode = {
  "InMemory": $.$expr_Literal<$QueryCacheMode>;
  "RegInline": $.$expr_Literal<$QueryCacheMode>;
  "PgFunc": $.$expr_Literal<$QueryCacheMode>;
  "Default": $.$expr_Literal<$QueryCacheMode>;
} & $.EnumType<"cfg::QueryCacheMode", ["InMemory", "RegInline", "PgFunc", "Default"]>;
const QueryCacheMode: $QueryCacheMode = $.makeType<$QueryCacheMode>(_.spec, "7cb23cda-17b8-575c-9561-05e2e9351897", _.syntax.literal);

export type $memory = $.ScalarType<"cfg::memory", _.edgedb.ConfigMemory>;
const memory: $.scalarTypeWithConstructor<$memory, string> = $.makeType<$.scalarTypeWithConstructor<$memory, string>>(_.spec, "00000000-0000-0000-0000-000000000130", _.syntax.literal);

export type $ConfigObjectλShape = $.typeutil.flatten<_std.$BaseObjectλShape & {
}>;
type $ConfigObject = $.ObjectType<"cfg::ConfigObject", $ConfigObjectλShape, null, [
  ..._std.$BaseObject['__exclusives__'],
]>;
const $ConfigObject = $.makeType<$ConfigObject>(_.spec, "d408002f-3891-5b9a-b19c-23589a88998b", _.syntax.literal);

const ConfigObject: $.$expr_PathNode<$.TypeSet<$ConfigObject, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($ConfigObject, $.Cardinality.Many), null);

export type $AbstractConfigλShape = $.typeutil.flatten<$ConfigObjectλShape & {
  "extensions": $.LinkDesc<$ExtensionConfig, $.Cardinality.Many, {}, false, true,  false, false>;
  "session_idle_timeout": $.PropertyDesc<_std.$duration, $.Cardinality.One, false, false, false, true>;
  "session_idle_transaction_timeout": $.PropertyDesc<_std.$duration, $.Cardinality.One, false, false, false, true>;
  "query_execution_timeout": $.PropertyDesc<_std.$duration, $.Cardinality.One, false, false, false, false>;
  "listen_port": $.PropertyDesc<_std.$int32, $.Cardinality.One, false, false, false, true>;
  "listen_addresses": $.PropertyDesc<_std.$str, $.Cardinality.Many, false, false, false, false>;
  "auth": $.LinkDesc<$Auth, $.Cardinality.Many, {}, false, false,  false, false>;
  "allow_dml_in_functions": $.PropertyDesc<_std.$bool, $.Cardinality.AtMostOne, false, false, false, true>;
  "allow_bare_ddl": $.PropertyDesc<$AllowBareDDL, $.Cardinality.AtMostOne, false, false, false, true>;
  "apply_access_policies": $.PropertyDesc<_std.$bool, $.Cardinality.AtMostOne, false, false, false, true>;
  "allow_user_specified_id": $.PropertyDesc<_std.$bool, $.Cardinality.AtMostOne, false, false, false, true>;
  "cors_allow_origins": $.PropertyDesc<_std.$str, $.Cardinality.Many, false, false, false, false>;
  "auto_rebuild_query_cache": $.PropertyDesc<_std.$bool, $.Cardinality.AtMostOne, false, false, false, true>;
  "query_cache_mode": $.PropertyDesc<$QueryCacheMode, $.Cardinality.AtMostOne, false, false, false, true>;
  "shared_buffers": $.PropertyDesc<$memory, $.Cardinality.AtMostOne, false, false, false, false>;
  "query_work_mem": $.PropertyDesc<$memory, $.Cardinality.AtMostOne, false, false, false, false>;
  "maintenance_work_mem": $.PropertyDesc<$memory, $.Cardinality.AtMostOne, false, false, false, false>;
  "effective_cache_size": $.PropertyDesc<$memory, $.Cardinality.AtMostOne, false, false, false, false>;
  "effective_io_concurrency": $.PropertyDesc<_std.$int64, $.Cardinality.AtMostOne, false, false, false, false>;
  "default_statistics_target": $.PropertyDesc<_std.$int64, $.Cardinality.AtMostOne, false, false, false, false>;
  "force_database_error": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, true>;
  "_pg_prepared_statement_cache_size": $.PropertyDesc<_std.$int16, $.Cardinality.One, false, false, false, true>;
  "<cfg[is cfg::ExtensionConfig]": $.LinkDesc<$ExtensionConfig, $.Cardinality.AtMostOne, {}, true, false,  false, false>;
  "<cfg[is ext::auth::AuthConfig]": $.LinkDesc<_auth.$AuthConfig, $.Cardinality.AtMostOne, {}, true, false,  false, false>;
  "<cfg[is ext::auth::SMTPConfig]": $.LinkDesc<_auth.$SMTPConfig, $.Cardinality.AtMostOne, {}, true, false,  false, false>;
  "<cfg": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $AbstractConfig = $.ObjectType<"cfg::AbstractConfig", $AbstractConfigλShape, null, [
  ...$ConfigObject['__exclusives__'],
]>;
const $AbstractConfig = $.makeType<$AbstractConfig>(_.spec, "8b66e734-a01e-5638-a812-359e0d005a37", _.syntax.literal);

const AbstractConfig: $.$expr_PathNode<$.TypeSet<$AbstractConfig, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($AbstractConfig, $.Cardinality.Many), null);

export type $AuthλShape = $.typeutil.flatten<$ConfigObjectλShape & {
  "priority": $.PropertyDesc<_std.$int64, $.Cardinality.One, true, false, true, false>;
  "user": $.PropertyDesc<_std.$str, $.Cardinality.Many, false, false, true, true>;
  "method": $.LinkDesc<$AuthMethod, $.Cardinality.AtMostOne, {}, true, false,  true, false>;
  "comment": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, true, false>;
  "<auth[is cfg::AbstractConfig]": $.LinkDesc<$AbstractConfig, $.Cardinality.Many, {}, false, false,  false, false>;
  "<auth[is cfg::Config]": $.LinkDesc<$Config, $.Cardinality.Many, {}, false, false,  false, false>;
  "<auth[is cfg::InstanceConfig]": $.LinkDesc<$InstanceConfig, $.Cardinality.Many, {}, false, false,  false, false>;
  "<auth[is cfg::DatabaseConfig]": $.LinkDesc<$DatabaseConfig, $.Cardinality.Many, {}, false, false,  false, false>;
  "<auth[is cfg::BranchConfig]": $.LinkDesc<$BranchConfig, $.Cardinality.Many, {}, false, false,  false, false>;
  "<auth": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $Auth = $.ObjectType<"cfg::Auth", $AuthλShape, null, [
  ...$ConfigObject['__exclusives__'],
  {priority: {__element__: _std.$int64, __cardinality__: $.Cardinality.One | $.Cardinality.AtMostOne },},
  {method: {__element__: $AuthMethod, __cardinality__: $.Cardinality.One | $.Cardinality.AtMostOne },},
]>;
const $Auth = $.makeType<$Auth>(_.spec, "a2ba7516-d398-5ec2-b25e-221b2f7b9e87", _.syntax.literal);

const Auth: $.$expr_PathNode<$.TypeSet<$Auth, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($Auth, $.Cardinality.Many), null);

export type $AuthMethodλShape = $.typeutil.flatten<$ConfigObjectλShape & {
  "transports": $.PropertyDesc<$ConnectionTransport, $.Cardinality.Many, false, false, true, false>;
  "<method[is cfg::Auth]": $.LinkDesc<$Auth, $.Cardinality.AtMostOne, {}, true, false,  false, false>;
  "<method": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $AuthMethod = $.ObjectType<"cfg::AuthMethod", $AuthMethodλShape, null, [
  ...$ConfigObject['__exclusives__'],
]>;
const $AuthMethod = $.makeType<$AuthMethod>(_.spec, "128fcc80-bf32-5bdc-abac-09cf1532a7c1", _.syntax.literal);

const AuthMethod: $.$expr_PathNode<$.TypeSet<$AuthMethod, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($AuthMethod, $.Cardinality.Many), null);

export type $DatabaseConfigλShape = $.typeutil.flatten<$AbstractConfigλShape & {
}>;
type $DatabaseConfig = $.ObjectType<"cfg::DatabaseConfig", $DatabaseConfigλShape, null, [
  ...$AbstractConfig['__exclusives__'],
]>;
const $DatabaseConfig = $.makeType<$DatabaseConfig>(_.spec, "c046988e-25f8-55b8-8d94-9e2a13d7625f", _.syntax.literal);

const DatabaseConfig: $.$expr_PathNode<$.TypeSet<$DatabaseConfig, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($DatabaseConfig, $.Cardinality.Many), null);

export type $BranchConfigλShape = $.typeutil.flatten<$DatabaseConfigλShape & {
}>;
type $BranchConfig = $.ObjectType<"cfg::BranchConfig", $BranchConfigλShape, null, [
  ...$DatabaseConfig['__exclusives__'],
]>;
const $BranchConfig = $.makeType<$BranchConfig>(_.spec, "b8b6fefa-f0c7-5eea-9f2f-98a5222c7c5e", _.syntax.literal);

const BranchConfig: $.$expr_PathNode<$.TypeSet<$BranchConfig, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($BranchConfig, $.Cardinality.Many), null);

export type $ConfigλShape = $.typeutil.flatten<$AbstractConfigλShape & {
}>;
type $Config = $.ObjectType<"cfg::Config", $ConfigλShape, null, [
  ...$AbstractConfig['__exclusives__'],
]>;
const $Config = $.makeType<$Config>(_.spec, "363133b1-e993-50a0-94d3-aa0472b1a0a7", _.syntax.literal);

const Config: $.$expr_PathNode<$.TypeSet<$Config, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($Config, $.Cardinality.Many), null);

export type $ExtensionConfigλShape = $.typeutil.flatten<$ConfigObjectλShape & {
  "cfg": $.LinkDesc<$AbstractConfig, $.Cardinality.One, {}, true, false,  false, false>;
  "<extensions[is cfg::AbstractConfig]": $.LinkDesc<$AbstractConfig, $.Cardinality.Many, {}, false, false,  false, false>;
  "<extensions[is cfg::Config]": $.LinkDesc<$Config, $.Cardinality.Many, {}, false, false,  false, false>;
  "<extensions[is cfg::InstanceConfig]": $.LinkDesc<$InstanceConfig, $.Cardinality.Many, {}, false, false,  false, false>;
  "<extensions[is cfg::DatabaseConfig]": $.LinkDesc<$DatabaseConfig, $.Cardinality.Many, {}, false, false,  false, false>;
  "<extensions[is cfg::BranchConfig]": $.LinkDesc<$BranchConfig, $.Cardinality.Many, {}, false, false,  false, false>;
  "<extensions": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $ExtensionConfig = $.ObjectType<"cfg::ExtensionConfig", $ExtensionConfigλShape, null, [
  ...$ConfigObject['__exclusives__'],
  {cfg: {__element__: $AbstractConfig, __cardinality__: $.Cardinality.One | $.Cardinality.AtMostOne },},
]>;
const $ExtensionConfig = $.makeType<$ExtensionConfig>(_.spec, "89fb9b8b-d3b2-5075-9d1a-f5b116a0f188", _.syntax.literal);

const ExtensionConfig: $.$expr_PathNode<$.TypeSet<$ExtensionConfig, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($ExtensionConfig, $.Cardinality.Many), null);

export type $InstanceConfigλShape = $.typeutil.flatten<$AbstractConfigλShape & {
}>;
type $InstanceConfig = $.ObjectType<"cfg::InstanceConfig", $InstanceConfigλShape, null, [
  ...$AbstractConfig['__exclusives__'],
]>;
const $InstanceConfig = $.makeType<$InstanceConfig>(_.spec, "d9e9f342-7992-544c-b6af-459302121188", _.syntax.literal);

const InstanceConfig: $.$expr_PathNode<$.TypeSet<$InstanceConfig, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($InstanceConfig, $.Cardinality.Many), null);

export type $JWTλShape = $.typeutil.flatten<Omit<$AuthMethodλShape, "transports"> & {
  "transports": $.PropertyDesc<$ConnectionTransport, $.Cardinality.Many, false, false, true, true>;
}>;
type $JWT = $.ObjectType<"cfg::JWT", $JWTλShape, null, [
  ...$AuthMethod['__exclusives__'],
]>;
const $JWT = $.makeType<$JWT>(_.spec, "4e795376-37e8-5381-8ae4-d621c80bbc7b", _.syntax.literal);

const JWT: $.$expr_PathNode<$.TypeSet<$JWT, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($JWT, $.Cardinality.Many), null);

export type $PasswordλShape = $.typeutil.flatten<Omit<$AuthMethodλShape, "transports"> & {
  "transports": $.PropertyDesc<$ConnectionTransport, $.Cardinality.Many, false, false, true, true>;
}>;
type $Password = $.ObjectType<"cfg::Password", $PasswordλShape, null, [
  ...$AuthMethod['__exclusives__'],
]>;
const $Password = $.makeType<$Password>(_.spec, "9df8c566-c274-5d75-a948-2d901505d7de", _.syntax.literal);

const Password: $.$expr_PathNode<$.TypeSet<$Password, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($Password, $.Cardinality.Many), null);

export type $SCRAMλShape = $.typeutil.flatten<Omit<$AuthMethodλShape, "transports"> & {
  "transports": $.PropertyDesc<$ConnectionTransport, $.Cardinality.Many, false, false, true, true>;
}>;
type $SCRAM = $.ObjectType<"cfg::SCRAM", $SCRAMλShape, null, [
  ...$AuthMethod['__exclusives__'],
]>;
const $SCRAM = $.makeType<$SCRAM>(_.spec, "ca43bc46-6dd2-55fc-98dc-358978df0f24", _.syntax.literal);

const SCRAM: $.$expr_PathNode<$.TypeSet<$SCRAM, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($SCRAM, $.Cardinality.Many), null);

export type $TrustλShape = $.typeutil.flatten<$AuthMethodλShape & {
}>;
type $Trust = $.ObjectType<"cfg::Trust", $TrustλShape, null, [
  ...$AuthMethod['__exclusives__'],
]>;
const $Trust = $.makeType<$Trust>(_.spec, "7fc09ace-4af4-5d90-a9ab-94f9bb4cdb42", _.syntax.literal);

const Trust: $.$expr_PathNode<$.TypeSet<$Trust, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($Trust, $.Cardinality.Many), null);

export type $mTLSλShape = $.typeutil.flatten<Omit<$AuthMethodλShape, "transports"> & {
  "transports": $.PropertyDesc<$ConnectionTransport, $.Cardinality.Many, false, false, true, true>;
}>;
type $mTLS = $.ObjectType<"cfg::mTLS", $mTLSλShape, null, [
  ...$AuthMethod['__exclusives__'],
]>;
const $mTLS = $.makeType<$mTLS>(_.spec, "e96db572-9980-5ce1-8049-1561b3980d0e", _.syntax.literal);

const mTLS: $.$expr_PathNode<$.TypeSet<$mTLS, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($mTLS, $.Cardinality.Many), null);

type get_config_jsonλFuncExpr<
  NamedArgs extends {
    "sources"?: $.TypeSet<$.ArrayType<_std.$str>>,
    "max_source"?: _.castMaps.orScalarLiteral<$.TypeSet<_std.$str>>,
  },
> = $.$expr_Function<
  _std.$json, $.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<NamedArgs["sources"]>, $.cardutil.optionalParamCardinality<NamedArgs["max_source"]>>
>;
function get_config_json<
  NamedArgs extends {
    "sources"?: $.TypeSet<$.ArrayType<_std.$str>>,
    "max_source"?: _.castMaps.orScalarLiteral<$.TypeSet<_std.$str>>,
  },
>(
  namedArgs: NamedArgs,
): get_config_jsonλFuncExpr<NamedArgs>;
function get_config_json(...args: any[]) {
  const {returnType, cardinality, args: positionalArgs, namedArgs} = _.syntax.$resolveOverload('cfg::get_config_json', args, _.spec, [
    {args: [], namedArgs: {"sources": {typeId: "bb221d39-09f1-507e-8851-62075bb61823", optional: true, setoftype: false, variadic: false}, "max_source": {typeId: "00000000-0000-0000-0000-000000000101", optional: true, setoftype: false, variadic: false}}, returnTypeId: "00000000-0000-0000-0000-00000000010f"},
  ]);
  return _.syntax.$expressionify({
    __kind__: $.ExpressionKind.Function,
    __element__: returnType,
    __cardinality__: cardinality,
    __name__: "cfg::get_config_json",
    __args__: positionalArgs,
    __namedargs__: namedArgs,
  }) as any;
};



export { AllowBareDDL, ConnectionTransport, QueryCacheMode, memory, $ConfigObject, ConfigObject, $AbstractConfig, AbstractConfig, $Auth, Auth, $AuthMethod, AuthMethod, $DatabaseConfig, DatabaseConfig, $BranchConfig, BranchConfig, $Config, Config, $ExtensionConfig, ExtensionConfig, $InstanceConfig, InstanceConfig, $JWT, JWT, $Password, Password, $SCRAM, SCRAM, $Trust, Trust, $mTLS, mTLS };

type __defaultExports = {
  "AllowBareDDL": typeof AllowBareDDL;
  "ConnectionTransport": typeof ConnectionTransport;
  "QueryCacheMode": typeof QueryCacheMode;
  "memory": typeof memory;
  "ConfigObject": typeof ConfigObject;
  "AbstractConfig": typeof AbstractConfig;
  "Auth": typeof Auth;
  "AuthMethod": typeof AuthMethod;
  "DatabaseConfig": typeof DatabaseConfig;
  "BranchConfig": typeof BranchConfig;
  "Config": typeof Config;
  "ExtensionConfig": typeof ExtensionConfig;
  "InstanceConfig": typeof InstanceConfig;
  "JWT": typeof JWT;
  "Password": typeof Password;
  "SCRAM": typeof SCRAM;
  "Trust": typeof Trust;
  "mTLS": typeof mTLS;
  "get_config_json": typeof get_config_json
};
const __defaultExports: __defaultExports = {
  "AllowBareDDL": AllowBareDDL,
  "ConnectionTransport": ConnectionTransport,
  "QueryCacheMode": QueryCacheMode,
  "memory": memory,
  "ConfigObject": ConfigObject,
  "AbstractConfig": AbstractConfig,
  "Auth": Auth,
  "AuthMethod": AuthMethod,
  "DatabaseConfig": DatabaseConfig,
  "BranchConfig": BranchConfig,
  "Config": Config,
  "ExtensionConfig": ExtensionConfig,
  "InstanceConfig": InstanceConfig,
  "JWT": JWT,
  "Password": Password,
  "SCRAM": SCRAM,
  "Trust": Trust,
  "mTLS": mTLS,
  "get_config_json": get_config_json
};
export default __defaultExports;
