export interface Serialisable {
    toString():string
}

export enum LOG_LEVELS {
    DEBUG, INFO
}  

const LOG_LEVEL = LOG_LEVELS.INFO

export const log = <T extends Serialisable>(l:LOG_LEVELS, msg:(string|number|T), ...args:(string|number|T)[]) => {
    if (l >= LOG_LEVEL) {
        console.log(msg, ...args)
    }
}
