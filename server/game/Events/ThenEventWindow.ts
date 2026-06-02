import EventWindow from './EventWindow.js';
import { AbilityType } from '../Constants.js';

export default class ThenEventWindow extends EventWindow {
    openWindow(abilityType: AbilityType) {
        if(abilityType !== AbilityType.ForcedReaction && abilityType !== AbilityType.Reaction && abilityType !== AbilityType.DuelReaction) {
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
