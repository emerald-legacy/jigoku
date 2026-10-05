import { CardType, ConflictType, Players } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';
import { opponentMayResolveAgain } from '../../resolveAgain.js';

export default class TheVoidOfWar extends DrawCard {
    static id = 'the-void-of-war';

    setupCardAbilities() {
        this.action('Each player bows an opponent character until refused')
            .condition((context) => context.game.isDuringConflict(ConflictType.Military))
            .target({
                controller: Players.Opponent,
                player: Players.Opponent,
                cardType: CardType.Character,
                cardCondition: (card) => card.isParticipating()
            }, AbilityDsl.actions.bow())
            .effect('bow {0}')
            .then((context) => opponentMayResolveAgain(context, 'Resolve The Void of War\'s ability again?'));
    }
}
