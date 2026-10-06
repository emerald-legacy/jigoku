import DrawCard from '../../DrawCard.js';
import { CardType, Duration, Players } from '../../Constants.js';
import { cannotBeDeclaredAsAttacker, cannotBeDeclaredAsDefender } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';

class AsahinaTakamori extends DrawCard {
    static id = 'asahina-takamori';

    setupCardAbilities() {
        this.reaction('Pacify a character')
            .when({
                onCardPlayed: (event, context) => event.player === context.player && event.card.type === CardType.Character && event.card.isFaction('crane')
            })
            .target({
                controller: Players.Opponent,
                cardType: CardType.Character,
                cardCondition: (card, context) => card.costLessThan((context.event.card.getCost() ?? 0) + 1)
            }, cardLastingEffect({
                duration: Duration.UntilEndOfRound,
                effect: [
                    cannotBeDeclaredAsAttacker(),
                    cannotBeDeclaredAsDefender()
                ]
            }))
            .effect('prevent {0} from being declared as an attacker or defender this round');
    }
}


export default AsahinaTakamori;
