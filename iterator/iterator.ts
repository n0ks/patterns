import { log } from "node:console";

interface ICustomIterator<T> extends Iterator<T> {
  reset(): void;
}

class Inventory {
  private _items: string[] = [];

  iterator: ICustomIterator<string> = new CustomIterator(this);

  addItem(item: string): void {
    this._items.push(item);
  }

  public get items(): string[] {
    return this._items;
  }

  public get size(): number {
    return this._items.length;
  }

  swapIterator(iterator: ICustomIterator<string>): void {
    this.iterator = iterator;
  }

  [Symbol.iterator](): ICustomIterator<string> {
    return this.iterator;
  }
}

class CustomIterator implements ICustomIterator<string> {
  private idx = 0;
  constructor(private readonly data: Inventory) {}

  reset(): void {
    this.idx = 0;
  }

  next(): IteratorResult<string> {
    let value = this.getValue(this.data.items[this.idx]);

    value.done = this.data.size == this.idx;
    this.idx++;

    return value;
  }

  private getValue(value: string): IteratorResult<string> {
    return { value, done: false };
  }
}

let inventory = new Inventory();

inventory.addItem("helmet");
inventory.addItem("armor");
inventory.addItem("boots");
inventory.addItem("pet");


let [item1,item2] = inventory;

inventory.iterator.reset()

for (const item of inventory) {
  console.log(item);
}

