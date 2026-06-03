import { AbilityType, CardType, EventName, Location } from '../../Constants.js';
import { EventRegistrar } from '../../EventRegistrar.js';
import DrawCard from '../../DrawCard.js';

export default class HidaKisada extends DrawCard {
    static id = 'hida-kisada';

    private abilityRegistrar?: EventRegistrar;
    private firstActionEvent = new Map<string, any>();

    public setupCardAbilities() {
        this.abilityRegistrar = new EventRegistrar(this.game, this);
        this.abilityRegistrar.register([
            {
                [EventName.OnInitiateAbilityEffects + ':' + AbilityType.WouldInterrupt]:
                    'onInitiateAbilityEffectsWouldInterrupt'
            }
        ]);
        this.abilityRegistrar.register([
            {
                [EventName.OnInitiateAbilityEffects + ':' + AbilityType.OtherEffects]:
                    'onInitiateAbilityEffectsOtherEffects'
            }
        ]);
        this.abilityRegistrar.register([EventName.OnConflictDeclared]);
    }

    public onInitiateAbilityEffectsWouldInterrupt(event: any) {
        if(
            !this.firstActionEvent.has(event.context.player.uuid) &&
            this.game.isDuringConflict() &&
            event.context.ability.abilityType === 'action' &&
            !event.context.ability.isKeywordAbility() &&
            !event.context.ability.cannotBeCancelled
        ) {
            this.firstActionEvent.set(event.context.player.uuid, event);
        }
    }

    public onInitiateAbilityEffectsOtherEffects(event: any) {
        if(
            this.firstActionEvent.get(event.context.player.uuid) === event &&
            event.context.player === this.controller.opponent &&
            !event.cancelled &&
            this.location === Location.PlayArea &&
            !this.isBlank() &&
            !this.game.conflictRecord.some((conflict) => conflict.winner === this.controller.opponent)
        ) {
            event.cancel();
            this.game.addMessage(
                '{0} attempts to initiate {1}{2}, but {3} cancels it',
                event.context.player,
                event.card,
                event.card.type === CardType.Event ? '' : '\'s ability',
                this
            );
        }
    }

    public onConflictDeclared() {
        this.firstActionEvent.clear();
    }
}
