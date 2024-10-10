// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from "next-auth";

// declare module "next-auth" {
//     interface Session {
//         // data: {
//             user: {
//                 id: string;
//                 username: string;
//                 email: string;

//             };
            
//             tokens: {
//                 accessToken: string;
//                 refreshToken: string;
//                 //TODO add this in back response
//                 expiresIn: number;
//             }
//         // }
//     }
// }
declare module "next-auth" {
    interface Session {
      user: {
        id: number;
        email: string;
        name: string;
      };
  
      tokens: {
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
      };
    }
  }
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { JWT } from "next-auth/jwt";

declare module "next-auth/jwt" {
  interface JWT {
    user: {
      id: number;
      email: string;
      name: string;
    };

    tokens: {
      accessToken: string;
      refreshToken: string;
      expiresIn: number;
    };
  }
}
