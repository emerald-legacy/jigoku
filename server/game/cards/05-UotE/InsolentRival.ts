import { dishonor, duel } from '../../GameActions/GameActions.js';
import { modifyBothSkills } from '../../effects.js';
import DrawCard from '../../DrawCard.js';
import { Players, CardType, DuelType } from '../../Constants.js';

class InsolentRival extends DrawCard {
    static id = 'insolent-rival';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => !!(context.player.opponent && context.player.showBid > context.player.opponent.showBid),
            effect: modifyBothSkills(2)
        });

        this.action('Challenge a participating character to a Military duel: dishonor the loser of the duel')
            .condition((context) => context.source.isParticipating())
            .target({
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card) => card.isParticipating()
            }, duel({
                type: DuelType.Military,
                gameAction: (duel) => dishonor({ target: duel.loser })
            }));
    }
}


export default InsolentRival;
