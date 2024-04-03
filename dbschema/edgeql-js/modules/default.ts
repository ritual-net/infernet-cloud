// GENERATED by @edgedb/generate v0.4.1

import * as $ from "../reflection";
import * as _ from "../imports";
import type * as _std from "./std";
import type * as _auth from "./ext/auth";
export type $CloudProvider = {
  "AWS": $.$expr_Literal<$CloudProvider>;
  "GCP": $.$expr_Literal<$CloudProvider>;
} & $.EnumType<"default::CloudProvider", ["AWS", "GCP"]>;
const CloudProvider: $CloudProvider = $.makeType<$CloudProvider>(_.spec, "90c37ab0-f149-11ee-8b58-e9225982e9c1", _.syntax.literal);

export type $UserλShape = $.typeutil.flatten<_std.$Object_8ce8c71ee4fa5f73840c22d7eaa58588λShape & {
  "name": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, false, false>;
  "identity_id": $.PropertyDesc<_std.$uuid, $.Cardinality.One, true, false, false, false>;
  "identity": $.LinkDesc<_auth.$Identity, $.Cardinality.AtMostOne, {}, false, true,  false, false>;
  "email": $.PropertyDesc<_std.$str, $.Cardinality.One, true, false, false, false>;
  "<user[is ServiceAccount]": $.LinkDesc<$ServiceAccount, $.Cardinality.Many, {}, false, false,  false, false>;
  "<user[is AWSServiceAccount]": $.LinkDesc<$AWSServiceAccount, $.Cardinality.Many, {}, false, false,  false, false>;
  "<user[is ContainerTemplate]": $.LinkDesc<$ContainerTemplate, $.Cardinality.Many, {}, false, false,  false, false>;
  "<user[is GCPServiceAccount]": $.LinkDesc<$GCPServiceAccount, $.Cardinality.Many, {}, false, false,  false, false>;
  "<user": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $User = $.ObjectType<"default::User", $UserλShape, null, [
  ..._std.$Object_8ce8c71ee4fa5f73840c22d7eaa58588['__exclusives__'],
  {identity_id: {__element__: _std.$uuid, __cardinality__: $.Cardinality.One | $.Cardinality.AtMostOne },},
  {email: {__element__: _std.$str, __cardinality__: $.Cardinality.One | $.Cardinality.AtMostOne },},
]>;
const $User = $.makeType<$User>(_.spec, "90aee91a-f149-11ee-860a-b53882230535", _.syntax.literal);

const User: $.$expr_PathNode<$.TypeSet<$User, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($User, $.Cardinality.Many), null);

export type $ClusterλShape = $.typeutil.flatten<_std.$Object_8ce8c71ee4fa5f73840c22d7eaa58588λShape & {
  "nodes": $.LinkDesc<$InfernetNode, $.Cardinality.Many, {}, true, false,  false, false>;
  "service_account": $.LinkDesc<$ServiceAccount, $.Cardinality.One, {}, false, false,  true, false>;
  "deploy_router": $.PropertyDesc<_std.$bool, $.Cardinality.One, false, false, false, true>;
  "error": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, false>;
  "healthy": $.PropertyDesc<_std.$bool, $.Cardinality.One, false, false, false, true>;
  "ip_allow_http": $.PropertyDesc<$.ArrayType<_std.$str>, $.Cardinality.One, false, false, false, true>;
  "ip_allow_ssh": $.PropertyDesc<$.ArrayType<_std.$str>, $.Cardinality.One, false, false, false, true>;
  "locked": $.PropertyDesc<_std.$bool, $.Cardinality.One, false, false, false, true>;
  "name": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, false, false>;
  "router": $.PropertyDesc<$.NamedTupleType<{id: _std.$str, ip: _std.$str}>, $.Cardinality.AtMostOne, false, false, false, false>;
  "tfstate": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, false>;
}>;
type $Cluster = $.ObjectType<"default::Cluster", $ClusterλShape, null, [
  ..._std.$Object_8ce8c71ee4fa5f73840c22d7eaa58588['__exclusives__'],
  {name: {__element__: _std.$str, __cardinality__: $.Cardinality.One | $.Cardinality.AtMostOne },service_account: {__element__: $ServiceAccount, __cardinality__: $.Cardinality.One | $.Cardinality.AtMostOne },},
  {nodes: {__element__: $InfernetNode, __cardinality__: $.Cardinality.One | $.Cardinality.AtMostOne },},
]>;
const $Cluster = $.makeType<$Cluster>(_.spec, "90dc9d92-f149-11ee-a58d-71739f9f378f", _.syntax.literal);

const Cluster: $.$expr_PathNode<$.TypeSet<$Cluster, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($Cluster, $.Cardinality.Many), null);

export type $AWSClusterλShape = $.typeutil.flatten<$ClusterλShape & {
  "machine_type": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, true, false>;
  "region": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, true, false>;
}>;
type $AWSCluster = $.ObjectType<"default::AWSCluster", $AWSClusterλShape, null, [
  ...$Cluster['__exclusives__'],
]>;
const $AWSCluster = $.makeType<$AWSCluster>(_.spec, "911631a6-f149-11ee-95c1-fd8760e5fb42", _.syntax.literal);

const AWSCluster: $.$expr_PathNode<$.TypeSet<$AWSCluster, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($AWSCluster, $.Cardinality.Many), null);

export type $ServiceAccountλShape = $.typeutil.flatten<_std.$Object_8ce8c71ee4fa5f73840c22d7eaa58588λShape & {
  "user": $.LinkDesc<$User, $.Cardinality.One, {}, false, false,  true, false>;
  "name": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, false, false>;
  "provider": $.PropertyDesc<$CloudProvider, $.Cardinality.One, false, false, false, false>;
  "<service_account[is Cluster]": $.LinkDesc<$Cluster, $.Cardinality.Many, {}, false, false,  false, false>;
  "<service_account[is AWSCluster]": $.LinkDesc<$AWSCluster, $.Cardinality.Many, {}, false, false,  false, false>;
  "<service_account[is GCPCluster]": $.LinkDesc<$GCPCluster, $.Cardinality.Many, {}, false, false,  false, false>;
  "<service_account": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $ServiceAccount = $.ObjectType<"default::ServiceAccount", $ServiceAccountλShape, null, [
  ..._std.$Object_8ce8c71ee4fa5f73840c22d7eaa58588['__exclusives__'],
  {name: {__element__: _std.$str, __cardinality__: $.Cardinality.One | $.Cardinality.AtMostOne },user: {__element__: $User, __cardinality__: $.Cardinality.One | $.Cardinality.AtMostOne },},
]>;
const $ServiceAccount = $.makeType<$ServiceAccount>(_.spec, "90c3850a-f149-11ee-b69b-f331fd7cd4bc", _.syntax.literal);

const ServiceAccount: $.$expr_PathNode<$.TypeSet<$ServiceAccount, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($ServiceAccount, $.Cardinality.Many), null);

export type $AWSServiceAccountλShape = $.typeutil.flatten<Omit<$ServiceAccountλShape, "provider"> & {
  "creds": $.PropertyDesc<$.NamedTupleType<{user_name: _std.$str, access_key_id: _std.$str, status: _std.$str, secret_access_key: _std.$str, create_date: _std.$str}>, $.Cardinality.One, false, false, false, false>;
  "provider": $.PropertyDesc<$CloudProvider, $.Cardinality.One, false, false, false, true>;
}>;
type $AWSServiceAccount = $.ObjectType<"default::AWSServiceAccount", $AWSServiceAccountλShape, null, [
  ...$ServiceAccount['__exclusives__'],
]>;
const $AWSServiceAccount = $.makeType<$AWSServiceAccount>(_.spec, "9138af42-f149-11ee-80f3-bffa7dded392", _.syntax.literal);

const AWSServiceAccount: $.$expr_PathNode<$.TypeSet<$AWSServiceAccount, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($AWSServiceAccount, $.Cardinality.Many), null);

export type $ContainerλShape = $.typeutil.flatten<_std.$Object_8ce8c71ee4fa5f73840c22d7eaa58588λShape & {
  "allowed_addresses": $.PropertyDesc<$.ArrayType<_std.$str>, $.Cardinality.One, false, false, false, true>;
  "allowed_delegate_addresses": $.PropertyDesc<$.ArrayType<_std.$str>, $.Cardinality.One, false, false, false, true>;
  "allowed_ips": $.PropertyDesc<$.ArrayType<_std.$str>, $.Cardinality.One, false, false, false, true>;
  "command": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, false, true>;
  "container_id": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, false, false>;
  "description": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, false>;
  "env": $.PropertyDesc<_std.$json, $.Cardinality.One, false, false, false, true>;
  "external": $.PropertyDesc<_std.$bool, $.Cardinality.One, false, false, false, true>;
  "gpu": $.PropertyDesc<_std.$bool, $.Cardinality.One, false, false, false, true>;
  "image": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, false, false>;
  "<containers[is InfernetNode]": $.LinkDesc<$InfernetNode, $.Cardinality.AtMostOne, {}, false, false,  false, false>;
  "<containers": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $Container = $.ObjectType<"default::Container", $ContainerλShape, null, [
  ..._std.$Object_8ce8c71ee4fa5f73840c22d7eaa58588['__exclusives__'],
]>;
const $Container = $.makeType<$Container>(_.spec, "90bac294-f149-11ee-b9b3-ebc5e3f93081", _.syntax.literal);

const Container: $.$expr_PathNode<$.TypeSet<$Container, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($Container, $.Cardinality.Many), null);

export type $ContainerTemplateλShape = $.typeutil.flatten<$ContainerλShape & {
  "user": $.LinkDesc<$User, $.Cardinality.One, {}, false, false,  true, false>;
  "name": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, false, false>;
}>;
type $ContainerTemplate = $.ObjectType<"default::ContainerTemplate", $ContainerTemplateλShape, null, [
  ...$Container['__exclusives__'],
  {name: {__element__: _std.$str, __cardinality__: $.Cardinality.One | $.Cardinality.AtMostOne },user: {__element__: $User, __cardinality__: $.Cardinality.One | $.Cardinality.AtMostOne },},
]>;
const $ContainerTemplate = $.makeType<$ContainerTemplate>(_.spec, "9186e22a-f149-11ee-9e5b-ed68db8e78b7", _.syntax.literal);

const ContainerTemplate: $.$expr_PathNode<$.TypeSet<$ContainerTemplate, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($ContainerTemplate, $.Cardinality.Many), null);

export type $GCPClusterλShape = $.typeutil.flatten<$ClusterλShape & {
  "machine_type": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, true, false>;
  "region": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, true, false>;
  "zone": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, true, false>;
}>;
type $GCPCluster = $.ObjectType<"default::GCPCluster", $GCPClusterλShape, null, [
  ...$Cluster['__exclusives__'],
]>;
const $GCPCluster = $.makeType<$GCPCluster>(_.spec, "91be31b2-f149-11ee-a27e-470e8fb74b89", _.syntax.literal);

const GCPCluster: $.$expr_PathNode<$.TypeSet<$GCPCluster, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($GCPCluster, $.Cardinality.Many), null);

export type $GCPServiceAccountλShape = $.typeutil.flatten<Omit<$ServiceAccountλShape, "provider"> & {
  "creds": $.PropertyDesc<$.NamedTupleType<{type: _std.$str, project_id: _std.$str, private_key_id: _std.$str, private_key: _std.$str, client_email: _std.$str, client_id: _std.$str, auth_uri: _std.$str, token_uri: _std.$str, auth_provider_x509_cert_url: _std.$str, client_x509_cert_url: _std.$str, universe_domain: _std.$str}>, $.Cardinality.One, false, false, false, false>;
  "provider": $.PropertyDesc<$CloudProvider, $.Cardinality.One, false, false, false, true>;
}>;
type $GCPServiceAccount = $.ObjectType<"default::GCPServiceAccount", $GCPServiceAccountλShape, null, [
  ...$ServiceAccount['__exclusives__'],
]>;
const $GCPServiceAccount = $.makeType<$GCPServiceAccount>(_.spec, "91e47444-f149-11ee-98a0-a95cb7240f75", _.syntax.literal);

const GCPServiceAccount: $.$expr_PathNode<$.TypeSet<$GCPServiceAccount, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($GCPServiceAccount, $.Cardinality.Many), null);

export type $InfernetNodeλShape = $.typeutil.flatten<_std.$Object_8ce8c71ee4fa5f73840c22d7eaa58588λShape & {
  "containers": $.LinkDesc<$Container, $.Cardinality.Many, {}, true, false,  false, false>;
  "chain_enabled": $.PropertyDesc<_std.$bool, $.Cardinality.One, false, false, false, true>;
  "coordinator_address": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, true>;
  "forward_stats": $.PropertyDesc<_std.$bool, $.Cardinality.One, false, false, false, true>;
  "max_gas_limit": $.PropertyDesc<_std.$int64, $.Cardinality.AtMostOne, false, false, false, true>;
  "private_key": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, true>;
  "provider_id": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, false>;
  "rpc_url": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, true>;
  "trail_head_blocks": $.PropertyDesc<_std.$int16, $.Cardinality.AtMostOne, false, false, false, true>;
  "<nodes[is Cluster]": $.LinkDesc<$Cluster, $.Cardinality.AtMostOne, {}, false, false,  false, false>;
  "<nodes[is AWSCluster]": $.LinkDesc<$AWSCluster, $.Cardinality.AtMostOne, {}, false, false,  false, false>;
  "<nodes[is GCPCluster]": $.LinkDesc<$GCPCluster, $.Cardinality.AtMostOne, {}, false, false,  false, false>;
  "<nodes": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $InfernetNode = $.ObjectType<"default::InfernetNode", $InfernetNodeλShape, null, [
  ..._std.$Object_8ce8c71ee4fa5f73840c22d7eaa58588['__exclusives__'],
  {containers: {__element__: $Container, __cardinality__: $.Cardinality.One | $.Cardinality.AtMostOne },},
]>;
const $InfernetNode = $.makeType<$InfernetNode>(_.spec, "90bfbb5a-f149-11ee-86f1-bfe628d05861", _.syntax.literal);

const InfernetNode: $.$expr_PathNode<$.TypeSet<$InfernetNode, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($InfernetNode, $.Cardinality.Many), null);

export type $current_userλShape = $.typeutil.flatten<$UserλShape & {
}>;
type $current_user = $.ObjectType<"default::current_user", $current_userλShape, null, [
  ...$User['__exclusives__'],
]>;
const $current_user = $.makeType<$current_user>(_.spec, "90ba8ab8-f149-11ee-93fd-2baea4d0c4a0", _.syntax.literal);

const current_user: $.$expr_PathNode<$.TypeSet<$current_user, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($current_user, $.Cardinality.Many), null);

const $default__globals: {  current_user: _.syntax.$expr_Global<
              // "default::current_user",
              $current_user,
              $.Cardinality.AtMostOne
              >} = {  current_user: _.syntax.makeGlobal(
              "default::current_user",
              $.makeType(_.spec, "90ba8ab8-f149-11ee-93fd-2baea4d0c4a0", _.syntax.literal),
              $.Cardinality.AtMostOne) as any};



export { CloudProvider, $User, User, $Cluster, Cluster, $AWSCluster, AWSCluster, $ServiceAccount, ServiceAccount, $AWSServiceAccount, AWSServiceAccount, $Container, Container, $ContainerTemplate, ContainerTemplate, $GCPCluster, GCPCluster, $GCPServiceAccount, GCPServiceAccount, $InfernetNode, InfernetNode, $current_user, current_user };

type __defaultExports = {
  "CloudProvider": typeof CloudProvider;
  "User": typeof User;
  "Cluster": typeof Cluster;
  "AWSCluster": typeof AWSCluster;
  "ServiceAccount": typeof ServiceAccount;
  "AWSServiceAccount": typeof AWSServiceAccount;
  "Container": typeof Container;
  "ContainerTemplate": typeof ContainerTemplate;
  "GCPCluster": typeof GCPCluster;
  "GCPServiceAccount": typeof GCPServiceAccount;
  "InfernetNode": typeof InfernetNode;
  "current_user": typeof current_user;
  "global": typeof $default__globals
};
const __defaultExports: __defaultExports = {
  "CloudProvider": CloudProvider,
  "User": User,
  "Cluster": Cluster,
  "AWSCluster": AWSCluster,
  "ServiceAccount": ServiceAccount,
  "AWSServiceAccount": AWSServiceAccount,
  "Container": Container,
  "ContainerTemplate": ContainerTemplate,
  "GCPCluster": GCPCluster,
  "GCPServiceAccount": GCPServiceAccount,
  "InfernetNode": InfernetNode,
  "current_user": current_user,
  "global": $default__globals
};
export default __defaultExports;
