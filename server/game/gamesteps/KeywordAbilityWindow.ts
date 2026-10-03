import ForcedTriggeredAbilityWindow from './ForcedTriggeredAbilityWindow.js';
import type Game from '../Game.js';
import type { AbilityType } from '../Constants.js';
import type EventWindow from '../Events/EventWindow.js';
import { Event } from '../Events/Event.js';
import type { TriggerChoice } from '../TriggeredAbility.js';

class KeywordAbilityWindow extends ForcedTriggeredAbilityWindow {
    constructor(game: Game, abilityType: AbilityType, window: EventWindow, eventsToExclude: Event[] = []) {
        super(game, abilityType, window, eventsToExclude);
    }

    addChoice(context: TriggerChoice): void {
        if(!(context.event instanceof Event && context.event.cancelled) && !this.hasAbilityBeenTriggered(context) && context.ability && context.ability.isKeywordAbility()) {
            this.choices.push(context);
        }
    }
}

export default KeywordAbilityWindow;
