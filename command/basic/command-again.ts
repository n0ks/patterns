export class Light {
  private on = false;
  private intensity = 0;

  constructor(public name: string) {}

  getStatus() {
    return this.on ? "on" : "off";
  }

  turnOn() {
    this.on = true;
    return this.on;
  }

  turnOff() {
    this.on = false;
    return this.on;
  }

  addIntensity() {
    this.intensity += 10;
    return this.intensity;
  }

  decreaseIntensity() {
    this.intensity -= 10;
    return this.intensity;
  }
}

interface ILightCommand {
  exec(): void;
  undo(): void;
}

class LightPowerCommand implements ILightCommand {
  constructor(private readonly light: Light) {}

  exec(): void {
    console.log(`light ${this.light.name} is being called [ON]`);

    this.light.turnOn();
  }
  undo(): void {
    console.log(`light ${this.light.name} is being called [OFF]`);
    this.light.turnOff();
  }
}

class Invoker {
  private commands: { [k: string]: ILightCommand } = {};

  addCommand(key: string, command: ILightCommand) {
    this.commands[key] = command;
  }
  execCommand(key: string) {
    console.log(`executing ${key} from invoker`);
    this.commands[key].exec();
  }
  undoCommand(key: string) {
    console.log(`executing ${key} from invoker`);
    this.commands[key].undo();

  }
}

let lightCommand = new LightPowerCommand(new Light("room"));
let invoker = new Invoker();

invoker.addCommand("power", lightCommand);

invoker.execCommand("power");
invoker.undoCommand("power");
