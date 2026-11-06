import { CardType, Players, TargetMode, Trait } from '../../../Constants.js';
import * as costs from '../../../costs/index.js';
import { dishonor } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class ABadDeath extends DrawCard {
    static id = 'a-bad-death';

    public override setupCardAbilities() {
        this.reaction('Sacrifice a character to dishonor characters')
            .when({
                afterConflict: (event, context) => event.conflict.loser === context.player && !!context.player.opponent
            })
            .cost(costs.dishonorAndSacrifice({
                cardType: CardType.Character,
                cardCondition: (card) => card.isParticipating()
            }))
            .targetCards({
                mode: TargetMode.UpToVariable,
                numCardsFunc: (context) => context.costs.dishonorAndSacrificeStateWhenChosen?.hasTrait(Trait.Berserker) ? 2 : 1,
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card) => card.isParticipating()
            }, dishonor())
            .draw(1)
            .cannotTargetFirst();
    }
}
