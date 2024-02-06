import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import clientPromise from '../../../../lib/mongodb';
import { getServerSession } from 'next-auth';

const authEmails = ['gpratik9259@gmail.com'];

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    session: ( {session, token, user} ) => {
      if(authEmails.includes(session?.user?.email)) {
        return session;
      } else {
        throw 'Admin access required!';
      }
    }
  }
};

export async function isAdminRequest(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if(!authEmails.includes(session?.user?.email)) {
    res.status(401);
    res.end();
    throw 'Admin access required!';
  }
}

export default NextAuth(authOptions);