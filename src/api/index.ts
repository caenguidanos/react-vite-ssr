import express, { Request, Response } from "express";

const router = express.Router();

router.get("/hello", (_req: Request, res: Response) => {
   res.status(200);
   res.send("World");

   res.end();
});

export default router;
