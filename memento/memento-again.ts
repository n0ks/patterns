type Formats = "json" | "pdf" | "yaml";
interface IMemento {
  getFileName(): string;
  getSaveDate(): Date;
}

class FileCommandBackup {
  private stack: IMemento[] = [];

  constructor(private readonly fileConverter: FileConverter) {}

  backup(): void {
    console.log("backing up");

    this.stack.push(this.fileConverter.save());
  }

  undo(): void {
    if (this.stack.length >= 1) {
      let memento = this.stack.pop();
      this.fileConverter.restore(memento!);
      console.log("restored state", memento?.getFileName());
    }
  }

  print(): void {
    for (const item of this.stack) {
      console.log(item);
    }
  }
}

class FileMemento implements IMemento {
  constructor(
    private name: string,
    private date: Date,
    private path: string,
    private format: Formats
  ) {
    console.log(
      "Creating FileMemento -> ",
      this.name,
      this.date.toDateString()
    );
  }

  getFileName(): string {
    return this.name;
  }
  getSaveDate(): Date {
    return this.date;
  }

  getPath(): string {
    return this.path;
  }
  getFormat(): Formats {
    return this.format;
  }
}

class FileConverter {
  constructor(private path: string, private format: Formats) {}

  convert(format: Formats): void {
    this.format = format;
    this.path = this.path.split(".").slice(0, -1).join("");
    this.path += "." + format;
  }

  save(): IMemento {
    let date = new Date();
    return new FileMemento("converter", date, this.path, this.format);
  }

  restore(memento: IMemento): void {
    const fileMemento = memento as FileMemento;
    this.path = fileMemento.getPath();
    this.format = fileMemento.getFormat();
  }
}

const converter = new FileConverter("../package.json", "json");
const converterBackup = new FileCommandBackup(converter);

console.log(converter);
console.log(converterBackup);
converterBackup.backup();

converter.convert("yaml");
converterBackup.backup();

converter.convert("pdf");
converterBackup.backup();

console.log(converterBackup);

converterBackup.undo();
converterBackup.undo();
console.log(converterBackup);

