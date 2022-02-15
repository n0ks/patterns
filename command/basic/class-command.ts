abstract class Command<S> {
  abstract exec(state: S): S
  abstract undo(state: S): S
}

class CommandStack<S> {
  private stack: Command<S>[] = []

  constructor(private _state: S) {}

  get state() {
    return this._state
  }

  exec(command: Command<S>) {
    this._state = command.exec(this._state)
    this.stack.push(command)
  }

  undo() {
    const command = this.stack.pop()
    if (command) {
      this._state = command.undo(this._state)
    }
  }
}

class AddOne extends Command<number> {
  exec(state: number): number {
    return state + 1
  }

  undo(state: number): number {
    return state - 1
  }
}

class SubtractOne extends Command<number> {
  exec(state: number): number {
    return state - 1
  }

  undo(state: number): number {
    return state + 1
  }
}

class SetValue extends Command<number> {
  private _originalValue?: number

  constructor(private value: number) {
    super()
  }

  exec(_state: number): number {
    this._originalValue = this.value
    return this.value
  }

  undo(_state: number): number {
    return this._originalValue!
  }
}

const cs = new CommandStack<number>(0)

cs.exec(new AddOne())
console.log(cs.state)
cs.exec(new SetValue(42))
console.log(cs.state)
cs.undo()
console.log(cs.state)
