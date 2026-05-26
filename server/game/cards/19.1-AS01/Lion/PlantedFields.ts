import { EventNames, Phases } from '../../../Constants.js';
import { EventRegistrar } from '../../../EventRegistrar.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../drawcard.js';

export default class PlantedFields extends DrawCard {
    static id = 'planted-fields';

    public triggeredByPlayer = new Set<string>();
    private eventRegistrar?: EventRegistrar;

    public setupCardAbilities() {
        this.eventRegistrar = new EventRegistrar(this.game, this);
        this.eventRegistrar.register([EventNames.OnRoundEnded]);

        this.interrupt({
            title: 'Sacrifice Planted Fields',
            when: {
                onPhaseEnded: (event: any, context) =>
                    event.phase === Phases.Conflict &&
                    !context.player.getProvinceCardInProvince(context.source.location)?.isBroken
            },
            cost: AbilityDsl.costs.sacrificeSelf(),
            gameAction: AbilityDsl.actions.handler({
                handler: (context) => {
                    if(this.hasAnyCopyTriggered(context.player.name)) {
                        context.player.modifyHonor(2);
                    } else {
                        context.player.modifyFate(2);
                        context.player.drawCardsToHand(2);
                    }
                    this.triggeredByPlayer.add(context.player.name);
                }
            }),
            effect: '{1}',
            effectArgs: (context) =>
                this.hasAnyCopyTriggered(context.player.name)
                    ? 'gain 2 honor'
                    : 'gain 2 fate and draw 2 cards'
        });
    }

    private hasAnyCopyTriggered(playerName: string): boolean {
        return this.game.allCards.some(
            (card) => card instanceof PlantedFields && card.triggeredByPlayer.has(playerName)
        );
    }

    public onRoundEnded() {
        this.triggeredByPlayer.clear();
    }
}
