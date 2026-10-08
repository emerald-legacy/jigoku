import { EventName, Phase } from '../../../Constants.js';
import { EventRegistrar } from '../../../EventRegistrar.js';
import * as costs from '../../../costs/index.js';
import {
    conditional,
    draw,
    gainFate,
    gainHonor,
    handler,
    multiple,
    sequential
} from '../../../GameActions/GameActions.js';
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
                    event.phase === Phase.Conflict &&
                    !context.player.getProvinceCardInProvince(context.source.location)?.isBroken
            })
            .cost(costs.sacrificeSelf())
            .gameAction(sequential([
                conditional((context) => ({
                    target: context.player,
                    condition: this.hasAnyCopyTriggered(context.player.name),
                    trueGameAction: gainHonor({ amount: 2 }),
                    falseGameAction: multiple([
                        gainFate({ amount: 2 }),
                        draw({ amount: 2 })
                    ])
                })),
                handler({
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
