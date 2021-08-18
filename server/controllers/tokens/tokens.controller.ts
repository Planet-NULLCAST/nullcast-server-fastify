import { getTokenData, issueToken } from 'utils/jwt.utils';

export function generateNewTokenController(token: string) {
  const tokenData = getTokenData(token);
  if (tokenData && typeof tokenData === 'object' && tokenData.user_name) {
    const userToken = issueToken({user_name: tokenData.user_name});
    return userToken;
  }

  return;
}
