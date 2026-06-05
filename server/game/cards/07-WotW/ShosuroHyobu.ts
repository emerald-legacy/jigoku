import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardType, Location } from '../../Constants.js';

class ShosuroHyobu extends DrawCard {
    static id = 'shosuro-hyobu';

    setupCardAbilities() {
        this.reaction({
            title: 'Dishonor a character',
            when: {
                onCardsDiscardedFromHand: (event, context) =>
                    !!event.cards && event.cards.some((a) => a.owner === context.player.opponent) && !!event.context && event.context.ability.isCardAbility(),
                onCardsDiscarded: (event, context) =>
                    !!event.cards && !!event.originalCardStateInfo && event.originalCardStateInfo.some((a) => a.location === Location.Hand && a.owner === context.player.opponent) && !!event.context && event.context.ability.isCardAbility()
            },
            target: {
                cardType: CardType.Character,
                gameAction: AbilityDsl.actions.dishonor()
            }
        });
    }
}


export default ShosuroHyobu;
