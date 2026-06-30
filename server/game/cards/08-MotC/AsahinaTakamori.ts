import DrawCard from '../../DrawCard.js';
import { CardType, Duration, Players } from '../../Constants.js';
import type { TriggeredAbilityContext } from '../../TriggeredAbilityContext.js';
import AbilityDsl from '../../abilitydsl.js';

class AsahinaTakamori extends DrawCard {
    static id = 'asahina-takamori';

    setupCardAbilities() {
        this.reaction({
            title: 'Pacify a character',
            when: {
                onCardPlayed: (event, context) => event.player === context.player && event.card.type === CardType.Character && event.card.isFaction('crane')
            },
            target: {
                controller: Players.Opponent,
                cardType: CardType.Character,
                cardCondition: (card, context) => card.costLessThan((((context as TriggeredAbilityContext<DrawCard>).event.card as DrawCard).getCost() ?? 0) + 1),
                gameAction: AbilityDsl.actions.cardLastingEffect({
                    duration: Duration.UntilEndOfRound,
                    effect: [
                        AbilityDsl.effects.cannotBeDeclaredAsAttacker(),
                        AbilityDsl.effects.cannotBeDeclaredAsDefender()
                    ]
                })
            },
            effect: 'prevent {0} from being declared as an attacker or defender this round'
        });
    }
}


export default AsahinaTakamori;
