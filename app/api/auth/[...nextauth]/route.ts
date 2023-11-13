import NextAuth from "next-auth";
import { options} from "@/app/_libs/nextAuth_options";

const handler = NextAuth(options);

export { handler as GET, handler as POST };