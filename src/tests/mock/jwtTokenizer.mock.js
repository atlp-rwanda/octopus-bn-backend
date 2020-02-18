import { encode } from 'utils/jwtTokenizer';

export const unRegisteredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im11Z2Fib0BnbWFpbC5jb20iLCJpYXQiOjE1ODIwNDcxMTAsImV4cCI6MTU4MjY1MTkxMH0.RHcZ0xbAPHSHC65zWpt91uTPsYrsR2eoVckbJDw1DHg';
export const claims = {
  email: 'octopus@andela.com',
  userId: 'e80a1be0-428d-11ea-9434-ab08a1e03ed1'
};
export const mockToken = encode(claims);
