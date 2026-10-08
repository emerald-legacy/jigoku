import { CardType, Players, TargetMode } from '../../../Constants.js';
import * as costs from '../../../costs/index.js';
import { dishonor } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';
import { msg } from '../../../GameChat.js';

export default class ABadDeath extends DrawCard {
    static id = 'a-bad-death';

    public setupCardAbilities() {
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
                numCardsFunc: (context) => context.costs.dishonorAndSacrificeStateWhenChosen?.hasTrait('berserker') ? 2 : 1,
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card) => card.isParticipating()
            }, dishonor())
            .cannotTargetFirst()
            .then()
            .draw(1)
            .message((context) => msg`${context.player} draws a card`);
    }
}
