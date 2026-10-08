import { EffectSource } from '../EffectSource.js';
import type { AbilityContext } from '../AbilityContext.js';
import type Game from '../Game.js';

export interface PromptSourceProperties {
    source?: EffectSource | string;
    context?: AbilityContext;
    waitingPromptTitle?: string;
}

/** A prompt's source as an EffectSource: a given name becomes one, otherwise the context's source. */
export function resolvePromptSource(game: Game, properties: PromptSourceProperties): { source: EffectSource; waitingPromptTitle?: string } {
    let source = properties.source;
    if(typeof source === 'string') {
        source = new EffectSource(game, source);
    } else if(properties.context?.source) {
        source = properties.context.source;
    }
    if(!source) {
        return { source: new EffectSource(game), waitingPromptTitle: properties.waitingPromptTitle };
    }
    return { source, waitingPromptTitle: properties.waitingPromptTitle || 'Waiting for opponent to use ' + source.name };
}
