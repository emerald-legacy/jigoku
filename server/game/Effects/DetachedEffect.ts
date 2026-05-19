import StaticEffect from './StaticEffect.js';
import type { EffectNames } from '../Constants.js';

export default class DetachedEffect extends StaticEffect {
    applyFunc: (target: any, context: any, state: any) => any;
    unapplyFunc: (target: any, context: any, state: any) => any;
    state: Record<string, any>;

    constructor(type: EffectNames, applyFunc: (target: any, context: any, state: any) => any, unapplyFunc: (target: any, context: any, state: any) => any) {
        super(type, undefined);
        this.applyFunc = applyFunc;
        this.unapplyFunc = unapplyFunc;
        this.state = {};
    }

    apply(target: any) {
        this.state[target.uuid] = this.applyFunc(target, this.context, this.state[target.uuid]);
    }

    unapply(target: any) {
        this.state[target.uuid] = this.unapplyFunc(target, this.context, this.state[target.uuid]);
        if(this.state[target.uuid] === undefined) {
            delete this.state[target.uuid];
        }
    }

    setContext(context: any) {
        this.context = context;
        for(const state of Object.values(this.state)) {
            if(state.context) {
                state.context = context;
            }
        }
    }
}
