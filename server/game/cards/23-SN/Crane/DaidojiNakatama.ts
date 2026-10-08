import { cardCannot } from '../../../effects.js';
import { dishonor, multiple, ready } from '../../../GameActions/GameActions.js';
import { CardType, Players } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class DaidojiNakatama extends DrawCard {
    static id = 'daidoji-nakatama';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.source.isAttacking() && context.game.currentConflict?.getNumberOfParticipantsFor('attacker') === 1,
            effect: [
                cardCannot({
                    cannot: 'sendHome',
                    restricts: 'opponentsCardEffects'
                }),
                cardCannot({
                    cannot: 'moveToConflict',
                    restricts: 'opponentsCardEffects'
                })
            ]
        });

        this.action('Ready and dishonor a character')
            .target({
                cardType: CardType.Character,
                controller: Players.Any,
                cardCondition: (card, context) => card !== context.source && card.costLessThan(4) && card.bowed
            }, multiple([
                ready(),
                dishonor()
            ]))
            .chatText('ready and dishonor {0}');
    }
}
