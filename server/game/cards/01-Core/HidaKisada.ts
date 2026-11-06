import { msg } from '../../GameChat.js';
import { AbilityType, CardType, EffectName, EventName, Players } from '../../Constants.js';
import { EffectBuilder } from '../../Effects/EffectBuilder.js';
import { EventRegistrar } from '../../EventRegistrar.js';
import type { Event } from '../../Events/Event.js';
import type { GameEvent } from '../../Events/EventPayloads.js';
import DrawCard from '../../DrawCard.js';

export default class HidaKisada extends DrawCard {
    static id = 'hida-kisada';

    private firstActionEvent = new Map<string, Event>();

    public override setupCardAbilities() {
        // bookkeeping only, so a copy of the ability knows which action came first
        const registrar = new EventRegistrar(this.game);
        registrar.registerTriggerWindow(EventName.OnInitiateAbilityEffects, AbilityType.WouldInterrupt, (event) => this.recordFirstAction(event));
        registrar.register({
            [EventName.OnConflictDeclared]: () => this.firstActionEvent.clear()
        });

        this.persistentEffect({
            targetController: Players.Opponent,
            effect: EffectBuilder.player.detached(EffectName.CancelFirstAction, {
                apply: (player, context) => {
                    const cancels = new EventRegistrar(this.game);
                    cancels.registerTriggerWindow(EventName.OnInitiateAbilityEffects, AbilityType.OtherEffects, (event) => {
                        if(
                            event.context.player === player &&
                            this.firstActionEvent.get(player.uuid) === event &&
                            !event.cancelled &&
                            !this.game.conflictRecord.some((conflict) => conflict.winner === context.player.opponent)
                        ) {
                            event.cancel();
                            this.game.addMessage(msg`${player} attempts to initiate ${event.card}${event.card.type === CardType.Event ? '' : '\'s ability'}, but ${context.source} cancels it`);
                        }
                    });
                    return cancels;
                },
                unapply: (_player, _context, cancels) => cancels.unregisterAll()
            })
        });
    }

    private recordFirstAction(event: GameEvent<EventName.OnInitiateAbilityEffects>) {
        if(
            !event.resolvedWithoutTriggering &&
            !this.firstActionEvent.has(event.context.player.uuid) &&
            this.game.isDuringConflict() &&
            event.context.ability.abilityType === AbilityType.Action &&
            !event.context.ability.isKeywordAbility() &&
            !event.context.ability.cannotBeCancelled
        ) {
            this.firstActionEvent.set(event.context.player.uuid, event);
        }
    }
}
