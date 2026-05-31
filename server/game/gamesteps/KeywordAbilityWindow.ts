import ForcedTriggeredAbilityWindow from './ForcedTriggeredAbilityWindow.js';
import type Game from '../Game.js';
import type { AbilityTypes } from '../Constants.js';
import type EventWindow from '../Events/EventWindow.js';
import type { Event } from '../Events/Event.js';
import type { TriggeredAbilityContext } from '../TriggeredAbilityContext.js';

class KeywordAbilityWindow extends ForcedTriggeredAbilityWindow {
    constructor(game: Game, abilityType: AbilityTypes, window: EventWindow, eventsToExclude: Event[] = []) {
        super(game, abilityType, window, eventsToExclude);
    }

    addChoice(context: TriggeredAbilityContext): void {
        if(!context.event.cancelled && !this.hasAbilityBeenTriggered(context) && context.ability && context.ability.isKeywordAbility()) {
            this.choices.push(context);
        }
    }
}

export default KeywordAbilityWindow;
