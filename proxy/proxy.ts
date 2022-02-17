import crypto from 'crypto'
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
  abstract getBeans: () => number
}

class GetMyBeansApi implements IGetMyBeansApi {
  beans: number = 10
  getBeans = () => this.beans
}

class BeansProxy {
  cache: object = {}

  constructor(private beansApi: IGetMyBeansApi) {}

  getBeans = () => {
    if (this.cache['beans'] == null) {
      console.log('called from BeansProxy')
      return (this.cache['beans'] = this.beansApi.getBeans())
    }
  }
}

const bproxy = new BeansProxy(new GetMyBeansApi())

// console.log(bproxy.getBeans())
// console.log(bproxy)

// ────────────────────────────────────────────────────────────
//

type SubscribableFn<T> = (msg: T) => void

function makeSubscribable<T>() {
  const subs: Set<SubscribableFn<T>> = new Set()

  return {
    subscribe(cb: SubscribableFn<T>): VoidFunction {
      subs.add(cb)

      return () => {
        // cleanup
        subs.delete(cb)
      }
    },

    publish(data: T): void {
      subs.forEach((cb) => cb(data))
    },
  }
}

type ObservableData<T> = {
  target: T
  prop: string
}

type Observable<T> = T & {
  subscribe: (cb: (data: ObservableData<T>) => void) => void
}

function makeObservable<T>(data: T): Observable<T> {
  const subs = makeSubscribable<ObservableData<T>>()

  return new Proxy(
    { ...data, subscribe: subs.subscribe },
    {
      set: function (target: object, prop: string, value: any) {
        console.log('target', target, '\nprop', prop, '\nval', value)

        subs.publish({ target, prop } as unknown as ObservableData<T>)

        return Reflect.set(target, prop, value)
      },
    }
  ) as Observable<T>
}

interface Message {
  m1: string
  m2: string
}

const data: Message = {
  m1: 'hi',
  m2: 'mom',
}

const proxy = makeObservable(data)
proxy.subscribe(console.log)
proxy.m1 = 'fml'

const user = {
  name: 'any',
  age: '69',
  city: 'N/A',
}

function sha256(value: string) {
  return crypto.createHash('sha256').update(value).digest('hex')
}

function encryptObject(obj: object) {
  let newObj = {}

  for (const key of Object.keys(obj)) {
    newObj[key] = sha256(obj[key])
  }

  console.log(newObj)
}

encryptObject(user)
