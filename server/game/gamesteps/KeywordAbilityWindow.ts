import { TriggerWindow } from './TriggerWindow.js';
import { Event } from '../Events/Event.js';
import type { TriggerChoice } from '../TriggeredAbility.js';

export class KeywordAbilityWindow extends TriggerWindow {
    addChoice(context: TriggerChoice): void {
        if(!(context.event instanceof Event && context.event.cancelled) && !this.hasAbilityBeenTriggered(context) && context.ability && context.ability.isKeywordAbility()) {
            this.choices.push(context);
        }
    }
}

