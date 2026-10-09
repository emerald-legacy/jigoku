import { msg } from '../../GameChat.js';
import { AbilityType, CardType, EventName, Location } from '../../Constants.js';
import { EventRegistrar } from '../../EventRegistrar.js';
import type { Event } from '../../Events/Event.js';
import type { GameEvent } from '../../Events/EventPayloads.js';
import DrawCard from '../../DrawCard.js';

export default class HidaKisada extends DrawCard {
    static id = 'hida-kisada';

    private firstActionEvent = new Map<string, Event>();

    public setupCardAbilities() {
        const abilityRegistrar = new EventRegistrar(this.game);
        abilityRegistrar.registerTriggerWindow(EventName.OnInitiateAbilityEffects, AbilityType.WouldInterrupt, (event) => this.onInitiateAbilityEffectsWouldInterrupt(event));
        abilityRegistrar.registerTriggerWindow(EventName.OnInitiateAbilityEffects, AbilityType.OtherEffects, (event) => this.onInitiateAbilityEffectsOtherEffects(event));
        abilityRegistrar.register({
            [EventName.OnConflictDeclared]: () => this.onConflictDeclared()
        });
    }

    public onInitiateAbilityEffectsWouldInterrupt(event: GameEvent<EventName.OnInitiateAbilityEffects>) {
        if(
            !this.firstActionEvent.has(event.context.player.uuid) &&
            this.game.isDuringConflict() &&
            event.context.ability.abilityType === AbilityType.Action &&
            !event.context.ability.isKeywordAbility() &&
            !event.context.ability.cannotBeCancelled
        ) {
            this.firstActionEvent.set(event.context.player.uuid, event);
        }
    }

    public onInitiateAbilityEffectsOtherEffects(event: GameEvent<EventName.OnInitiateAbilityEffects>) {
        if(
            this.firstActionEvent.get(event.context.player.uuid) === event &&
            event.context.player === this.controller.opponent &&
            !event.cancelled &&
            this.location === Location.PlayArea &&
            !this.isBlank() &&
            !this.game.conflictRecord.some((conflict) => conflict.winner === this.controller.opponent)
        ) {
            event.cancel();
            this.game.addMessage(msg`${event.context.player} attempts to initiate ${event.card}${event.card.type === CardType.Event ? '' : '\'s ability'}, but ${this} cancels it`);
        }
    }

    public onConflictDeclared() {
        this.firstActionEvent.clear();
    }
}
