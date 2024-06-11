// GENERATED by @edgedb/generate v0.4.1

import * as $ from "../reflection";
import * as _ from "../imports";
import type * as _std from "./std";
import type * as _auth from "./ext/auth";
export type $Address = $.ScalarType<"std::str", string>;
const Address: $.scalarTypeWithConstructor<_std.$str, never> = $.makeType<$.scalarTypeWithConstructor<_std.$str, never>>(_.spec, "5ff684c0-284b-11ef-b4be-bb086e8e762e", _.syntax.literal);

export type $CloudProvider = {
  "AWS": $.$expr_Literal<$CloudProvider>;
  "GCP": $.$expr_Literal<$CloudProvider>;
} & $.EnumType<"default::CloudProvider", ["AWS", "GCP"]>;
const CloudProvider: $CloudProvider = $.makeType<$CloudProvider>(_.spec, "54415fba-284b-11ef-9822-09089f29355d", _.syntax.literal);

export type $IpAddress = $.ScalarType<"std::str", string>;
const IpAddress: $.scalarTypeWithConstructor<_std.$str, never> = $.makeType<$.scalarTypeWithConstructor<_std.$str, never>>(_.spec, "5ff7cc40-284b-11ef-8b02-396395669afe", _.syntax.literal);

export type $IpWithAddressMask = $.ScalarType<"std::str", string>;
const IpWithAddressMask: $.scalarTypeWithConstructor<_std.$str, never> = $.makeType<$.scalarTypeWithConstructor<_std.$str, never>>(_.spec, "5ff8e9f4-284b-11ef-859f-c7da6e6e96cd", _.syntax.literal);

export type $UserλShape = $.typeutil.flatten<_std.$Object_8ce8c71ee4fa5f73840c22d7eaa58588λShape & {
  "identity": $.LinkDesc<_auth.$Identity, $.Cardinality.One, {}, false, false,  false, false>;
  "name": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, false, false>;
  "email": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, false, false>;
  "<user[is ServiceAccount]": $.LinkDesc<$ServiceAccount, $.Cardinality.Many, {}, false, false,  false, false>;
  "<user[is AWSServiceAccount]": $.LinkDesc<$AWSServiceAccount, $.Cardinality.Many, {}, false, false,  false, false>;
  "<user[is ContainerTemplate]": $.LinkDesc<$ContainerTemplate, $.Cardinality.Many, {}, false, false,  false, false>;
  "<user[is GCPServiceAccount]": $.LinkDesc<$GCPServiceAccount, $.Cardinality.Many, {}, false, false,  false, false>;
  "<user[is DockerAccount]": $.LinkDesc<$DockerAccount, $.Cardinality.Many, {}, false, false,  false, false>;
  "<user": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $User = $.ObjectType<"default::User", $UserλShape, null, [
  ..._std.$Object_8ce8c71ee4fa5f73840c22d7eaa58588['__exclusives__'],
]>;
const $User = $.makeType<$User>(_.spec, "542e096a-284b-11ef-bd6c-41dadc3b4656", _.syntax.literal);

const User: $.$expr_PathNode<$.TypeSet<$User, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($User, $.Cardinality.Many), null);

export type $ClusterλShape = $.typeutil.flatten<_std.$Object_8ce8c71ee4fa5f73840c22d7eaa58588λShape & {
  "nodes": $.LinkDesc<$InfernetNode, $.Cardinality.Many, {}, true, false,  false, false>;
  "service_account": $.LinkDesc<$ServiceAccount, $.Cardinality.One, {}, false, false,  true, false>;
  "deploy_router": $.PropertyDesc<_std.$bool, $.Cardinality.One, false, false, false, true>;
  "error": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, false>;
  "healthy": $.PropertyDesc<_std.$bool, $.Cardinality.One, false, false, false, true>;
  "locked": $.PropertyDesc<_std.$bool, $.Cardinality.One, false, false, false, true>;
  "name": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, false, false>;
  "router": $.PropertyDesc<$.NamedTupleType<{id: _std.$str, ip: _std.$str}>, $.Cardinality.AtMostOne, false, false, false, false>;
  "tfstate": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, false>;
  "terraform_logs": $.PropertyDesc<_std.$json, $.Cardinality.Many, false, false, false, false>;
  "ip_allow_http": $.PropertyDesc<$.ArrayType<$IpWithAddressMask>, $.Cardinality.AtMostOne, false, false, false, false>;
  "ip_allow_ssh": $.PropertyDesc<$.ArrayType<$IpWithAddressMask>, $.Cardinality.AtMostOne, false, false, false, false>;
  "<cluster[is InfernetNode]": $.LinkDesc<$InfernetNode, $.Cardinality.Many, {}, false, false,  false, false>;
  "<cluster": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $Cluster = $.ObjectType<"default::Cluster", $ClusterλShape, null, [
  ..._std.$Object_8ce8c71ee4fa5f73840c22d7eaa58588['__exclusives__'],
  {name: {__element__: _std.$str, __cardinality__: $.Cardinality.One | $.Cardinality.AtMostOne },service_account: {__element__: $ServiceAccount, __cardinality__: $.Cardinality.One | $.Cardinality.AtMostOne },},
  {nodes: {__element__: $InfernetNode, __cardinality__: $.Cardinality.One | $.Cardinality.AtMostOne },},
]>;
const $Cluster = $.makeType<$Cluster>(_.spec, "545b20c6-284b-11ef-9b5b-c370942e30f7", _.syntax.literal);

const Cluster: $.$expr_PathNode<$.TypeSet<$Cluster, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($Cluster, $.Cardinality.Many), null);

export type $AWSClusterλShape = $.typeutil.flatten<$ClusterλShape & {
  "machine_type": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, true, false>;
  "region": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, true, false>;
}>;
type $AWSCluster = $.ObjectType<"default::AWSCluster", $AWSClusterλShape, null, [
  ...$Cluster['__exclusives__'],
]>;
const $AWSCluster = $.makeType<$AWSCluster>(_.spec, "548f798e-284b-11ef-b8a2-f5659abc788f", _.syntax.literal);

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
const $ServiceAccount = $.makeType<$ServiceAccount>(_.spec, "54416b90-284b-11ef-b01f-e9d7e858abab", _.syntax.literal);

const ServiceAccount: $.$expr_PathNode<$.TypeSet<$ServiceAccount, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($ServiceAccount, $.Cardinality.Many), null);

export type $AWSServiceAccountλShape = $.typeutil.flatten<Omit<$ServiceAccountλShape, "provider"> & {
  "creds": $.PropertyDesc<$.NamedTupleType<{user_name: _std.$str, access_key_id: _std.$str, status: _std.$str, secret_access_key: _std.$str, create_date: _std.$str}>, $.Cardinality.One, false, false, false, false>;
  "provider": $.PropertyDesc<$CloudProvider, $.Cardinality.One, false, false, false, true>;
}>;
type $AWSServiceAccount = $.ObjectType<"default::AWSServiceAccount", $AWSServiceAccountλShape, null, [
  ...$ServiceAccount['__exclusives__'],
]>;
const $AWSServiceAccount = $.makeType<$AWSServiceAccount>(_.spec, "54b5ff28-284b-11ef-b73c-b706be4476ff", _.syntax.literal);

const AWSServiceAccount: $.$expr_PathNode<$.TypeSet<$AWSServiceAccount, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($AWSServiceAccount, $.Cardinality.Many), null);

export type $ContainerλShape = $.typeutil.flatten<_std.$Object_8ce8c71ee4fa5f73840c22d7eaa58588λShape & {
  "container_id": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, false, false>;
  "description": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, false>;
  "external": $.PropertyDesc<_std.$bool, $.Cardinality.One, false, false, false, true>;
  "gpu": $.PropertyDesc<_std.$bool, $.Cardinality.One, false, false, false, true>;
  "image": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, false, false>;
  "rate_limit_num_requests": $.PropertyDesc<_std.$int64, $.Cardinality.AtMostOne, false, false, false, false>;
  "rate_limit_period": $.PropertyDesc<_std.$float32, $.Cardinality.AtMostOne, false, false, false, false>;
  "allowed_addresses": $.PropertyDesc<$.ArrayType<$Address>, $.Cardinality.AtMostOne, false, false, false, false>;
  "allowed_delegate_addresses": $.PropertyDesc<$.ArrayType<$Address>, $.Cardinality.AtMostOne, false, false, false, false>;
  "allowed_ips": $.PropertyDesc<$.ArrayType<$IpAddress>, $.Cardinality.AtMostOne, false, false, false, false>;
  "command": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, false>;
  "env": $.PropertyDesc<_std.$json, $.Cardinality.AtMostOne, false, false, false, false>;
  "accepted_payments": $.PropertyDesc<$.ArrayType<$.NamedTupleType<{address: $Address, amount: _std.$bigint}>>, $.Cardinality.AtMostOne, false, false, false, false>;
  "generates_proofs": $.PropertyDesc<_std.$bool, $.Cardinality.One, false, false, false, true>;
  "<containers[is InfernetNode]": $.LinkDesc<$InfernetNode, $.Cardinality.AtMostOne, {}, false, false,  false, false>;
  "<containers": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $Container = $.ObjectType<"default::Container", $ContainerλShape, null, [
  ..._std.$Object_8ce8c71ee4fa5f73840c22d7eaa58588['__exclusives__'],
]>;
const $Container = $.makeType<$Container>(_.spec, "543aa792-284b-11ef-809d-e5c3010c3be5", _.syntax.literal);

const Container: $.$expr_PathNode<$.TypeSet<$Container, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($Container, $.Cardinality.Many), null);

export type $ContainerTemplateλShape = $.typeutil.flatten<$ContainerλShape & {
  "user": $.LinkDesc<$User, $.Cardinality.One, {}, false, false,  true, false>;
  "name": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, false, false>;
  "docker_account": $.LinkDesc<$DockerAccount, $.Cardinality.AtMostOne, {}, false, false,  false, false>;
  "chain_enabled": $.PropertyDesc<_std.$bool, $.Cardinality.AtMostOne, false, false, false, false>;
}>;
type $ContainerTemplate = $.ObjectType<"default::ContainerTemplate", $ContainerTemplateλShape, null, [
  ...$Container['__exclusives__'],
  {name: {__element__: _std.$str, __cardinality__: $.Cardinality.One | $.Cardinality.AtMostOne },user: {__element__: $User, __cardinality__: $.Cardinality.One | $.Cardinality.AtMostOne },},
]>;
const $ContainerTemplate = $.makeType<$ContainerTemplate>(_.spec, "54fc7868-284b-11ef-a3ed-6123af90dcc6", _.syntax.literal);

const ContainerTemplate: $.$expr_PathNode<$.TypeSet<$ContainerTemplate, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($ContainerTemplate, $.Cardinality.Many), null);

export type $DockerAccountλShape = $.typeutil.flatten<_std.$Object_8ce8c71ee4fa5f73840c22d7eaa58588λShape & {
  "user": $.LinkDesc<$User, $.Cardinality.One, {}, false, false,  true, false>;
  "username": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, false, false>;
  "password": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, false, false>;
  "<docker_account[is InfernetNode]": $.LinkDesc<$InfernetNode, $.Cardinality.Many, {}, false, false,  false, false>;
  "<docker_account[is ContainerTemplate]": $.LinkDesc<$ContainerTemplate, $.Cardinality.Many, {}, false, false,  false, false>;
  "<docker_account": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $DockerAccount = $.ObjectType<"default::DockerAccount", $DockerAccountλShape, null, [
  ..._std.$Object_8ce8c71ee4fa5f73840c22d7eaa58588['__exclusives__'],
  {username: {__element__: _std.$str, __cardinality__: $.Cardinality.One | $.Cardinality.AtMostOne },user: {__element__: $User, __cardinality__: $.Cardinality.One | $.Cardinality.AtMostOne },},
]>;
const $DockerAccount = $.makeType<$DockerAccount>(_.spec, "5e9eafd0-284b-11ef-a4b1-eb8138079c9e", _.syntax.literal);

const DockerAccount: $.$expr_PathNode<$.TypeSet<$DockerAccount, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($DockerAccount, $.Cardinality.Many), null);

export type $GCPClusterλShape = $.typeutil.flatten<$ClusterλShape & {
  "machine_type": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, true, false>;
  "region": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, true, false>;
  "zone": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, true, false>;
}>;
type $GCPCluster = $.ObjectType<"default::GCPCluster", $GCPClusterλShape, null, [
  ...$Cluster['__exclusives__'],
]>;
const $GCPCluster = $.makeType<$GCPCluster>(_.spec, "55355624-284b-11ef-9db1-45feee21b9ac", _.syntax.literal);

const GCPCluster: $.$expr_PathNode<$.TypeSet<$GCPCluster, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($GCPCluster, $.Cardinality.Many), null);

export type $GCPServiceAccountλShape = $.typeutil.flatten<Omit<$ServiceAccountλShape, "provider"> & {
  "creds": $.PropertyDesc<$.NamedTupleType<{type: _std.$str, project_id: _std.$str, private_key_id: _std.$str, private_key: _std.$str, client_email: _std.$str, client_id: _std.$str, auth_uri: _std.$str, token_uri: _std.$str, auth_provider_x509_cert_url: _std.$str, client_x509_cert_url: _std.$str, universe_domain: _std.$str}>, $.Cardinality.One, false, false, false, false>;
  "provider": $.PropertyDesc<$CloudProvider, $.Cardinality.One, false, false, false, true>;
}>;
type $GCPServiceAccount = $.ObjectType<"default::GCPServiceAccount", $GCPServiceAccountλShape, null, [
  ...$ServiceAccount['__exclusives__'],
]>;
const $GCPServiceAccount = $.makeType<$GCPServiceAccount>(_.spec, "555b1b98-284b-11ef-b8b9-8f857758e3ea", _.syntax.literal);

const GCPServiceAccount: $.$expr_PathNode<$.TypeSet<$GCPServiceAccount, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($GCPServiceAccount, $.Cardinality.Many), null);

export type $InfernetNodeλShape = $.typeutil.flatten<_std.$Object_8ce8c71ee4fa5f73840c22d7eaa58588λShape & {
  "containers": $.LinkDesc<$Container, $.Cardinality.Many, {}, true, false,  false, false>;
  "chain_enabled": $.PropertyDesc<_std.$bool, $.Cardinality.One, false, false, false, true>;
  "forward_stats": $.PropertyDesc<_std.$bool, $.Cardinality.One, false, false, false, true>;
  "max_gas_limit": $.PropertyDesc<_std.$int64, $.Cardinality.AtMostOne, false, false, false, true>;
  "private_key": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, true>;
  "provider_id": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, false>;
  "rpc_url": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, true>;
  "trail_head_blocks": $.PropertyDesc<_std.$int16, $.Cardinality.AtMostOne, false, false, false, true>;
  "docker_account": $.LinkDesc<$DockerAccount, $.Cardinality.AtMostOne, {}, false, false,  false, false>;
  "cluster": $.LinkDesc<$Cluster, $.Cardinality.AtMostOne, {}, false, true,  false, false>;
  "snapshot_sync_batch_size": $.PropertyDesc<_std.$int16, $.Cardinality.AtMostOne, false, false, false, false>;
  "snapshot_sync_sleep": $.PropertyDesc<_std.$float32, $.Cardinality.AtMostOne, false, false, false, false>;
  "registry_address": $.PropertyDesc<$Address, $.Cardinality.AtMostOne, false, false, false, false>;
  "allowed_sim_errors": $.PropertyDesc<$.ArrayType<_std.$str>, $.Cardinality.AtMostOne, false, false, false, false>;
  "payment_address": $.PropertyDesc<$Address, $.Cardinality.AtMostOne, false, false, false, false>;
  "<nodes[is Cluster]": $.LinkDesc<$Cluster, $.Cardinality.AtMostOne, {}, false, false,  false, false>;
  "<nodes[is AWSCluster]": $.LinkDesc<$AWSCluster, $.Cardinality.AtMostOne, {}, false, false,  false, false>;
  "<nodes[is GCPCluster]": $.LinkDesc<$GCPCluster, $.Cardinality.AtMostOne, {}, false, false,  false, false>;
  "<nodes": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $InfernetNode = $.ObjectType<"default::InfernetNode", $InfernetNodeλShape, null, [
  ..._std.$Object_8ce8c71ee4fa5f73840c22d7eaa58588['__exclusives__'],
  {containers: {__element__: $Container, __cardinality__: $.Cardinality.One | $.Cardinality.AtMostOne },},
]>;
const $InfernetNode = $.makeType<$InfernetNode>(_.spec, "543dfaa0-284b-11ef-afd6-f5358c052cb9", _.syntax.literal);

const InfernetNode: $.$expr_PathNode<$.TypeSet<$InfernetNode, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($InfernetNode, $.Cardinality.Many), null);

export type $current_userλShape = $.typeutil.flatten<$UserλShape & {
}>;
type $current_user = $.ObjectType<"default::current_user", $current_userλShape, null, [
  ...$User['__exclusives__'],
]>;
const $current_user = $.makeType<$current_user>(_.spec, "543a6688-284b-11ef-b081-6f8ed7f66b8f", _.syntax.literal);

const current_user: $.$expr_PathNode<$.TypeSet<$current_user, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($current_user, $.Cardinality.Many), null);

const $default__globals: {  current_user: _.syntax.$expr_Global<
              // "default::current_user",
              $current_user,
              $.Cardinality.AtMostOne
              >} = {  current_user: _.syntax.makeGlobal(
              "default::current_user",
              $.makeType(_.spec, "543a6688-284b-11ef-b081-6f8ed7f66b8f", _.syntax.literal),
              $.Cardinality.AtMostOne) as any};



export { Address, CloudProvider, IpAddress, IpWithAddressMask, $User, User, $Cluster, Cluster, $AWSCluster, AWSCluster, $ServiceAccount, ServiceAccount, $AWSServiceAccount, AWSServiceAccount, $Container, Container, $ContainerTemplate, ContainerTemplate, $DockerAccount, DockerAccount, $GCPCluster, GCPCluster, $GCPServiceAccount, GCPServiceAccount, $InfernetNode, InfernetNode, $current_user, current_user };

type __defaultExports = {
  "Address": typeof Address;
  "CloudProvider": typeof CloudProvider;
  "IpAddress": typeof IpAddress;
  "IpWithAddressMask": typeof IpWithAddressMask;
  "User": typeof User;
  "Cluster": typeof Cluster;
  "AWSCluster": typeof AWSCluster;
  "ServiceAccount": typeof ServiceAccount;
  "AWSServiceAccount": typeof AWSServiceAccount;
  "Container": typeof Container;
  "ContainerTemplate": typeof ContainerTemplate;
  "DockerAccount": typeof DockerAccount;
  "GCPCluster": typeof GCPCluster;
  "GCPServiceAccount": typeof GCPServiceAccount;
  "InfernetNode": typeof InfernetNode;
  "current_user": typeof current_user;
  "global": typeof $default__globals
};
const __defaultExports: __defaultExports = {
  "Address": Address,
  "CloudProvider": CloudProvider,
  "IpAddress": IpAddress,
  "IpWithAddressMask": IpWithAddressMask,
  "User": User,
  "Cluster": Cluster,
  "AWSCluster": AWSCluster,
  "ServiceAccount": ServiceAccount,
  "AWSServiceAccount": AWSServiceAccount,
  "Container": Container,
  "ContainerTemplate": ContainerTemplate,
  "DockerAccount": DockerAccount,
  "GCPCluster": GCPCluster,
  "GCPServiceAccount": GCPServiceAccount,
  "InfernetNode": InfernetNode,
  "current_user": current_user,
  "global": $default__globals
};
export default __defaultExports;
