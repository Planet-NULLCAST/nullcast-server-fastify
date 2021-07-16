import { Static, Type } from '@sinclair/typebox';

//-- Schema Body --//

export const User = Type.Object({
        id: Type.Optional(
            Type.Number({ format: 'uuid' })
        ),
        username: Type.String(),
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

// // Using JSON schema

// server.post<{ Body: UserType; Response: UserType }>(
//     "/items",
//     {
//         schema: {
//             body: User,
//             response: {
//                 200: User,
//             },
//         },
//     },
//     (req, rep) => {
//         const { body: user } = req;
//         console.log(user);
        
//         // const { name, mail } = user;
//         // let items: UserType[] = [];
//         // const item = {
//         //     name,
//         //     mail
//         // }
//         // items = [...items, item];
//         // const isValid = ajv.validate(User, user);
//         // console.log(isValid);
        
//         rep.status(200).send(user);
//     }
// );