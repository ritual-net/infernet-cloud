import * as z from 'yup';

import { Container } from '../schema';

export { Container } from '../schema';

export const FormData = z.object({
	container: Container,
});
