import StaticEffect from './StaticEffect.js';
import type { AbilityContext } from '../AbilityContext.js';
import type { EffectNames } from '../Constants.js';
import type { EffectTarget } from './EffectBuilder.js';
import type { GameObject } from '../GameObject.js';

type DetachedFunc = (target: EffectTarget, context: AbilityContext, state?: unknown) => unknown;

export default class DetachedEffect extends StaticEffect {
    applyFunc: DetachedFunc;
    unapplyFunc: DetachedFunc;
    state: Record<string, unknown>;

    constructor(type: EffectNames, applyFunc: DetachedFunc, unapplyFunc: DetachedFunc) {
        super(type, undefined);
        this.applyFunc = applyFunc;
        this.unapplyFunc = unapplyFunc;
        this.state = {};
    }

    apply(target: GameObject) {
        this.state[target.uuid] = this.applyFunc(target as EffectTarget, this.context, this.state[target.uuid]);
    }

    unapply(target: GameObject) {
        this.state[target.uuid] = this.unapplyFunc(target as EffectTarget, this.context, this.state[target.uuid]);
        if(this.state[target.uuid] === undefined) {
            delete this.state[target.uuid];
        }
    }

    setContext(context: AbilityContext) {
        this.context = context;
        for(const state of Object.values(this.state)) {
            if(state && typeof state === 'object' && (state as { context?: AbilityContext }).context) {
                (state as { context: AbilityContext }).context = context;
            }
        }
    }
}
