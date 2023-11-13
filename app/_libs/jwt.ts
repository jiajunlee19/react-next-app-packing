import jwt, { JwtPayload } from 'jsonwebtoken';
import { parsedEnv } from './zod_env';

type TSignInOption = {
    expiresIn?: string | number,
};

const defaultSignInOption: TSignInOption = {
    expiresIn: '1hr', 
};

export function signJwtToken(payload: JwtPayload, options: TSignInOption = defaultSignInOption) {
    const token = jwt.sign(payload, parsedEnv.NEXTAUTH_SECRET, options);
    return token
};

export function verifyJwtToken(token: string) {
    try {
        const decoded = jwt.verify(token, parsedEnv.NEXTAUTH_SECRET);
        return decoded
        
    } catch (error) {
        console.log(error);
        return null
    }
};