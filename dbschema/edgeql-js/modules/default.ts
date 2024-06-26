// GENERATED by @edgedb/generate v0.4.1

import * as $ from "../reflection";
import * as _ from "../imports";
import type * as _std from "./std";
import type * as _auth from "./ext/auth";
export type $Address = $.ScalarType<"std::str", string>;
const Address: $.scalarTypeWithConstructor<_std.$str, never> = $.makeType<$.scalarTypeWithConstructor<_std.$str, never>>(_.spec, "2ab5fbda-29a7-11ef-b2b5-1166829ebd2b", _.syntax.literal);

export type $BigIntString = $.ScalarType<"std::str", string>;
const BigIntString: $.scalarTypeWithConstructor<_std.$str, never> = $.makeType<$.scalarTypeWithConstructor<_std.$str, never>>(_.spec, "dd59be16-29a7-11ef-96b6-fde11e397154", _.syntax.literal);

export type $CloudProvider = {
  "AWS": $.$expr_Literal<$CloudProvider>;
  "GCP": $.$expr_Literal<$CloudProvider>;
} & $.EnumType<"default::CloudProvider", ["AWS", "GCP"]>;
const CloudProvider: $CloudProvider = $.makeType<$CloudProvider>(_.spec, "157bc326-29a7-11ef-8d87-cd94d7909fe5", _.syntax.literal);

export type $IpAddress = $.ScalarType<"std::str", string>;
const IpAddress: $.scalarTypeWithConstructor<_std.$str, never> = $.makeType<$.scalarTypeWithConstructor<_std.$str, never>>(_.spec, "2ab75bce-29a7-11ef-aaf6-4109a4c14a12", _.syntax.literal);

export type $IpAddressWithMask = $.ScalarType<"std::str", string>;
const IpAddressWithMask: $.scalarTypeWithConstructor<_std.$str, never> = $.makeType<$.scalarTypeWithConstructor<_std.$str, never>>(_.spec, "2ab8e7c8-29a7-11ef-b1b2-2d75161546c6", _.syntax.literal);

export type $Secp256k1PrivateKey = $.ScalarType<"std::str", string>;
const Secp256k1PrivateKey: $.scalarTypeWithConstructor<_std.$str, never> = $.makeType<$.scalarTypeWithConstructor<_std.$str, never>>(_.spec, "2c0eccd2-29a7-11ef-b85d-657974a7810a", _.syntax.literal);

export type $TerraformAction = {
  "Init": $.$expr_Literal<$TerraformAction>;
  "Plan": $.$expr_Literal<$TerraformAction>;
  "Apply": $.$expr_Literal<$TerraformAction>;
  "Destroy": $.$expr_Literal<$TerraformAction>;
} & $.EnumType<"default::TerraformAction", ["Init", "Plan", "Apply", "Destroy"]>;
const TerraformAction: $TerraformAction = $.makeType<$TerraformAction>(_.spec, "085f6934-2f58-11ef-9dbd-67fb1c9b5a2d", _.syntax.literal);

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
const $User = $.makeType<$User>(_.spec, "15626840-29a7-11ef-a90b-7ddc1bc17698", _.syntax.literal);

const User: $.$expr_PathNode<$.TypeSet<$User, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($User, $.Cardinality.Many), null);

export type $ClusterλShape = $.typeutil.flatten<_std.$Object_8ce8c71ee4fa5f73840c22d7eaa58588λShape & {
  "nodes": $.LinkDesc<$InfernetNode, $.Cardinality.Many, {}, true, false,  false, false>;
  "service_account": $.LinkDesc<$ServiceAccount, $.Cardinality.One, {}, false, false,  true, false>;
  "deploy_router": $.PropertyDesc<_std.$bool, $.Cardinality.One, false, false, false, true>;
  "locked": $.PropertyDesc<_std.$bool, $.Cardinality.One, false, false, false, true>;
  "name": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, false, false>;
  "router": $.PropertyDesc<$.NamedTupleType<{id: _std.$str, ip: _std.$str}>, $.Cardinality.AtMostOne, false, false, false, false>;
  "ip_allow_http": $.PropertyDesc<$.ArrayType<$IpAddressWithMask>, $.Cardinality.AtMostOne, false, false, false, false>;
  "ip_allow_ssh": $.PropertyDesc<$.ArrayType<$IpAddressWithMask>, $.Cardinality.AtMostOne, false, false, false, false>;
  "deployments": $.LinkDesc<$TerraformDeployment, $.Cardinality.Many, {}, false, true,  false, false>;
  "latest_deployment": $.LinkDesc<$TerraformDeployment, $.Cardinality.AtMostOne, {}, false, true,  false, false>;
  "status": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, true, false, false>;
  "<cluster[is InfernetNode]": $.LinkDesc<$InfernetNode, $.Cardinality.Many, {}, false, false,  false, false>;
  "<cluster[is TerraformDeployment]": $.LinkDesc<$TerraformDeployment, $.Cardinality.Many, {}, false, false,  false, false>;
  "<cluster": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $Cluster = $.ObjectType<"default::Cluster", $ClusterλShape, null, [
  ..._std.$Object_8ce8c71ee4fa5f73840c22d7eaa58588['__exclusives__'],
  {name: {__element__: _std.$str, __cardinality__: $.Cardinality.One | $.Cardinality.AtMostOne },service_account: {__element__: $ServiceAccount, __cardinality__: $.Cardinality.One | $.Cardinality.AtMostOne },},
  {nodes: {__element__: $InfernetNode, __cardinality__: $.Cardinality.One | $.Cardinality.AtMostOne },},
]>;
const $Cluster = $.makeType<$Cluster>(_.spec, "159f2820-29a7-11ef-948d-0590ba89336b", _.syntax.literal);

const Cluster: $.$expr_PathNode<$.TypeSet<$Cluster, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($Cluster, $.Cardinality.Many), null);

export type $AWSClusterλShape = $.typeutil.flatten<$ClusterλShape & {
  "machine_type": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, true, false>;
  "region": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, true, false>;
}>;
type $AWSCluster = $.ObjectType<"default::AWSCluster", $AWSClusterλShape, null, [
  ...$Cluster['__exclusives__'],
]>;
const $AWSCluster = $.makeType<$AWSCluster>(_.spec, "16399ac2-29a7-11ef-8034-e3c7082f3274", _.syntax.literal);

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
const $ServiceAccount = $.makeType<$ServiceAccount>(_.spec, "157bcf42-29a7-11ef-8465-e911422a6504", _.syntax.literal);

const ServiceAccount: $.$expr_PathNode<$.TypeSet<$ServiceAccount, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($ServiceAccount, $.Cardinality.Many), null);

export type $AWSServiceAccountλShape = $.typeutil.flatten<Omit<$ServiceAccountλShape, "provider"> & {
  "creds": $.PropertyDesc<$.NamedTupleType<{user_name: _std.$str, access_key_id: _std.$str, status: _std.$str, secret_access_key: _std.$str, create_date: _std.$str}>, $.Cardinality.One, false, false, false, false>;
  "provider": $.PropertyDesc<$CloudProvider, $.Cardinality.One, false, false, false, true>;
}>;
type $AWSServiceAccount = $.ObjectType<"default::AWSServiceAccount", $AWSServiceAccountλShape, null, [
  ...$ServiceAccount['__exclusives__'],
]>;
const $AWSServiceAccount = $.makeType<$AWSServiceAccount>(_.spec, "16a7135e-29a7-11ef-8c96-ddea02804125", _.syntax.literal);

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
  "command": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, false>;
  "env": $.PropertyDesc<_std.$json, $.Cardinality.AtMostOne, false, false, false, false>;
  "generates_proofs": $.PropertyDesc<_std.$bool, $.Cardinality.One, false, false, false, true>;
  "accepted_payments": $.PropertyDesc<$.ArrayType<$.NamedTupleType<{address: $Address, amount: $BigIntString}>>, $.Cardinality.AtMostOne, false, false, false, false>;
  "allowed_ips": $.PropertyDesc<$.ArrayType<$IpAddressWithMask>, $.Cardinality.AtMostOne, false, false, false, false>;
  "<containers[is InfernetNode]": $.LinkDesc<$InfernetNode, $.Cardinality.AtMostOne, {}, false, false,  false, false>;
  "<containers": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $Container = $.ObjectType<"default::Container", $ContainerλShape, null, [
  ..._std.$Object_8ce8c71ee4fa5f73840c22d7eaa58588['__exclusives__'],
]>;
const $Container = $.makeType<$Container>(_.spec, "1573f11e-29a7-11ef-8977-d9408b93da75", _.syntax.literal);

const Container: $.$expr_PathNode<$.TypeSet<$Container, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($Container, $.Cardinality.Many), null);

export type $ContainerTemplateλShape = $.typeutil.flatten<$ContainerλShape & {
  "user": $.LinkDesc<$User, $.Cardinality.One, {}, false, false,  true, false>;
  "name": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, false, false>;
  "docker_account": $.LinkDesc<$DockerAccount, $.Cardinality.AtMostOne, {}, false, false,  false, false>;
  "chain_enabled": $.PropertyDesc<_std.$bool, $.Cardinality.AtMostOne, false, false, false, false>;
  "chain_id": $.PropertyDesc<_std.$int64, $.Cardinality.AtMostOne, false, false, false, false>;
}>;
type $ContainerTemplate = $.ObjectType<"default::ContainerTemplate", $ContainerTemplateλShape, null, [
  ...$Container['__exclusives__'],
  {name: {__element__: _std.$str, __cardinality__: $.Cardinality.One | $.Cardinality.AtMostOne },user: {__element__: $User, __cardinality__: $.Cardinality.One | $.Cardinality.AtMostOne },},
]>;
const $ContainerTemplate = $.makeType<$ContainerTemplate>(_.spec, "17272c42-29a7-11ef-898c-a71e701d7c09", _.syntax.literal);

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
const $DockerAccount = $.makeType<$DockerAccount>(_.spec, "2908f594-29a7-11ef-810f-674a0d5e8c82", _.syntax.literal);

const DockerAccount: $.$expr_PathNode<$.TypeSet<$DockerAccount, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($DockerAccount, $.Cardinality.Many), null);

export type $GCPClusterλShape = $.typeutil.flatten<$ClusterλShape & {
  "machine_type": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, true, false>;
  "region": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, true, false>;
  "zone": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, true, false>;
}>;
type $GCPCluster = $.ObjectType<"default::GCPCluster", $GCPClusterλShape, null, [
  ...$Cluster['__exclusives__'],
]>;
const $GCPCluster = $.makeType<$GCPCluster>(_.spec, "178a491c-29a7-11ef-a3e5-23ec5c57cc0a", _.syntax.literal);

const GCPCluster: $.$expr_PathNode<$.TypeSet<$GCPCluster, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($GCPCluster, $.Cardinality.Many), null);

export type $GCPServiceAccountλShape = $.typeutil.flatten<Omit<$ServiceAccountλShape, "provider"> & {
  "creds": $.PropertyDesc<$.NamedTupleType<{type: _std.$str, project_id: _std.$str, private_key_id: _std.$str, private_key: _std.$str, client_email: _std.$str, client_id: _std.$str, auth_uri: _std.$str, token_uri: _std.$str, auth_provider_x509_cert_url: _std.$str, client_x509_cert_url: _std.$str, universe_domain: _std.$str}>, $.Cardinality.One, false, false, false, false>;
  "provider": $.PropertyDesc<$CloudProvider, $.Cardinality.One, false, false, false, true>;
}>;
type $GCPServiceAccount = $.ObjectType<"default::GCPServiceAccount", $GCPServiceAccountλShape, null, [
  ...$ServiceAccount['__exclusives__'],
]>;
const $GCPServiceAccount = $.makeType<$GCPServiceAccount>(_.spec, "17cca8b6-29a7-11ef-8b77-899c0236f672", _.syntax.literal);

const GCPServiceAccount: $.$expr_PathNode<$.TypeSet<$GCPServiceAccount, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($GCPServiceAccount, $.Cardinality.Many), null);

export type $InfernetNodeλShape = $.typeutil.flatten<_std.$Object_8ce8c71ee4fa5f73840c22d7eaa58588λShape & {
  "containers": $.LinkDesc<$Container, $.Cardinality.Many, {}, true, false,  false, false>;
  "chain_enabled": $.PropertyDesc<_std.$bool, $.Cardinality.One, false, false, false, true>;
  "forward_stats": $.PropertyDesc<_std.$bool, $.Cardinality.One, false, false, false, true>;
  "max_gas_limit": $.PropertyDesc<_std.$int64, $.Cardinality.AtMostOne, false, false, false, false>;
  "provider_id": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, false>;
  "rpc_url": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, false>;
  "trail_head_blocks": $.PropertyDesc<_std.$int16, $.Cardinality.AtMostOne, false, false, false, false>;
  "docker_account": $.LinkDesc<$DockerAccount, $.Cardinality.AtMostOne, {}, false, false,  false, false>;
  "cluster": $.LinkDesc<$Cluster, $.Cardinality.AtMostOne, {}, false, true,  false, false>;
  "snapshot_sync_batch_size": $.PropertyDesc<_std.$int16, $.Cardinality.AtMostOne, false, false, false, false>;
  "snapshot_sync_sleep": $.PropertyDesc<_std.$float32, $.Cardinality.AtMostOne, false, false, false, false>;
  "registry_address": $.PropertyDesc<$Address, $.Cardinality.AtMostOne, false, false, false, false>;
  "allowed_sim_errors": $.PropertyDesc<$.ArrayType<_std.$str>, $.Cardinality.AtMostOne, false, false, false, false>;
  "payment_address": $.PropertyDesc<$Address, $.Cardinality.AtMostOne, false, false, false, false>;
  "private_key": $.PropertyDesc<$Secp256k1PrivateKey, $.Cardinality.AtMostOne, false, false, false, false>;
  "<nodes[is Cluster]": $.LinkDesc<$Cluster, $.Cardinality.AtMostOne, {}, false, false,  false, false>;
  "<nodes[is AWSCluster]": $.LinkDesc<$AWSCluster, $.Cardinality.AtMostOne, {}, false, false,  false, false>;
  "<nodes[is GCPCluster]": $.LinkDesc<$GCPCluster, $.Cardinality.AtMostOne, {}, false, false,  false, false>;
  "<nodes": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $InfernetNode = $.ObjectType<"default::InfernetNode", $InfernetNodeλShape, null, [
  ..._std.$Object_8ce8c71ee4fa5f73840c22d7eaa58588['__exclusives__'],
  {containers: {__element__: $Container, __cardinality__: $.Cardinality.One | $.Cardinality.AtMostOne },},
]>;
const $InfernetNode = $.makeType<$InfernetNode>(_.spec, "1577c6e0-29a7-11ef-8263-b9e25b9cad25", _.syntax.literal);

const InfernetNode: $.$expr_PathNode<$.TypeSet<$InfernetNode, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($InfernetNode, $.Cardinality.Many), null);

export type $TerraformDeploymentλShape = $.typeutil.flatten<_std.$Object_8ce8c71ee4fa5f73840c22d7eaa58588λShape & {
  "config": $.PropertyDesc<_std.$json, $.Cardinality.AtMostOne, false, false, false, false>;
  "error": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, false>;
  "stderr": $.PropertyDesc<$.ArrayType<_std.$json>, $.Cardinality.AtMostOne, false, false, false, false>;
  "stdout": $.PropertyDesc<$.ArrayType<_std.$json>, $.Cardinality.AtMostOne, false, false, false, false>;
  "tfstate": $.PropertyDesc<_std.$json, $.Cardinality.AtMostOne, false, false, false, false>;
  "action": $.PropertyDesc<$TerraformAction, $.Cardinality.One, false, false, false, false>;
  "timestamp": $.PropertyDesc<_std.$datetime, $.Cardinality.One, false, false, true, true>;
  "cluster": $.LinkDesc<$Cluster, $.Cardinality.One, {}, false, false,  true, false>;
  "status": $.PropertyDesc<_std.$str, $.Cardinality.One, false, true, false, false>;
  "<deployments[is Cluster]": $.LinkDesc<$Cluster, $.Cardinality.Many, {}, false, false,  false, false>;
  "<deployments[is AWSCluster]": $.LinkDesc<$AWSCluster, $.Cardinality.Many, {}, false, false,  false, false>;
  "<deployments[is GCPCluster]": $.LinkDesc<$GCPCluster, $.Cardinality.Many, {}, false, false,  false, false>;
  "<latest_deployment[is GCPCluster]": $.LinkDesc<$GCPCluster, $.Cardinality.Many, {}, false, false,  false, false>;
  "<latest_deployment[is Cluster]": $.LinkDesc<$Cluster, $.Cardinality.Many, {}, false, false,  false, false>;
  "<latest_deployment[is AWSCluster]": $.LinkDesc<$AWSCluster, $.Cardinality.Many, {}, false, false,  false, false>;
  "<deployments": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
  "<latest_deployment": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $TerraformDeployment = $.ObjectType<"default::TerraformDeployment", $TerraformDeploymentλShape, null, [
  ..._std.$Object_8ce8c71ee4fa5f73840c22d7eaa58588['__exclusives__'],
]>;
const $TerraformDeployment = $.makeType<$TerraformDeployment>(_.spec, "943777e4-2dc8-11ef-9d04-4734cc0e8a45", _.syntax.literal);

const TerraformDeployment: $.$expr_PathNode<$.TypeSet<$TerraformDeployment, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($TerraformDeployment, $.Cardinality.Many), null);

export type $current_userλShape = $.typeutil.flatten<$UserλShape & {
}>;
type $current_user = $.ObjectType<"default::current_user", $current_userλShape, null, [
  ...$User['__exclusives__'],
]>;
const $current_user = $.makeType<$current_user>(_.spec, "1573ad08-29a7-11ef-ba87-c9e2e9d229f4", _.syntax.literal);

const current_user: $.$expr_PathNode<$.TypeSet<$current_user, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($current_user, $.Cardinality.Many), null);

const $default__globals: {  current_user: _.syntax.$expr_Global<
              // "default::current_user",
              $current_user,
              $.Cardinality.AtMostOne
              >} = {  current_user: _.syntax.makeGlobal(
              "default::current_user",
              $.makeType(_.spec, "1573ad08-29a7-11ef-ba87-c9e2e9d229f4", _.syntax.literal),
              $.Cardinality.AtMostOne) as any};



export { Address, BigIntString, CloudProvider, IpAddress, IpAddressWithMask, Secp256k1PrivateKey, TerraformAction, $User, User, $Cluster, Cluster, $AWSCluster, AWSCluster, $ServiceAccount, ServiceAccount, $AWSServiceAccount, AWSServiceAccount, $Container, Container, $ContainerTemplate, ContainerTemplate, $DockerAccount, DockerAccount, $GCPCluster, GCPCluster, $GCPServiceAccount, GCPServiceAccount, $InfernetNode, InfernetNode, $TerraformDeployment, TerraformDeployment, $current_user, current_user };

type __defaultExports = {
  "Address": typeof Address;
  "BigIntString": typeof BigIntString;
  "CloudProvider": typeof CloudProvider;
  "IpAddress": typeof IpAddress;
  "IpAddressWithMask": typeof IpAddressWithMask;
  "Secp256k1PrivateKey": typeof Secp256k1PrivateKey;
  "TerraformAction": typeof TerraformAction;
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
  "TerraformDeployment": typeof TerraformDeployment;
  "current_user": typeof current_user;
  "global": typeof $default__globals
};
const __defaultExports: __defaultExports = {
  "Address": Address,
  "BigIntString": BigIntString,
  "CloudProvider": CloudProvider,
  "IpAddress": IpAddress,
  "IpAddressWithMask": IpAddressWithMask,
  "Secp256k1PrivateKey": Secp256k1PrivateKey,
  "TerraformAction": TerraformAction,
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
  "TerraformDeployment": TerraformDeployment,
  "current_user": current_user,
  "global": $default__globals
};
export default __defaultExports;
