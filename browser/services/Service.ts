export default class Service {
  static run(params) {
    const instance = new this();
    return instance.call(params);
  }

  call(params) {
    throw new Error(`Method ".call" must be overridden`);
  }
}
