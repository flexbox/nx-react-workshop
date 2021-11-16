/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  addProviderToModule,
  getTsSourceFile,
} from '@nrwl/angular/src/utils/nx-devkit/ast-utils';
import { readJsonFile, Tree } from '@nrwl/devkit';
import { insertImport } from '@nrwl/workspace/src/generators/utils/insert-import';
import { replaceInFile } from '../utils';

export default function update(host: Tree) {
  const { herokuName } = readJsonFile('.nx-workshop.json');
  host.write(
    'apps/store/src/environments/environment.prod.ts',
    `export const environment = {
  production: true,
  apiUrl: 'https://${herokuName}.herokuapp.com'
};
`
  );
  host.write(
    'apps/store/src/environments/environment.ts',
    `export const environment = {
  production: false,
  apiUrl: ''
};
`
  );

  const modulePath = 'apps/store/src/app/app.module.ts';
  let sourceFile = getTsSourceFile(host, modulePath);
  sourceFile = addProviderToModule(
    host,
    sourceFile,
    modulePath,
    `{
  provide: 'baseUrl',
  useValue: environment.apiUrl
}`
  );
  insertImport(host, modulePath, 'environment', '../environments/environment');

  const appComponentPath = `apps/store/src/app/app.component.ts`;
  insertImport(host, appComponentPath, 'Inject', '@angular/core');
  replaceInFile(
    host,
    appComponentPath,
    `constructor(private http: HttpClient)`,
    `constructor(private http: HttpClient, @Inject('baseUrl') private baseUrl: string)`
  );
  replaceInFile(
    host,
    appComponentPath,
    "games = this.http.get<Game[]>('/api/games');",
    'games = this.http.get<Game[]>(`${this.baseUrl}/api/games`);'
  );

  const gameDetailComponentPath = `libs/store/feature-game-detail/src/lib/game-detail/game-detail.component.ts`;
  insertImport(host, gameDetailComponentPath, 'Inject', '@angular/core');
  replaceInFile(
    host,
    gameDetailComponentPath,
    `constructor(private route: ActivatedRoute, private http: HttpClient)`,
    `constructor(private route: ActivatedRoute, private http: HttpClient, @Inject('baseUrl') private baseUrl: string)`
  );
  replaceInFile(
    host,
    gameDetailComponentPath,
    'this.http.get<Game>(`/api/games/${id}`)',
    'this.http.get<Game>(`${this.baseUrl}/api/games/${id}`)'
  );
}
