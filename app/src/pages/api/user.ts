import { type NextApiRequest, type NextApiResponse } from "next";

import { prisma } from "../../server/db/client";

const user = async (req: NextApiRequest, res: NextApiResponse) => {
  const user = await prisma.user.findFirst();
  res.status(200).json(user);
};

export default user;
