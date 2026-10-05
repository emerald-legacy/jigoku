import { EventName, Phases } from '../../../Constants.js';
import { EventRegistrar } from '../../../EventRegistrar.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class PlantedFields extends DrawCard {
    static id = 'planted-fields';

    public triggeredByPlayer = new Set<string>();
    private eventRegistrar?: EventRegistrar;

    public setupCardAbilities() {
        this.eventRegistrar = new EventRegistrar(this.game, this);
        this.eventRegistrar.register([EventName.OnRoundEnded]);

        this.interrupt('Sacrifice Planted Fields')
            .when({
                onPhaseEnded: (event, context) =>
                    event.phase === Phases.Conflict &&
                    !context.player.getProvinceCardInProvince(context.source.location)?.isBroken
            })
            .cost(AbilityDsl.costs.sacrificeSelf())
            .gameAction(AbilityDsl.actions.sequential([
                AbilityDsl.actions.conditional((context) => ({
                    target: context.player,
                    condition: this.hasAnyCopyTriggered(context.player.name),
                    trueGameAction: AbilityDsl.actions.gainHonor({ amount: 2 }),
                    falseGameAction: AbilityDsl.actions.multiple([
                        AbilityDsl.actions.gainFate({ amount: 2 }),
                        AbilityDsl.actions.draw({ amount: 2 })
                    ])
                })),
                AbilityDsl.actions.handler({
                    handler: (context) => this.triggeredByPlayer.add(context.player.name)
                })
            ]))
            .effect('{1}', (context) =>
                this.hasAnyCopyTriggered(context.player.name)
                    ? 'gain 2 honor'
                    : 'gain 2 fate and draw 2 cards');
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
