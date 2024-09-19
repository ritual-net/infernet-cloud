// GENERATED by @edgedb/generate v0.4.1

import * as $ from "../reflection";
import * as _ from "../imports";
import type * as _std from "./std";
import type * as _auth from "./ext/auth";
export type $Address = $.ScalarType<"std::str", string>;
const Address: $.scalarTypeWithConstructor<_std.$str, never> = $.makeType<$.scalarTypeWithConstructor<_std.$str, never>>(_.spec, "cb66871c-6ebb-11ef-b17d-3bf3250130b2", _.syntax.literal);

export type $BigIntString = $.ScalarType<"std::str", string>;
const BigIntString: $.scalarTypeWithConstructor<_std.$str, never> = $.makeType<$.scalarTypeWithConstructor<_std.$str, never>>(_.spec, "cc9d960c-6ebb-11ef-9853-0d8150de90f6", _.syntax.literal);

export type $CloudProvider = {
  "AWS": $.$expr_Literal<$CloudProvider>;
  "GCP": $.$expr_Literal<$CloudProvider>;
} & $.EnumType<"default::CloudProvider", ["AWS", "GCP"]>;
const CloudProvider: $CloudProvider = $.makeType<$CloudProvider>(_.spec, "c0423188-6ebb-11ef-a47c-219def5bd5a5", _.syntax.literal);

export type $IpAddress = $.ScalarType<"std::str", string>;
const IpAddress: $.scalarTypeWithConstructor<_std.$str, never> = $.makeType<$.scalarTypeWithConstructor<_std.$str, never>>(_.spec, "cb67a9b2-6ebb-11ef-80cb-c72bf69d5faf", _.syntax.literal);

export type $IpAddressWithMask = $.ScalarType<"std::str", string>;
const IpAddressWithMask: $.scalarTypeWithConstructor<_std.$str, never> = $.makeType<$.scalarTypeWithConstructor<_std.$str, never>>(_.spec, "cb68a8f8-6ebb-11ef-a476-099b7b38bb79", _.syntax.literal);

export type $Secp256k1PrivateKey = $.ScalarType<"std::str", string>;
const Secp256k1PrivateKey: $.scalarTypeWithConstructor<_std.$str, never> = $.makeType<$.scalarTypeWithConstructor<_std.$str, never>>(_.spec, "cc86729c-6ebb-11ef-8fad-c53f1a392df4", _.syntax.literal);

export type $TerraformAction = {
  "Init": $.$expr_Literal<$TerraformAction>;
  "Plan": $.$expr_Literal<$TerraformAction>;
  "Apply": $.$expr_Literal<$TerraformAction>;
  "Destroy": $.$expr_Literal<$TerraformAction>;
} & $.EnumType<"default::TerraformAction", ["Init", "Plan", "Apply", "Destroy"]>;
const TerraformAction: $TerraformAction = $.makeType<$TerraformAction>(_.spec, "ce1b82a0-6ebb-11ef-985a-53c0bdd3949c", _.syntax.literal);

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
const $User = $.makeType<$User>(_.spec, "c0312c58-6ebb-11ef-ad8c-e15c7f45bbf0", _.syntax.literal);

const User: $.$expr_PathNode<$.TypeSet<$User, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($User, $.Cardinality.Many), null);

export type $ClusterλShape = $.typeutil.flatten<_std.$Object_8ce8c71ee4fa5f73840c22d7eaa58588λShape & {
  "service_account": $.LinkDesc<$ServiceAccount, $.Cardinality.One, {}, false, false,  true, false>;
  "locked": $.PropertyDesc<_std.$bool, $.Cardinality.One, false, false, false, true>;
  "name": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, false, false>;
  "ip_allow_http": $.PropertyDesc<$.ArrayType<$IpAddressWithMask>, $.Cardinality.AtMostOne, false, false, false, false>;
  "ip_allow_ssh": $.PropertyDesc<$.ArrayType<$IpAddressWithMask>, $.Cardinality.AtMostOne, false, false, false, false>;
  "deployments": $.LinkDesc<$TerraformDeployment, $.Cardinality.Many, {}, false, true,  false, false>;
  "latest_deployment": $.LinkDesc<$TerraformDeployment, $.Cardinality.AtMostOne, {}, false, true,  false, false>;
  "status": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, true, false, false>;
  "region": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, false, false>;
  "zone": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, false, false>;
  "nodes": $.LinkDesc<$InfernetNode, $.Cardinality.Many, {}, true, false,  false, false>;
  "router_state": $.PropertyDesc<$.NamedTupleType<{id: _std.$str, ip: _std.$str}>, $.Cardinality.AtMostOne, false, true, false, false>;
  "router": $.PropertyDesc<$.NamedTupleType<{region: _std.$str, zone: _std.$str, machine_type: _std.$str, machine_image: _std.$str}>, $.Cardinality.AtMostOne, false, false, false, false>;
  "provider_id": $.PropertyDesc<_std.$str, $.Cardinality.One, false, true, false, false>;
  "<cluster[is InfernetNode]": $.LinkDesc<$InfernetNode, $.Cardinality.Many, {}, false, false,  false, false>;
  "<cluster[is TerraformDeployment]": $.LinkDesc<$TerraformDeployment, $.Cardinality.Many, {}, false, false,  false, false>;
  "<cluster": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $Cluster = $.ObjectType<"default::Cluster", $ClusterλShape, null, [
  ..._std.$Object_8ce8c71ee4fa5f73840c22d7eaa58588['__exclusives__'],
  {name: {__element__: _std.$str, __cardinality__: $.Cardinality.One | $.Cardinality.AtMostOne },service_account: {__element__: $ServiceAccount, __cardinality__: $.Cardinality.One | $.Cardinality.AtMostOne },},
  {nodes: {__element__: $InfernetNode, __cardinality__: $.Cardinality.One | $.Cardinality.AtMostOne },},
]>;
const $Cluster = $.makeType<$Cluster>(_.spec, "c058c88a-6ebb-11ef-b8fa-e30fd44e131b", _.syntax.literal);

const Cluster: $.$expr_PathNode<$.TypeSet<$Cluster, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($Cluster, $.Cardinality.Many), null);

export type $AWSClusterλShape = $.typeutil.flatten<$ClusterλShape & {
}>;
type $AWSCluster = $.ObjectType<"default::AWSCluster", $AWSClusterλShape, null, [
  ...$Cluster['__exclusives__'],
]>;
const $AWSCluster = $.makeType<$AWSCluster>(_.spec, "c089ece4-6ebb-11ef-bfed-210343ccc30f", _.syntax.literal);

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
const $ServiceAccount = $.makeType<$ServiceAccount>(_.spec, "c0423b38-6ebb-11ef-9ad5-f9366bc74f2e", _.syntax.literal);

const ServiceAccount: $.$expr_PathNode<$.TypeSet<$ServiceAccount, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($ServiceAccount, $.Cardinality.Many), null);

export type $AWSServiceAccountλShape = $.typeutil.flatten<Omit<$ServiceAccountλShape, "provider"> & {
  "creds": $.PropertyDesc<$.NamedTupleType<{user_name: _std.$str, access_key_id: _std.$str, status: _std.$str, secret_access_key: _std.$str, create_date: _std.$str}>, $.Cardinality.One, false, false, false, false>;
  "provider": $.PropertyDesc<$CloudProvider, $.Cardinality.One, false, false, false, true>;
}>;
type $AWSServiceAccount = $.ObjectType<"default::AWSServiceAccount", $AWSServiceAccountλShape, null, [
  ...$ServiceAccount['__exclusives__'],
]>;
const $AWSServiceAccount = $.makeType<$AWSServiceAccount>(_.spec, "c0a9080e-6ebb-11ef-bf71-e794d2156cd2", _.syntax.literal);

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
const $Container = $.makeType<$Container>(_.spec, "c03c8e9a-6ebb-11ef-9fbe-bb5b64eb0593", _.syntax.literal);

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
const $ContainerTemplate = $.makeType<$ContainerTemplate>(_.spec, "c0e681c0-6ebb-11ef-b269-b7ec267fe886", _.syntax.literal);

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
const $DockerAccount = $.makeType<$DockerAccount>(_.spec, "c9f818c8-6ebb-11ef-aeed-47cbae306173", _.syntax.literal);

const DockerAccount: $.$expr_PathNode<$.TypeSet<$DockerAccount, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($DockerAccount, $.Cardinality.Many), null);

export type $GCPClusterλShape = $.typeutil.flatten<$ClusterλShape & {
}>;
type $GCPCluster = $.ObjectType<"default::GCPCluster", $GCPClusterλShape, null, [
  ...$Cluster['__exclusives__'],
]>;
const $GCPCluster = $.makeType<$GCPCluster>(_.spec, "c1172776-6ebb-11ef-aa3c-1371beb168b0", _.syntax.literal);

const GCPCluster: $.$expr_PathNode<$.TypeSet<$GCPCluster, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($GCPCluster, $.Cardinality.Many), null);

export type $GCPServiceAccountλShape = $.typeutil.flatten<Omit<$ServiceAccountλShape, "provider"> & {
  "creds": $.PropertyDesc<$.NamedTupleType<{type: _std.$str, project_id: _std.$str, private_key_id: _std.$str, private_key: _std.$str, client_email: _std.$str, client_id: _std.$str, auth_uri: _std.$str, token_uri: _std.$str, auth_provider_x509_cert_url: _std.$str, client_x509_cert_url: _std.$str, universe_domain: _std.$str}>, $.Cardinality.One, false, false, false, false>;
  "provider": $.PropertyDesc<$CloudProvider, $.Cardinality.One, false, false, false, true>;
}>;
type $GCPServiceAccount = $.ObjectType<"default::GCPServiceAccount", $GCPServiceAccountλShape, null, [
  ...$ServiceAccount['__exclusives__'],
]>;
const $GCPServiceAccount = $.makeType<$GCPServiceAccount>(_.spec, "c1385888-6ebb-11ef-9afc-c171c0223c51", _.syntax.literal);

const GCPServiceAccount: $.$expr_PathNode<$.TypeSet<$GCPServiceAccount, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($GCPServiceAccount, $.Cardinality.Many), null);

export type $InfernetNodeλShape = $.typeutil.flatten<_std.$Object_8ce8c71ee4fa5f73840c22d7eaa58588λShape & {
  "containers": $.LinkDesc<$Container, $.Cardinality.Many, {}, true, false,  false, false>;
  "chain_enabled": $.PropertyDesc<_std.$bool, $.Cardinality.One, false, false, false, true>;
  "forward_stats": $.PropertyDesc<_std.$bool, $.Cardinality.One, false, false, false, true>;
  "max_gas_limit": $.PropertyDesc<_std.$int64, $.Cardinality.AtMostOne, false, false, false, false>;
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
  "machine_type": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, false, false>;
  "region": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, false, false>;
  "zone": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, false, false>;
  "state": $.PropertyDesc<$.NamedTupleType<{id: _std.$str, ip: _std.$str}>, $.Cardinality.AtMostOne, false, true, false, false>;
  "provider": $.PropertyDesc<$CloudProvider, $.Cardinality.AtMostOne, false, true, false, false>;
  "chain_id": $.PropertyDesc<_std.$int64, $.Cardinality.AtMostOne, false, false, false, false>;
  "machine_image": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, false, false>;
  "provider_id": $.PropertyDesc<_std.$str, $.Cardinality.One, false, true, false, false>;
  "<nodes[is Cluster]": $.LinkDesc<$Cluster, $.Cardinality.AtMostOne, {}, false, false,  false, false>;
  "<nodes[is AWSCluster]": $.LinkDesc<$AWSCluster, $.Cardinality.AtMostOne, {}, false, false,  false, false>;
  "<nodes[is GCPCluster]": $.LinkDesc<$GCPCluster, $.Cardinality.AtMostOne, {}, false, false,  false, false>;
  "<nodes": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $InfernetNode = $.ObjectType<"default::InfernetNode", $InfernetNodeλShape, null, [
  ..._std.$Object_8ce8c71ee4fa5f73840c22d7eaa58588['__exclusives__'],
  {containers: {__element__: $Container, __cardinality__: $.Cardinality.One | $.Cardinality.AtMostOne },},
]>;
const $InfernetNode = $.makeType<$InfernetNode>(_.spec, "c03f5436-6ebb-11ef-9136-bb3babf7db2f", _.syntax.literal);

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
  "command": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, false>;
  "status": $.PropertyDesc<_std.$str, $.Cardinality.One, false, true, false, false>;
  "tfvars": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, false>;
  "<deployments[is Cluster]": $.LinkDesc<$Cluster, $.Cardinality.Many, {}, false, false,  false, false>;
  "<deployments[is AWSCluster]": $.LinkDesc<$AWSCluster, $.Cardinality.Many, {}, false, false,  false, false>;
  "<deployments[is GCPCluster]": $.LinkDesc<$GCPCluster, $.Cardinality.Many, {}, false, false,  false, false>;
  "<latest_deployment[is Cluster]": $.LinkDesc<$Cluster, $.Cardinality.Many, {}, false, false,  false, false>;
  "<latest_deployment[is AWSCluster]": $.LinkDesc<$AWSCluster, $.Cardinality.Many, {}, false, false,  false, false>;
  "<latest_deployment[is GCPCluster]": $.LinkDesc<$GCPCluster, $.Cardinality.Many, {}, false, false,  false, false>;
  "<deployments": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
  "<latest_deployment": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $TerraformDeployment = $.ObjectType<"default::TerraformDeployment", $TerraformDeploymentλShape, null, [
  ..._std.$Object_8ce8c71ee4fa5f73840c22d7eaa58588['__exclusives__'],
]>;
const $TerraformDeployment = $.makeType<$TerraformDeployment>(_.spec, "cd134154-6ebb-11ef-b3bf-17c54e70a486", _.syntax.literal);

const TerraformDeployment: $.$expr_PathNode<$.TypeSet<$TerraformDeployment, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($TerraformDeployment, $.Cardinality.Many), null);

export type $current_userλShape = $.typeutil.flatten<$UserλShape & {
}>;
type $current_user = $.ObjectType<"default::current_user", $current_userλShape, null, [
  ...$User['__exclusives__'],
]>;
const $current_user = $.makeType<$current_user>(_.spec, "c03c50ce-6ebb-11ef-afaa-e7a64e8a9c02", _.syntax.literal);

const current_user: $.$expr_PathNode<$.TypeSet<$current_user, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($current_user, $.Cardinality.Many), null);

type uuid_to_base36λFuncExpr<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$uuid>>,
> = $.$expr_Function<
  _std.$str, $.cardutil.paramCardinality<P1>
>;
function uuid_to_base36<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$uuid>>,
>(
  uuid: P1,
): uuid_to_base36λFuncExpr<P1>;
function uuid_to_base36(...args: any[]) {
  const {returnType, cardinality, args: positionalArgs, namedArgs} = _.syntax.$resolveOverload('default::uuid_to_base36', args, _.spec, [
    {args: [{typeId: "00000000-0000-0000-0000-000000000100", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000101"},
  ]);
  return _.syntax.$expressionify({
    __kind__: $.ExpressionKind.Function,
    __element__: returnType,
    __cardinality__: cardinality,
    __name__: "default::uuid_to_base36",
    __args__: positionalArgs,
    __namedargs__: namedArgs,
  }) as any;
};

const $default__globals: {  current_user: _.syntax.$expr_Global<
              // "default::current_user",
              $current_user,
              $.Cardinality.AtMostOne
              >} = {  current_user: _.syntax.makeGlobal(
              "default::current_user",
              $.makeType(_.spec, "c03c50ce-6ebb-11ef-afaa-e7a64e8a9c02", _.syntax.literal),
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
  "uuid_to_base36": typeof uuid_to_base36;
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
  "uuid_to_base36": uuid_to_base36,
  "global": $default__globals
};
export default __defaultExports;
