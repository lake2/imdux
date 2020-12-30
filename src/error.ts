export const notInitialized = '[Imdux] Do not call Module.query or Module.dispatch before initializing it using createStore.';
export const wrongModify = '[Imdux] Do not modify value of store directly, use dispatch instead.';
export const payloadNotValid =
    '[Imdux] Payload should always be a plain object or a primitive type value, other value will be replace as undefined. ' +
    '\nTo disable this warn, please set payloadNotValidWarn = false on createStore. See more information: http://www.baidu.com';
export const moreThanOneDot = '[Imdux] There should be only one dot in action name or reducer name.';
