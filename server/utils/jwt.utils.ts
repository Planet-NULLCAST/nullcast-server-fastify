import jwt, { JwtPayload } from 'jsonwebtoken';


function verify(token: string) {
  try {
    const verificationStatus = jwt.verify(
      token,
      process.env.JWT_KEY as string,
      { algorithms: ['HS256'] }

    );
    return verificationStatus;
  } catch (error) {
    return;
  }
}

export function verifyToken(token: string) {
  const verificationStatus = verify(token);
  if (
    verificationStatus &&
    typeof verificationStatus === 'object' &&
    Math.floor(Date.now() / 1000) < (verificationStatus as any).exp
  ) {
    return verificationStatus as JwtPayload;
  }

  return;
}

export function getTokenData(token: string) {
  const verificationStatus = verify(token);
  if (verificationStatus && typeof verificationStatus === 'object') {
    return verificationStatus;
  }

  return;
}

export function issueToken(payload: { [x: string]: any }) {
  const token = jwt.sign(
    payload,
    process.env.JWT_KEY as string,
    {
      algorithm: 'HS256',
      expiresIn: parseInt(process.env.JWT_EXPIRY as string, 10)
    }
  );

  return token;
}
