import { InMemoryDbService } from 'angular-in-memory-web-api';

export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const heroes = [
      { id: 11, name: 'Best Hero Duder' },
      { id: 12, name: 'Yikes' },
      { id: 13, name: 'Hello' },
      { id: 14, name: 'It\'s me' },
      { id: 15, name: 'Something' },
      { id: 16, name: 'John' }
    ];
    return {heroes};
  }
}