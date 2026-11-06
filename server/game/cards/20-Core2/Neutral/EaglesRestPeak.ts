import { msg } from '../../../GameChat.js';
import { CardType } from '../../../Constants.js';
import { ProvinceCard } from '../../../ProvinceCard.js';
import { lookAt, sequential, setAside } from '../../../GameActions/GameActions.js';
import { shuffle } from '../../../utils/random.js';

export default class EaglesRestPeak extends ProvinceCard {
    static id = 'eagle-s-rest-peak';

    public override setupCardAbilities() {
        this.action('Look at random cards from opponent\'s hand')
            .condition((context) => (context.player.opponent?.hand.length ?? 0) > 0)
            .target({
                activePromptTitle: 'Choose a character to lead the investigation',
                cardType: CardType.Character,
                cardCondition: (card) => card.isDefending() && card.costAtLeast(1)
            })
            .gameAction(sequential((context) => {
                const opponent = context.player.opponent;
                const setAsideCards = shuffle(opponent?.hand ?? [])
                    .slice(0, context.target.getCost() ?? 0);

                return [
                    lookAt({
                        target: setAsideCards,
                        message: (_context, cards) => msg`${opponent} reveals ${cards}`
                    }),
                    setAside({
                        target: setAsideCards,
                        returnAtEndOfConflict: true,
                        message: (_context, cards) => msg`${opponent} sets aside ${cards}`
                    })
                ];
            }))
            .chatText((context) => {
                const amount = Math.min(context.target.getCost() ?? 0, context.player.opponent?.hand.length ?? 0);
                return msg`use the insight of ${context.chatTarget()}, revealing and setting aside ${amount} card${amount === 1 ? '' : 's'} from ${context.player.opponent}'s hand`;
            });
    }
}
