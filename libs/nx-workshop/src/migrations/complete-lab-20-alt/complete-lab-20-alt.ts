/* eslint-disable @typescript-eslint/no-unused-vars */
import { formatFiles, Tree } from '@nrwl/devkit';
import { insertImport } from '@nrwl/workspace/src/generators/utils/insert-import';
import { tsquery } from '@phenomnomnominal/tsquery';
import { replaceInFile } from '../utils';

export default function update(host: Tree) {
  host.write(
    'apps/store/src/fake-api/index.ts',
    `
  const games = [
    {
      id: 'settlers-in-the-can',
      name: 'Settlers in the Can',
      image: '/assets/beans.png', // 'https://media.giphy.com/media/xUNda3pLJEsg4Nedji/giphy.gif',
      description:
        'Help your bug family claim the best real estate in a spilled can of beans.',
      price: 35,
      rating: Math.random()
    },
    {
      id: 'chess-pie',
      name: 'Chess Pie',
      image: '/assets/chess.png', // 'https://media.giphy.com/media/iCZyBnPBLr0dy/giphy.gif',
      description: 'A circular game of Chess that you can eat as you play.',
      price: 15,
      rating: Math.random()
    },
    {
      id: 'purrfection',
      name: 'Purrfection',
      image: '/assets/cat.png', // 'https://media.giphy.com/media/12xMvwvQXJNx0k/giphy.gif',
      description: 'A cat grooming contest goes horribly wrong.',
      price: 45,
      rating: Math.random()
    }
  ];

  export const getAllGames = () => games;
  export const getGame = (id: string) => games.find(game => game.id === id);
  `
  );

  replaceInFile(
    host,
    `apps/store/src/app/app.component.ts`,
    `games = this.http.get<Game[]>('/api/games');`,
    'games = getAllGames();'
  );
  replaceInFile(
    host,
    `apps/store/src/app/app.component.html`,
    `games | async`,
    'games'
  );

  formatFiles(host);
}
