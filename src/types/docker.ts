export type DockerHubCreds = {
	username: string;
	password: string; // Personal Access Token
};

export type DockerHubHeaders = {
	repoHeaders: {
		Authorization: string;
	};
	orgHeaders: {
		Authorization: string;
	};
};

export type DockerHubRepo = {
	namespace: string;
	name: string;
};

export type DockerHubOrg = {
	orgname: string;
};
