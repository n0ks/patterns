type CommandFunction<S> = (state: S) => S;

function createCommandStack<S>(state: S) {
  const stack: string[] = [JSON.stringify(state)];

  return {
    exec(command: CommandFunction<S>) {
      const currentState = JSON.parse(stack[stack.length - 1]);
      const newState = command(currentState);
      stack.push(JSON.stringify(newState));
      return newState;
    },
    undo() {
      if (stack.length > 1) {
        stack.pop();
      }
      return JSON.parse(stack[stack.length - 1]);
    },
  };
}

const addOne: CommandFunction<number> = (state) => state + 1;

const subtractOne: CommandFunction<number> = (state) => state - 1;

const createSetValue = (value: number): CommandFunction<number> => {
  return () => value;
};

const cStack = createCommandStack(-10);

console.log(cStack.exec(addOne));

console.log(cStack.undo());

console.log(cStack.exec(subtractOne));

console.log(cStack.undo());

const setVal = createSetValue(42069);

console.log(cStack.exec(setVal));
console.log(cStack.undo());
