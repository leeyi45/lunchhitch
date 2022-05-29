import { NextApiRequest, NextApiResponse } from "next";

export default function Locations(req: NextApiRequest, res: NextApiResponse) {
    res.status(200).json({
        locations: [
            "Eusoff Hall",
            "Raffles Hall",
            "Clementi Mall"
        ]
    })
}
