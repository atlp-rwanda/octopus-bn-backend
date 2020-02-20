import { encode } from 'utils/jwtTokenizer';

export const claims = {
  email: 'octopus@andela.com',
  userId: 'e80a1be0-428d-11ea-9434-ab08a1e03ed1'
};
export const mockToken = encode(claims);
