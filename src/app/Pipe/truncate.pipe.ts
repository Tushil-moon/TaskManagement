import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
  standalone: true,
})
export class TruncatePipe implements PipeTransform {
  private readonly maxLength = 80;

  transform(value: string): string {
    if (value.length > this.maxLength) {
      return value.substring(0, this.maxLength) + '...';
    }
    return value;
  }
}
