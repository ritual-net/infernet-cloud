export enum TFAction {
	Init = 'Init',
	Plan = 'Plan',
	Apply = 'Apply',
	Destroy = 'Destroy',
}

export type TFState = {
	version: number;
	terraform_version: string;
	serial: number;
	lineage: string;
	outputs: {
		nodes?: {
			value?: {
				id: string;
				ip: string;
				key: string;
			}[];
		};
		router?: {
			value?: {
				id: string;
				ip: string;
			};
		};
	};
	resources: object[];
	check_results: boolean | null;
};
