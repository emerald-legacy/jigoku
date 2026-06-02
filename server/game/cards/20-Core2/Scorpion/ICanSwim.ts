import AbilityDsl from '../../../abilitydsl.js';
import { CardType, Players } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class ICanSwim extends DrawCard {
    static id = 'i-can-swim';

    setupCardAbilities() {
        this.action({
            title: 'Discard a dishonored character',
            condition: (context) => !!(context.player.opponent && context.player.showBid > context.player.opponent.showBid),
            cannotBeMirrored: true,
            target: {
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card) => card.isParticipating() && card.isDishonored,
                gameAction: AbilityDsl.actions.discardFromPlay()
            }
        });
    }
}
