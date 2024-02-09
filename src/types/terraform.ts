export enum TFAction {
	Apply = 'apply',
	Destroy = 'destroy',
}

export type TFState = {
	version: number;
	terraform_version: string;
	serial: number;
	lineage: string;
	outputs: {
		nodes?: {
			value?: {
				id?: string;
				key?: string;
			}[];
		};
		router_ip?: {
			value: string;
		};
	};
	resources: object[];
	check_results: boolean | null;
};
