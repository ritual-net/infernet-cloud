// GENERATED by @edgedb/generate v0.4.1

import * as $ from "../../reflection";
import * as _ from "../../imports";
import type * as _cfg from "../cfg";
import type * as _std from "../std";
import type * as _default from "../default";
import type * as __default_10 from "../_default_10";
export type $FlowType = {
  "PKCE": $.$expr_Literal<$FlowType>;
  "Implicit": $.$expr_Literal<$FlowType>;
} & $.EnumType<"ext::auth::FlowType", ["PKCE", "Implicit"]>;
const FlowType: $FlowType = $.makeType<$FlowType>(_.spec, "f1f61c43-08ca-5ae0-870d-ace07304ca8f", _.syntax.literal);

export type $JWTAlgo = {
  "RS256": $.$expr_Literal<$JWTAlgo>;
  "HS256": $.$expr_Literal<$JWTAlgo>;
} & $.EnumType<"ext::auth::JWTAlgo", ["RS256", "HS256"]>;
const JWTAlgo: $JWTAlgo = $.makeType<$JWTAlgo>(_.spec, "14113b4e-86a8-5b08-8ee9-9cfc1c7dc1e8", _.syntax.literal);

export type $SMTPSecurity = {
  "PlainText": $.$expr_Literal<$SMTPSecurity>;
  "TLS": $.$expr_Literal<$SMTPSecurity>;
  "STARTTLS": $.$expr_Literal<$SMTPSecurity>;
  "STARTTLSOrPlainText": $.$expr_Literal<$SMTPSecurity>;
} & $.EnumType<"ext::auth::SMTPSecurity", ["PlainText", "TLS", "STARTTLS", "STARTTLSOrPlainText"]>;
const SMTPSecurity: $SMTPSecurity = $.makeType<$SMTPSecurity>(_.spec, "8a5e3474-0330-56ed-982c-48a4c4921b09", _.syntax.literal);

export type $ProviderConfigλShape = $.typeutil.flatten<_cfg.$ConfigObjectλShape & {
  "name": $.PropertyDesc<_std.$str, $.Cardinality.One, true, false, true, false>;
  "<providers[is ext::auth::AuthConfig]": $.LinkDesc<$AuthConfig, $.Cardinality.Many, {}, false, false,  false, false>;
  "<providers": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $ProviderConfig = $.ObjectType<"ext::auth::ProviderConfig", $ProviderConfigλShape, null, [
  ..._cfg.$ConfigObject['__exclusives__'],
  {name: {__element__: _std.$str, __cardinality__: $.Cardinality.One | $.Cardinality.AtMostOne },},
]>;
const $ProviderConfig = $.makeType<$ProviderConfig>(_.spec, "594f22fc-bbb1-5588-b7d1-ed498df6ccec", _.syntax.literal);

const ProviderConfig: $.$expr_PathNode<$.TypeSet<$ProviderConfig, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($ProviderConfig, $.Cardinality.Many), null);

export type $OAuthProviderConfigλShape = $.typeutil.flatten<Omit<$ProviderConfigλShape, "name"> & {
  "name": $.PropertyDesc<_std.$str, $.Cardinality.One, true, false, true, false>;
  "secret": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, true, false>;
  "client_id": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, true, false>;
  "display_name": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, true, false>;
  "additional_scope": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, true, false>;
}>;
type $OAuthProviderConfig = $.ObjectType<"ext::auth::OAuthProviderConfig", $OAuthProviderConfigλShape, null, [
  ...$ProviderConfig['__exclusives__'],
  {name: {__element__: _std.$str, __cardinality__: $.Cardinality.One | $.Cardinality.AtMostOne },},
]>;
const $OAuthProviderConfig = $.makeType<$OAuthProviderConfig>(_.spec, "848d522a-6d9c-5317-b807-7e9b926f0a66", _.syntax.literal);

const OAuthProviderConfig: $.$expr_PathNode<$.TypeSet<$OAuthProviderConfig, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($OAuthProviderConfig, $.Cardinality.Many), null);

export type $AppleOAuthProviderλShape = $.typeutil.flatten<Omit<$OAuthProviderConfigλShape, "name" | "display_name"> & {
  "name": $.PropertyDesc<_std.$str, $.Cardinality.One, true, false, true, true>;
  "display_name": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, true, true>;
}>;
type $AppleOAuthProvider = $.ObjectType<"ext::auth::AppleOAuthProvider", $AppleOAuthProviderλShape, null, [
  ...$OAuthProviderConfig['__exclusives__'],
  {name: {__element__: _std.$str, __cardinality__: $.Cardinality.One | $.Cardinality.AtMostOne },},
]>;
const $AppleOAuthProvider = $.makeType<$AppleOAuthProvider>(_.spec, "2059ae30-cb44-51d0-b016-920ef0a691b4", _.syntax.literal);

const AppleOAuthProvider: $.$expr_PathNode<$.TypeSet<$AppleOAuthProvider, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($AppleOAuthProvider, $.Cardinality.Many), null);

export type $AuditableλShape = $.typeutil.flatten<_std.$Object_8ce8c71ee4fa5f73840c22d7eaa58588λShape & {
  "created_at": $.PropertyDesc<_std.$datetime, $.Cardinality.One, false, false, true, true>;
  "modified_at": $.PropertyDesc<_std.$datetime, $.Cardinality.One, false, false, false, false>;
}>;
type $Auditable = $.ObjectType<"ext::auth::Auditable", $AuditableλShape, null, [
  ..._std.$Object_8ce8c71ee4fa5f73840c22d7eaa58588['__exclusives__'],
]>;
const $Auditable = $.makeType<$Auditable>(_.spec, "4315a540-bc94-58fa-8e95-a5816e134135", _.syntax.literal);

const Auditable: $.$expr_PathNode<$.TypeSet<$Auditable, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($Auditable, $.Cardinality.Many), null);

export type $AuthConfigλShape = $.typeutil.flatten<_cfg.$ExtensionConfigλShape & {
  "providers": $.LinkDesc<$ProviderConfig, $.Cardinality.Many, {}, false, false,  false, false>;
  "ui": $.LinkDesc<$UIConfig, $.Cardinality.AtMostOne, {}, false, false,  false, false>;
  "auth_signing_key": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, false>;
  "token_time_to_live": $.PropertyDesc<_std.$duration, $.Cardinality.AtMostOne, false, false, false, true>;
  "allowed_redirect_urls": $.PropertyDesc<_std.$str, $.Cardinality.Many, false, false, false, false>;
}>;
type $AuthConfig = $.ObjectType<"ext::auth::AuthConfig", $AuthConfigλShape, null, [
  ..._cfg.$ExtensionConfig['__exclusives__'],
]>;
const $AuthConfig = $.makeType<$AuthConfig>(_.spec, "3e1bc003-0fc3-5ff8-9064-26627924dca5", _.syntax.literal);

const AuthConfig: $.$expr_PathNode<$.TypeSet<$AuthConfig, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($AuthConfig, $.Cardinality.Many), null);

export type $AzureOAuthProviderλShape = $.typeutil.flatten<Omit<$OAuthProviderConfigλShape, "name" | "display_name"> & {
  "name": $.PropertyDesc<_std.$str, $.Cardinality.One, true, false, true, true>;
  "display_name": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, true, true>;
}>;
type $AzureOAuthProvider = $.ObjectType<"ext::auth::AzureOAuthProvider", $AzureOAuthProviderλShape, null, [
  ...$OAuthProviderConfig['__exclusives__'],
  {name: {__element__: _std.$str, __cardinality__: $.Cardinality.One | $.Cardinality.AtMostOne },},
]>;
const $AzureOAuthProvider = $.makeType<$AzureOAuthProvider>(_.spec, "8e5252c0-063b-5112-8228-ec339ac035a7", _.syntax.literal);

const AzureOAuthProvider: $.$expr_PathNode<$.TypeSet<$AzureOAuthProvider, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($AzureOAuthProvider, $.Cardinality.Many), null);

export type $IdentityλShape = $.typeutil.flatten<$AuditableλShape & {
  "issuer": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, false, false>;
  "subject": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, false, false>;
  "<identity[is ext::auth::PKCEChallenge]": $.LinkDesc<$PKCEChallenge, $.Cardinality.Many, {}, false, false,  false, false>;
  "<identity[is User]": $.LinkDesc<_default.$User, $.Cardinality.Many, {}, false, false,  false, false>;
  "<identity[is __default::current_user]": $.LinkDesc<__default_10.$current_user, $.Cardinality.Many, {}, false, false,  false, false>;
  "<identity[is current_user]": $.LinkDesc<_default.$current_user, $.Cardinality.Many, {}, false, false,  false, false>;
  "<identity": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $Identity = $.ObjectType<"ext::auth::Identity", $IdentityλShape, null, [
  ...$Auditable['__exclusives__'],
  {issuer: {__element__: _std.$str, __cardinality__: $.Cardinality.One | $.Cardinality.AtMostOne },subject: {__element__: _std.$str, __cardinality__: $.Cardinality.One | $.Cardinality.AtMostOne },},
]>;
const $Identity = $.makeType<$Identity>(_.spec, "6801b916-bb3e-57eb-a156-c53c7623c210", _.syntax.literal);

const Identity: $.$expr_PathNode<$.TypeSet<$Identity, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($Identity, $.Cardinality.Many), null);

export type $ClientTokenIdentityλShape = $.typeutil.flatten<$IdentityλShape & {
}>;
type $ClientTokenIdentity = $.ObjectType<"ext::auth::ClientTokenIdentity", $ClientTokenIdentityλShape, null, [
  ...$Identity['__exclusives__'],
]>;
const $ClientTokenIdentity = $.makeType<$ClientTokenIdentity>(_.spec, "00f11fb6-7aba-5a64-8e54-a0500877b6c7", _.syntax.literal);

const ClientTokenIdentity: $.$expr_PathNode<$.TypeSet<$ClientTokenIdentity, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($ClientTokenIdentity, $.Cardinality.Many), null);

export type $FactorλShape = $.typeutil.flatten<$AuditableλShape & {
  "identity": $.LinkDesc<$LocalIdentity, $.Cardinality.One, {}, true, false,  false, false>;
}>;
type $Factor = $.ObjectType<"ext::auth::Factor", $FactorλShape, null, [
  ...$Auditable['__exclusives__'],
  {identity: {__element__: $LocalIdentity, __cardinality__: $.Cardinality.One | $.Cardinality.AtMostOne },},
]>;
const $Factor = $.makeType<$Factor>(_.spec, "5a4c113f-3892-5708-bf83-696857e64305", _.syntax.literal);

const Factor: $.$expr_PathNode<$.TypeSet<$Factor, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($Factor, $.Cardinality.Many), null);

export type $EmailFactorλShape = $.typeutil.flatten<$FactorλShape & {
  "email": $.PropertyDesc<_std.$str, $.Cardinality.One, true, false, false, false>;
  "verified_at": $.PropertyDesc<_std.$datetime, $.Cardinality.AtMostOne, false, false, false, false>;
}>;
type $EmailFactor = $.ObjectType<"ext::auth::EmailFactor", $EmailFactorλShape, null, [
  ...$Factor['__exclusives__'],
  {email: {__element__: _std.$str, __cardinality__: $.Cardinality.One | $.Cardinality.AtMostOne },},
]>;
const $EmailFactor = $.makeType<$EmailFactor>(_.spec, "c8e5d5f3-fced-5e92-a040-af0ef7991888", _.syntax.literal);

const EmailFactor: $.$expr_PathNode<$.TypeSet<$EmailFactor, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($EmailFactor, $.Cardinality.Many), null);

export type $EmailPasswordFactorλShape = $.typeutil.flatten<$EmailFactorλShape & {
  "password_hash": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, false, false>;
}>;
type $EmailPasswordFactor = $.ObjectType<"ext::auth::EmailPasswordFactor", $EmailPasswordFactorλShape, null, [
  ...$EmailFactor['__exclusives__'],
]>;
const $EmailPasswordFactor = $.makeType<$EmailPasswordFactor>(_.spec, "177397b5-4749-5b76-8062-813313551a8f", _.syntax.literal);

const EmailPasswordFactor: $.$expr_PathNode<$.TypeSet<$EmailPasswordFactor, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($EmailPasswordFactor, $.Cardinality.Many), null);

export type $EmailPasswordProviderConfigλShape = $.typeutil.flatten<Omit<$ProviderConfigλShape, "name"> & {
  "name": $.PropertyDesc<_std.$str, $.Cardinality.One, true, false, true, true>;
  "require_verification": $.PropertyDesc<_std.$bool, $.Cardinality.One, false, false, false, true>;
}>;
type $EmailPasswordProviderConfig = $.ObjectType<"ext::auth::EmailPasswordProviderConfig", $EmailPasswordProviderConfigλShape, null, [
  ...$ProviderConfig['__exclusives__'],
  {name: {__element__: _std.$str, __cardinality__: $.Cardinality.One | $.Cardinality.AtMostOne },},
]>;
const $EmailPasswordProviderConfig = $.makeType<$EmailPasswordProviderConfig>(_.spec, "f58a65af-0293-5623-87f9-3e79d77665b7", _.syntax.literal);

const EmailPasswordProviderConfig: $.$expr_PathNode<$.TypeSet<$EmailPasswordProviderConfig, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($EmailPasswordProviderConfig, $.Cardinality.Many), null);

export type $GitHubOAuthProviderλShape = $.typeutil.flatten<Omit<$OAuthProviderConfigλShape, "name" | "display_name"> & {
  "name": $.PropertyDesc<_std.$str, $.Cardinality.One, true, false, true, true>;
  "display_name": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, true, true>;
}>;
type $GitHubOAuthProvider = $.ObjectType<"ext::auth::GitHubOAuthProvider", $GitHubOAuthProviderλShape, null, [
  ...$OAuthProviderConfig['__exclusives__'],
  {name: {__element__: _std.$str, __cardinality__: $.Cardinality.One | $.Cardinality.AtMostOne },},
]>;
const $GitHubOAuthProvider = $.makeType<$GitHubOAuthProvider>(_.spec, "65ca9461-dbf9-5c42-8dd8-8e13e6bad184", _.syntax.literal);

const GitHubOAuthProvider: $.$expr_PathNode<$.TypeSet<$GitHubOAuthProvider, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($GitHubOAuthProvider, $.Cardinality.Many), null);

export type $GoogleOAuthProviderλShape = $.typeutil.flatten<Omit<$OAuthProviderConfigλShape, "name" | "display_name"> & {
  "name": $.PropertyDesc<_std.$str, $.Cardinality.One, true, false, true, true>;
  "display_name": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, true, true>;
}>;
type $GoogleOAuthProvider = $.ObjectType<"ext::auth::GoogleOAuthProvider", $GoogleOAuthProviderλShape, null, [
  ...$OAuthProviderConfig['__exclusives__'],
  {name: {__element__: _std.$str, __cardinality__: $.Cardinality.One | $.Cardinality.AtMostOne },},
]>;
const $GoogleOAuthProvider = $.makeType<$GoogleOAuthProvider>(_.spec, "ec577bc3-ecb3-5446-96ca-3842d9183f2f", _.syntax.literal);

const GoogleOAuthProvider: $.$expr_PathNode<$.TypeSet<$GoogleOAuthProvider, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($GoogleOAuthProvider, $.Cardinality.Many), null);

export type $LocalIdentityλShape = $.typeutil.flatten<Omit<$IdentityλShape, "subject" | "<identity"> & {
  "subject": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, false, false>;
  "<identity[is ext::auth::Factor]": $.LinkDesc<$Factor, $.Cardinality.AtMostOne, {}, true, false,  false, false>;
  "<identity[is ext::auth::EmailFactor]": $.LinkDesc<$EmailFactor, $.Cardinality.AtMostOne, {}, true, false,  false, false>;
  "<identity[is ext::auth::EmailPasswordFactor]": $.LinkDesc<$EmailPasswordFactor, $.Cardinality.AtMostOne, {}, true, false,  false, false>;
  "<identity": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $LocalIdentity = $.ObjectType<"ext::auth::LocalIdentity", $LocalIdentityλShape, null, [
  ...$Identity['__exclusives__'],
]>;
const $LocalIdentity = $.makeType<$LocalIdentity>(_.spec, "78ff164d-0c30-56a8-8baa-73824f6d68c6", _.syntax.literal);

const LocalIdentity: $.$expr_PathNode<$.TypeSet<$LocalIdentity, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($LocalIdentity, $.Cardinality.Many), null);

export type $PKCEChallengeλShape = $.typeutil.flatten<$AuditableλShape & {
  "challenge": $.PropertyDesc<_std.$str, $.Cardinality.One, true, false, false, false>;
  "auth_token": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, false>;
  "refresh_token": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, false>;
  "identity": $.LinkDesc<$Identity, $.Cardinality.AtMostOne, {}, false, false,  false, false>;
}>;
type $PKCEChallenge = $.ObjectType<"ext::auth::PKCEChallenge", $PKCEChallengeλShape, null, [
  ...$Auditable['__exclusives__'],
  {challenge: {__element__: _std.$str, __cardinality__: $.Cardinality.One | $.Cardinality.AtMostOne },},
]>;
const $PKCEChallenge = $.makeType<$PKCEChallenge>(_.spec, "559cb828-957b-5cfc-bddb-f74adc5c71be", _.syntax.literal);

const PKCEChallenge: $.$expr_PathNode<$.TypeSet<$PKCEChallenge, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($PKCEChallenge, $.Cardinality.Many), null);

export type $SMTPConfigλShape = $.typeutil.flatten<_cfg.$ExtensionConfigλShape & {
  "sender": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, false>;
  "host": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, false>;
  "port": $.PropertyDesc<_std.$int32, $.Cardinality.AtMostOne, false, false, false, false>;
  "username": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, false>;
  "password": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, false>;
  "security": $.PropertyDesc<$SMTPSecurity, $.Cardinality.One, false, false, false, true>;
  "validate_certs": $.PropertyDesc<_std.$bool, $.Cardinality.One, false, false, false, true>;
  "timeout_per_email": $.PropertyDesc<_std.$duration, $.Cardinality.One, false, false, false, true>;
  "timeout_per_attempt": $.PropertyDesc<_std.$duration, $.Cardinality.One, false, false, false, true>;
}>;
type $SMTPConfig = $.ObjectType<"ext::auth::SMTPConfig", $SMTPConfigλShape, null, [
  ..._cfg.$ExtensionConfig['__exclusives__'],
]>;
const $SMTPConfig = $.makeType<$SMTPConfig>(_.spec, "ac309d52-5057-5d9f-8d0a-1a4b202a320e", _.syntax.literal);

const SMTPConfig: $.$expr_PathNode<$.TypeSet<$SMTPConfig, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($SMTPConfig, $.Cardinality.Many), null);

export type $UIConfigλShape = $.typeutil.flatten<_cfg.$ConfigObjectλShape & {
  "redirect_to": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, false, false>;
  "redirect_to_on_signup": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, false>;
  "flow_type": $.PropertyDesc<$FlowType, $.Cardinality.One, false, false, false, true>;
  "app_name": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, false>;
  "logo_url": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, false>;
  "dark_logo_url": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, false>;
  "brand_color": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, false>;
  "<ui[is ext::auth::AuthConfig]": $.LinkDesc<$AuthConfig, $.Cardinality.Many, {}, false, false,  false, false>;
  "<ui": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $UIConfig = $.ObjectType<"ext::auth::UIConfig", $UIConfigλShape, null, [
  ..._cfg.$ConfigObject['__exclusives__'],
]>;
const $UIConfig = $.makeType<$UIConfig>(_.spec, "594c2313-d943-51c0-a6bb-d9d367926838", _.syntax.literal);

const UIConfig: $.$expr_PathNode<$.TypeSet<$UIConfig, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($UIConfig, $.Cardinality.Many), null);

type signing_key_existsλFuncExpr = $.$expr_Function<
  _std.$bool, $.Cardinality.One
>;
function signing_key_exists(): signing_key_existsλFuncExpr;
function signing_key_exists(...args: any[]) {
  const {returnType, cardinality, args: positionalArgs, namedArgs} = _.syntax.$resolveOverload('ext::auth::signing_key_exists', args, _.spec, [
    {args: [], returnTypeId: "00000000-0000-0000-0000-000000000109"},
  ]);
  return _.syntax.$expressionify({
    __kind__: $.ExpressionKind.Function,
    __element__: returnType,
    __cardinality__: cardinality,
    __name__: "ext::auth::signing_key_exists",
    __args__: positionalArgs,
    __namedargs__: namedArgs,
  }) as any;
};

type jwt_check_signature_afb44ddf133051a39d0871812371dd10λFuncExpr<
  P1 extends $.TypeSet<$.NamedTupleType<{header: _std.$str, payload: _std.$str, signature: _std.$str}>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$str>>,
  P3 extends _.castMaps.orScalarLiteral<$.TypeSet<$JWTAlgo>> | undefined,
> = $.$expr_Function<
  _std.$json, $.cardutil.multiplyCardinalities<$.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>, $.cardutil.optionalParamCardinality<P3>>
>;
function jwt_check_signature_afb44ddf133051a39d0871812371dd10<
  P1 extends $.TypeSet<$.NamedTupleType<{header: _std.$str, payload: _std.$str, signature: _std.$str}>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$str>>,
  P3 extends _.castMaps.orScalarLiteral<$.TypeSet<$JWTAlgo>> | undefined,
>(
  jwt: P1,
  key: P2,
  algo?: P3,
): jwt_check_signature_afb44ddf133051a39d0871812371dd10λFuncExpr<P1, P2, P3>;
function jwt_check_signature_afb44ddf133051a39d0871812371dd10(...args: any[]) {
  const {returnType, cardinality, args: positionalArgs, namedArgs} = _.syntax.$resolveOverload('ext::auth::_jwt_check_signature', args, _.spec, [
    {args: [{typeId: "7bfb0106-9442-58d3-9fe3-3c204e331351", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000101", optional: false, setoftype: false, variadic: false}, {typeId: "14113b4e-86a8-5b08-8ee9-9cfc1c7dc1e8", optional: true, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-00000000010f"},
  ]);
  return _.syntax.$expressionify({
    __kind__: $.ExpressionKind.Function,
    __element__: returnType,
    __cardinality__: cardinality,
    __name__: "ext::auth::_jwt_check_signature",
    __args__: positionalArgs,
    __namedargs__: namedArgs,
  }) as any;
};

type jwt_parse_08a86a788cea56a9b555b4a881b5e569λFuncExpr<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$str>>,
> = $.$expr_Function<
  $.NamedTupleType<{header: _std.$str, payload: _std.$str, signature: _std.$str}>, $.cardutil.paramCardinality<P1>
>;
function jwt_parse_08a86a788cea56a9b555b4a881b5e569<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$str>>,
>(
  token: P1,
): jwt_parse_08a86a788cea56a9b555b4a881b5e569λFuncExpr<P1>;
function jwt_parse_08a86a788cea56a9b555b4a881b5e569(...args: any[]) {
  const {returnType, cardinality, args: positionalArgs, namedArgs} = _.syntax.$resolveOverload('ext::auth::_jwt_parse', args, _.spec, [
    {args: [{typeId: "00000000-0000-0000-0000-000000000101", optional: false, setoftype: false, variadic: false}], returnTypeId: "7bfb0106-9442-58d3-9fe3-3c204e331351"},
  ]);
  return _.syntax.$expressionify({
    __kind__: $.ExpressionKind.Function,
    __element__: returnType,
    __cardinality__: cardinality,
    __name__: "ext::auth::_jwt_parse",
    __args__: positionalArgs,
    __namedargs__: namedArgs,
  }) as any;
};

type jwt_verify_75faa5ad758d5502bb04da9b92b99f58λFuncExpr<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$str>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$str>>,
  P3 extends _.castMaps.orScalarLiteral<$.TypeSet<$JWTAlgo>> | undefined,
> = $.$expr_Function<
  _std.$json, $.cardutil.multiplyCardinalities<$.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>, $.cardutil.optionalParamCardinality<P3>>
>;
function jwt_verify_75faa5ad758d5502bb04da9b92b99f58<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$str>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$str>>,
  P3 extends _.castMaps.orScalarLiteral<$.TypeSet<$JWTAlgo>> | undefined,
>(
  token: P1,
  key: P2,
  algo?: P3,
): jwt_verify_75faa5ad758d5502bb04da9b92b99f58λFuncExpr<P1, P2, P3>;
function jwt_verify_75faa5ad758d5502bb04da9b92b99f58(...args: any[]) {
  const {returnType, cardinality, args: positionalArgs, namedArgs} = _.syntax.$resolveOverload('ext::auth::_jwt_verify', args, _.spec, [
    {args: [{typeId: "00000000-0000-0000-0000-000000000101", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000101", optional: false, setoftype: false, variadic: false}, {typeId: "14113b4e-86a8-5b08-8ee9-9cfc1c7dc1e8", optional: true, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-00000000010f"},
  ]);
  return _.syntax.$expressionify({
    __kind__: $.ExpressionKind.Function,
    __element__: returnType,
    __cardinality__: cardinality,
    __name__: "ext::auth::_jwt_verify",
    __args__: positionalArgs,
    __namedargs__: namedArgs,
  }) as any;
};

const $ext_auth__globals: {  ClientTokenIdentity: _.syntax.$expr_Global<
              // "ext::auth::ClientTokenIdentity",
              $ClientTokenIdentity,
              $.Cardinality.Many
              >,  client_token: _.syntax.$expr_Global<
              // "ext::auth::client_token",
              _std.$str,
              $.Cardinality.AtMostOne
              >} = {  ClientTokenIdentity: _.syntax.makeGlobal(
              "ext::auth::ClientTokenIdentity",
              $.makeType(_.spec, "00f11fb6-7aba-5a64-8e54-a0500877b6c7", _.syntax.literal),
              $.Cardinality.Many) as any,  client_token: _.syntax.makeGlobal(
              "ext::auth::client_token",
              $.makeType(_.spec, "00000000-0000-0000-0000-000000000101", _.syntax.literal),
              $.Cardinality.AtMostOne) as any};



export { FlowType, JWTAlgo, SMTPSecurity, $ProviderConfig, ProviderConfig, $OAuthProviderConfig, OAuthProviderConfig, $AppleOAuthProvider, AppleOAuthProvider, $Auditable, Auditable, $AuthConfig, AuthConfig, $AzureOAuthProvider, AzureOAuthProvider, $Identity, Identity, $ClientTokenIdentity, ClientTokenIdentity, $Factor, Factor, $EmailFactor, EmailFactor, $EmailPasswordFactor, EmailPasswordFactor, $EmailPasswordProviderConfig, EmailPasswordProviderConfig, $GitHubOAuthProvider, GitHubOAuthProvider, $GoogleOAuthProvider, GoogleOAuthProvider, $LocalIdentity, LocalIdentity, $PKCEChallenge, PKCEChallenge, $SMTPConfig, SMTPConfig, $UIConfig, UIConfig };

type __defaultExports = {
  "FlowType": typeof FlowType;
  "JWTAlgo": typeof JWTAlgo;
  "SMTPSecurity": typeof SMTPSecurity;
  "ProviderConfig": typeof ProviderConfig;
  "OAuthProviderConfig": typeof OAuthProviderConfig;
  "AppleOAuthProvider": typeof AppleOAuthProvider;
  "Auditable": typeof Auditable;
  "AuthConfig": typeof AuthConfig;
  "AzureOAuthProvider": typeof AzureOAuthProvider;
  "Identity": typeof Identity;
  "ClientTokenIdentity": typeof ClientTokenIdentity;
  "Factor": typeof Factor;
  "EmailFactor": typeof EmailFactor;
  "EmailPasswordFactor": typeof EmailPasswordFactor;
  "EmailPasswordProviderConfig": typeof EmailPasswordProviderConfig;
  "GitHubOAuthProvider": typeof GitHubOAuthProvider;
  "GoogleOAuthProvider": typeof GoogleOAuthProvider;
  "LocalIdentity": typeof LocalIdentity;
  "PKCEChallenge": typeof PKCEChallenge;
  "SMTPConfig": typeof SMTPConfig;
  "UIConfig": typeof UIConfig;
  "signing_key_exists": typeof signing_key_exists;
  "_jwt_check_signature": typeof jwt_check_signature_afb44ddf133051a39d0871812371dd10;
  "_jwt_parse": typeof jwt_parse_08a86a788cea56a9b555b4a881b5e569;
  "_jwt_verify": typeof jwt_verify_75faa5ad758d5502bb04da9b92b99f58;
  "global": typeof $ext_auth__globals
};
const __defaultExports: __defaultExports = {
  "FlowType": FlowType,
  "JWTAlgo": JWTAlgo,
  "SMTPSecurity": SMTPSecurity,
  "ProviderConfig": ProviderConfig,
  "OAuthProviderConfig": OAuthProviderConfig,
  "AppleOAuthProvider": AppleOAuthProvider,
  "Auditable": Auditable,
  "AuthConfig": AuthConfig,
  "AzureOAuthProvider": AzureOAuthProvider,
  "Identity": Identity,
  "ClientTokenIdentity": ClientTokenIdentity,
  "Factor": Factor,
  "EmailFactor": EmailFactor,
  "EmailPasswordFactor": EmailPasswordFactor,
  "EmailPasswordProviderConfig": EmailPasswordProviderConfig,
  "GitHubOAuthProvider": GitHubOAuthProvider,
  "GoogleOAuthProvider": GoogleOAuthProvider,
  "LocalIdentity": LocalIdentity,
  "PKCEChallenge": PKCEChallenge,
  "SMTPConfig": SMTPConfig,
  "UIConfig": UIConfig,
  "signing_key_exists": signing_key_exists,
  "_jwt_check_signature": jwt_check_signature_afb44ddf133051a39d0871812371dd10,
  "_jwt_parse": jwt_parse_08a86a788cea56a9b555b4a881b5e569,
  "_jwt_verify": jwt_verify_75faa5ad758d5502bb04da9b92b99f58,
  "global": $ext_auth__globals
};
export default __defaultExports;
