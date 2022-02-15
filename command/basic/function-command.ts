type CommandFunction<S> = (state: S) => [S, (state: S) => S]

function createCommandStack<S>(state: S) {
  const stack: ((state: S) => S)[] = []

  let _state = state

  return {
    exec(command: CommandFunction<S>) {
      const [newState, undoFn] = command(_state)
      _state = newState

      stack.push(undoFn)

      return _state
    },

    undo() {
      const command = stack.pop()
      if (command) {
        _state = command(_state)
      }
      return _state
    },
  }
}

const addOne: CommandFunction<number> = (state) => [
  state + 1,
  (state) => state - 1,
]

const subOne: CommandFunction<number> = (state) => [
  state - 1,
  (state) => state + 1,
]

const setVal = (value: number): CommandFunction<number> => {
  return (state) => {
    const _original = state
    return [value, () => _original]
  }
}

const cStack = createCommandStack<number>(0)

console.log(cStack.exec(addOne))

console.log(cStack.undo())

console.log(cStack.exec(subOne))

console.log(cStack.exec(setVal(42)))

