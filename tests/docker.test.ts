import { test } from 'vitest'
import { getCreds, getTag, getRepos, getOrgs } from '$utils/docker'
import { GET as getDockerIds } from '$api/containers/+server'

test('DockerHub creds obtained.', async () => {
    const creds = await getCreds()
});

test('DockerHub orgs obtained.', async () => {
    const creds = await getCreds()
    const orgs = await getOrgs(creds.orgHeaders)
});

test('Tagged repo functions work.', async () => {
    const creds = await getCreds()
    const orgs = await getOrgs(creds.orgHeaders)
    const orgRepos = await getRepos(orgs[0], creds.repoHeaders)
    const userRepos = await getRepos(creds.user, creds.repoHeaders)
});

test('Container GET function works.', async () => {
    const dockerIds = await getDockerIds()
});