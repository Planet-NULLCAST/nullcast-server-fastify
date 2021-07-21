import { Static, Type } from '@sinclair/typebox';

//-- Schema Body --//

export const User = Type.Object({
        id: Type.Optional(
            Type.Number({ format: 'uuid' })    
        ),
        userName: Type.String(),
        fullName: Type.String(),
        email: Type.String({ format: 'email' }),
        password: Type.String({ format: 'password' }),
        coverImage: Type.Optional(
            Type.String({ format: 'uri' })
        ),
        bio: Type.Optional(
            Type.String({ maxLength: 200 })
        ),
        createdAt: Type.String({ format: 'date-time' }),
        updatedAt: Type.String({ format: 'date-time' }),
        // status ?
    });

//-- Success Body(common)--// 
const SuccessBody = Type.Object({
    message: Type.String()       // response objects(data) can be modified by ajv to set default values
});

//-- Error Body(common) --//

const ErrorBody = Type.Object({
    message: Type.String()
});

//-- Types --//

export type UserType = Static<typeof User>  
export type SuccessResponse = Static<typeof SuccessBody>  
export type ErrorResponse = Static<typeof ErrorBody>  

//-- Schemas --//

export const createUserSchema = {
    schema: {
        body: User,
        response: {
            201: {
                description: 'User created successfully message',
                SuccessBody
            },
            400: {
                description: 'Bad Request',
                ErrorBody
            } 
        },
    }
}
