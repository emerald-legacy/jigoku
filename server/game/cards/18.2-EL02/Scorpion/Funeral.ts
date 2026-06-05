import AbilityDsl from '../../../abilitydsl.js';
import { EventName, FavorType, Location, Phases, Stage } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import { EventRegistrar } from '../../../EventRegistrar.js';
import type { AbilityContext } from '../../../AbilityContext.js';
import type { TriggeredAbilityContext } from '../../../TriggeredAbilityContext.js';
import type { EventPayload } from '../../../Events/EventPayloads.js';

export default class Funeral extends DrawCard {
    static id = 'funeral';

    private eventRegistrar?: EventRegistrar;

    public setupCardAbilities() {
        this.eventRegistrar = new EventRegistrar(this.game, this);
        this.eventRegistrar.register([EventName.OnCardPlayed]);

        this.wouldInterrupt({
            title: 'Cancel honor loss',
            when: {
                onModifyHonor: (event: EventPayload<EventName.OnModifyHonor>, context: AbilityContext) =>
                    event.player === context.player &&
                    -(event.amount ?? 0) >= context.player.honor &&
                    event.context?.stage === Stage.Effect,
                onTransferHonor: (event: EventPayload<EventName.OnTransferHonor>, context: AbilityContext) =>
                    event.player === context.player &&
                    (event.amount ?? 0) >= context.player.honor &&
                    event.context?.stage === Stage.Effect
            },
            cannotBeMirrored: true,
            effect: 'cancel their honor loss, then gain 1 honor',
            gameAction: AbilityDsl.actions.sequential([
                AbilityDsl.actions.cancel(),
                AbilityDsl.actions.gainHonor((context) => ({ target: context.player }))
            ])
        });
    }

    public canPlay(context: TriggeredAbilityContext, playType: string) {
        return (
            context.game.currentPhase !== Phases.Draw &&
            context.game.getFavorSide() === FavorType.Political &&
            super.canPlay(context, playType)
        );
    }

    public onCardPlayed(event: EventPayload<EventName.OnCardPlayed>) {
        if(event.card === this) {
            if(this.location !== Location.RemovedFromGame) {
                this.game.addMessage('{0} is removed from the game due the effects of {0}', this);
                this.owner.moveCard(this, Location.RemovedFromGame);
            }
        }
    }
}
