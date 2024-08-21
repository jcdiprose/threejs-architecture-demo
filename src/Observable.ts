export class Observable {
  observers: Map<string, ((item: unknown) => void | unknown)[]>
  private static instance: Observable
  constructor() {
    this.observers = new Map()
  }

  // Static method to get the singleton instance
  static getInstance(): Observable {
    if (!Observable.instance) {
      Observable.instance = new Observable()
    }
    return Observable.instance
  }

  addObserver<T>(label: string, callback: (e: unknown) => void | unknown) {
    const observer = this.observers.get(label) || []
    observer.push(callback)
    this.observers.set(label, observer)
  }

  emit<T>(label: string, e: T) {
    const observers = this.observers.get(label)

    if (observers && observers.length) {
      observers.forEach((callback) => {
        callback(e)
      })
    }
  }
}

export default Observable.getInstance()
