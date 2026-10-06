import { CardType, Players, TargetMode } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import { dishonor, draw } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class ABadDeath extends DrawCard {
    static id = 'a-bad-death';

    public setupCardAbilities() {
        this.reaction('Sacrifice a character to dishonor characters')
            .when({
                afterConflict: (event, context) => event.conflict.loser === context.player && !!context.player.opponent
            })
            .cost(AbilityDsl.costs.dishonorAndSacrifice({
                cardType: CardType.Character,
                cardCondition: (card) => card.isParticipating()
            }))
            .targetCards({
                mode: TargetMode.UpToVariable,
                numCardsFunc: (context) => context.costs.dishonorAndSacrificeStateWhenChosen?.hasTrait('berserker') ? 2 : 1,
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: card => card.isParticipating()
            }, dishonor())
            .then(() => ({
                message: '{0} draws a card',
                gameAction: draw()
            }))
            .cannotTargetFirst();
    }
}
