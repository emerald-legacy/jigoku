import EventWindow from './EventWindow.js';
import { AbilityTypes } from '../Constants.js';

export default class ThenEventWindow extends EventWindow {
    openWindow(abilityType: AbilityTypes) {
        if(abilityType !== AbilityTypes.ForcedReaction && abilityType !== AbilityTypes.Reaction && abilityType !== AbilityTypes.DuelReaction) {
            super.openWindow(abilityType);
        }
    }

    resetCurrentEventWindow() {
        if(this.previousEventWindow) {
            for(const event of this.events) {
                this.previousEventWindow.addEvent(event);
            }
        }
        super.resetCurrentEventWindow();
    }
}
