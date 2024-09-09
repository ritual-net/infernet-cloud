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
	resources: {
		name: string;
		type: string;
		mode: string;
		instances: {
			attributes: {
				tags?: {
					Name: string;
				};
				id: string;
				arn?: string;
				self_link?: string;
				[key: string]: any;
			}
			dependencies: string[];
			id: string;
		}[];
	}[];
	check_results: boolean | null;
};
