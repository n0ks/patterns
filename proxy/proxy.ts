import crypto from "crypto";
//  basicaly a placeholder to access another class/object
//
//   ┌──────────┐              ┌───────────────────┐
//   │ Consumer ◄─────────────►│   Proxy           │
//   └──────────┘              │   ┌────────────┐  │
//                             │   │ Datasource │  │
//                             │   └────────────┘  │
//                             └───────────────────┘
//

abstract class IGetMyBeansApi {
  abstract getBeans: () => number;
}

class GetMyBeansApi implements IGetMyBeansApi {
  beans: number = 10;
  getBeans = () => this.beans;
}

class BeansProxy {
  cache: object = {};

  constructor(private beansApi: IGetMyBeansApi) {}

  getBeans = () => {
    if (this.cache["beans"] == null) {
      console.log("called from BeansProxy");
      return (this.cache["beans"] = this.beansApi.getBeans());
    }
  };
}

const bproxy = new BeansProxy(new GetMyBeansApi());

// console.log(bproxy.getBeans())
// console.log(bproxy)

// ────────────────────────────────────────────────────────────
//

type SubscribableFn<T> = (msg: T) => void;

function makeSubscribable<T>() {
  const subs: Set<SubscribableFn<T>> = new Set();

  return {
    subscribe(cb: SubscribableFn<T>): VoidFunction {
      subs.add(cb);

      return () => {
        // cleanup
        subs.delete(cb);
      };
    },

    publish(data: T): void {
      subs.forEach((cb) => cb(data));
    },
  };
}

type ObservableData<T> = {
  target: T;
  prop: string;
};

type Observable<T> = T & {
  subscribe: (cb: (data: ObservableData<T>) => void) => void;
};

function makeObservable<T>(data: T): Observable<T> {
  const subs = makeSubscribable<ObservableData<T>>();

  return new Proxy(
    { ...data, subscribe: subs.subscribe },
    {
      set: function (target: object, prop: string, value: any) {
        console.log("target", target, "\nprop", prop, "\nval", value);

        subs.publish({ target, prop } as unknown as ObservableData<T>);

        return Reflect.set(target, prop, value);
      },
    }
  ) as Observable<T>;
}

interface Message {
  m1: string;
  m2: string;
}

const data: Message = {
  m1: "hi",
  m2: "mom",
};

const proxy = makeObservable(data);
// proxy.subscribe(console.log)
// proxy.m1 = 'fml'

const card = {
  id: 6983839,
  name: "Tornado Dragon",
  type: "XYZ Monster",
  desc: "2 Level 4 monsters\nOnce per turn (Quick Effect): You can detach 1 material from this card, then target 1 Spell/Trap on the field; destroy it.",
  atk: 2100,
  def: 2000,
  level: 4,
  race: "Wyrm",
  attribute: "WIND",
};

type Cards = Record<keyof typeof card, string>;

function sha256(value: string) {
  return crypto.createHash("sha256").update(value.toString()).digest("hex");
}

const o = hashObject<Cards>(card as unknown as Cards);

function hashObject<T extends object>(obj: T): T {
  let newObj = {};
  for (const key of Object.keys(obj)) {
    newObj[key] = sha256(obj[key]);
  }

  console.log(newObj);

  return new Proxy(newObj as unknown as object, {
    set: function (target: object, prop: string, value: any) {
      return (target[prop] = sha256(value)) as unknown as boolean;
    },
    get: function (target, prop) {
      return target[prop] + "ABCD";
    },
  }) as T;
}

function createReactive<T extends object>(
  obj: T,
  observer: (data: any) => void
): T {
  return new Proxy(obj, {
    set: function (target: object, prop: string, value: any) {
      console.log("set called on reactive");

      observer({ [prop]: value });

      return (target[prop] = value);
    },
  }) as T;
}

const reactiveProxy: Cards = createReactive(
  card as unknown as Cards,
  console.log
);

reactiveProxy.atk = "9999999999";
