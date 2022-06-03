import { NextApiRequest, NextApiResponse } from 'next';

export default function Locations(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({
    locations: [
      {
        name: 'Eusoff Hall',
        locations: [
          'Nana\'s Thai Food',
          'Al Ammans',
        ],
      },
      {
        name: 'Raffles Hall',
        locations: [],
      },
    ],
  });
}
