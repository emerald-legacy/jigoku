import EventWindow from './EventWindow.js';
import TriggeredAbilityWindow from '../gamesteps/TriggeredAbilityWindow.js';
import { EventName, AbilityType } from '../Constants.js';
import type Game from '../Game.js';
import type { Event } from './Event.js';
import type { TriggeredAbilityContext } from '../TriggeredAbilityContext.js';

class InitiateAbilityInterruptWindow extends TriggeredAbilityWindow {
    playEvent: any;

    constructor(game: Game, abilityType: AbilityType, eventWindow: EventWindow) {
        super(game, abilityType, eventWindow);
        this.playEvent = eventWindow.events.find(event => event.name === EventName.OnCardPlayed);
    }

    getPromptForSelectProperties() {
        let buttons: Array<{ text: string; arg: string }> = [];
        if(this.playEvent && this.currentPlayer === this.playEvent.player && this.playEvent.resolver.canCancel) {
            buttons.push({ text: 'Cancel', arg: 'cancel' });
        }
        if(this.getMinCostReduction() === 0) {
            buttons.push({ text: 'Pass', arg: 'pass' });
        }
        return Object.assign(super.getPromptForSelectProperties(), {
            buttons: buttons,
            onCancel: () => {
                this.playEvent.resolver.cancelled = true;
                this.complete = true;
            }
        });
    }

    getMinCostReduction(): number {
        if(this.playEvent) {
            const context = this.playEvent.context;
            const alternatePools = context.player.getAlternateFatePools(this.playEvent.playType, context.source, context);
            const alternatePoolTotal = alternatePools.reduce((total: number, pool: any) => total + pool.fate, 0);
            const maxPlayerFate = context.player.checkRestrictions('spendFate', context) ? context.player.fate : 0;
            return Math.max(context.ability.getReducedCost(context) - maxPlayerFate - alternatePoolTotal, 0);
        }
        return 0;
    }

    resolveAbility(context: TriggeredAbilityContext) {
        if(this.playEvent) {
            this.playEvent.resolver.canCancel = false;
        }
        return super.resolveAbility(context);
    }
}

export default class InitiateAbilityEventWindow extends EventWindow {
    eventsToExecute: Event[] = [];

    openWindow(abilityType: AbilityType) {
        if(this.events.length && abilityType === AbilityType.Interrupt) {
            this.queueStep(new InitiateAbilityInterruptWindow(this.game, abilityType, this));
        } else {
            super.openWindow(abilityType);
        }
    }

    executeHandler() {
        this.eventsToExecute = [...this.events].sort((a, b) => a.order - b.order);

        this.eventsToExecute.forEach(event => {
            event.checkCondition();
            if(!event.cancelled) {
                event.executeHandler();
            }
        });

        // We need to separate executing the handler and emitting events as in this window, the handler just
        // queues ability resolution steps, and we don't want the events to be emitted until step 8
        this.game.queueSimpleStep(() => this.emitEvents());
    }

    emitEvents() {
        this.eventsToExecute = this.eventsToExecute.filter(event => !event.cancelled);
        this.eventsToExecute.forEach(event => this.game.emit(event.name, event));
    }
}
