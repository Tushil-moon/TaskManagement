import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  alphabetical,
  boil,
  cluster,
  counting,
  diff,
  first,
  flat,
  fork,
  group,
  intersects,
  iterate,
  last,
  map,
  max,
  objectify,
  replaceOrAppend,
  select,
  shift,
  sift,
  toggle,
  unique,
  zip,
  zipToObject,
} from 'radash';

@Component({
  selector: 'app-radash',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './radash.component.html',
  styleUrl: './radash.component.css',
})
export class RadashComponent {
  multitable: any;

  selectedMethod: string = '';

  methods: string[] = [
    'alphabetical',
    'boil',
    'max',
    'cluster',
    'counting',
    'first',
    'fork',
    'group',
    'iterate',
    'last',
    'objectify',
    'replaceOrAppend',
    'replace',
    'select',
    'intersect',
    'zip',
    'shift',
    'sift',
    'toggle',
    'unique'
  ];

  transformedData: ({ name: string; power: number; culture: string } | null)[] =
    [];

  keyObj: any = [];

  gods = [
    {
      name: 'Ra',
      power: 100,
      culture: 'egypt',
    },
    {
      name: 'Zeus',
      power: 98,
      culture: 'greek',
    },
    {
      name: 'Loki',
      power: 72,
      culture: 'greek',
    },
    {
      name: 'Vishnu',
      power: 110,
      culture: 'Hindu',
    },
  ];

  newData = {
    name: 'Krishna',
    power: 1000,
    culture: 'Hindu',
  };

  getKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  onApply(): void {
    this.keyObj = this.gods;

    switch (this.selectedMethod) {
      case 'alphabetical':
        this.multitable = [alphabetical(this.gods, (g) => g.name)];
        break;

      case 'boil':
        const maxPowerGod = boil(this.gods, (a, b) =>
          a.power > b.power ? a : b
        );
        this.multitable = [[maxPowerGod]];
        break;

      case 'max':
        const highestPowerGod = max(this.gods, (f) => f.power);
        this.multitable = [[highestPowerGod]];
        break;

      case 'cluster':
        const clusters = cluster(this.gods, 2);
        this.multitable = clusters;
        break;

      case 'counting':
        const countData = counting(this.gods, (g) => g.culture);
        const xdata = [[...this.gods], [countData]];
        console.log(xdata);
        this.keyObj = xdata;
        this.multitable = xdata;
        break;

      case 'first':
        const firstGod = first(this.gods);
        console.log([firstGod]);
        this.keyObj = [[firstGod]];
        this.multitable = [[firstGod]];
        break;

      case 'fork':
        const [finalGods, lesserGods] = fork(
          this.gods,
          (f) => f.culture == 'greek'
        );
        this.keyObj = [finalGods, lesserGods];
        this.multitable = [finalGods, lesserGods];
        break;

      case 'group':
        const godsByCulture = group(this.gods, (f) => f.culture);
        console.log(godsByCulture);
        break;

      case 'iterate':
        const totalPower = iterate(
          this.gods.length,
          (acc, idx) => {
            const power = this.gods[idx]['power'];
            console.log(power);
            return acc + power;
          },
          0
        );
        console.log(totalPower);
        break;

      case 'last':
        const data = last(this.gods);
        console.log(data);
        this.keyObj = [[data]];
        this.multitable = [[data]];
        break;

      case 'objectify':
        const newone = objectify(
          this.gods,
          (f) => f.name,
          (f) => f.power
        );
        this.keyObj = [[newone]];
        this.multitable = [[newone]];
        break;

      case 'replaceOrAppend':
        const replacedata = replaceOrAppend(
          this.gods,
          this.newData,
          (f) => f.name === 'Krishna'
        );
        this.keyObj = [replacedata];
        this.multitable = [replacedata];
        break;

      case 'replace':
        const replace = replaceOrAppend(
          this.gods,
          this.newData,
          (f) => f.name === 'Vishnu'
        );
        this.keyObj = [replace];
        this.multitable = [replace];
        break;

      case 'select':
        const selectdata = select(
          this.gods,
          (f) => f.power,
          (f) => f.culture === 'Hindu'
        );
        console.log(selectdata);
        this.keyObj = [selectdata];
        this.multitable = [selectdata];
        break;

      case 'intersect':
        const oceanFish = ['tuna', 'tarpon'];
        const lakeFish = ['bass', 'trout'];
        console.log(oceanFish, lakeFish);
        console.log(intersects(oceanFish, lakeFish));
        break;

      case 'zip':
        const names = ['ra', 'zeus', 'loki'];
        const cultures = ['egypt', 'greek', 'norse'];
        console.log(name, cultures);
        const zipdata = zip(names, cultures);
        console.log(zipdata);
        break;

      case 'shift':
        const shiftdata = shift(this.gods, 2);
        console.log(shiftdata);
        this.keyObj = [shiftdata];
        this.multitable = [shiftdata];
        break;

      case 'sift':
        const fish = ['salmon', null, false, NaN, 'sockeye', 'bass'];
        console.log(fish);
        console.log(sift(fish));
        break;
      case 'toggle':

        const updatedGods = toggle(
          this.gods,
          { name: 'Vishnu', power: 110, culture: 'Hindu'},
          g => g.name
        );
        this.multitable = [updatedGods];
        console.log(updatedGods)
        break;

        case 'unique':
          const uniquedata = unique(
            this.gods,
            g => g.culture
          )
          this.multitable = [uniquedata];
        console.log(uniquedata)
        break;
      default:
        console.warn('Unknown method selected');
        this.multitable = [];
        break;
    }
  }

//  async onclick(){
//     const userIds = ["c969","ad5b", "high", 4]
//     const users = await map(userIds, async (userId) => {
//       return await users.find(userId)
//     })
//   }
}
