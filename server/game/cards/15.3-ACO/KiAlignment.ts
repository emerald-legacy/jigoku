import DrawCard from '../../DrawCard.js';
import { Location, TargetMode, Trait } from '../../Constants.js';
import { moveCard } from '../../GameActions/GameActions.js';
import { msg } from '../../GameChat.js';
import { topCards } from '../topCards.js';

class KiAlignment extends DrawCard {
    static id = 'ki-alignment';

    override setupCardAbilities() {
        this.reaction('Search for kihos')
            .when({
                onConflictDeclared: (event, context) => event.conflict.attackingPlayer === context.player && (event.attackers?.some((card) => card.hasTrait(Trait.Monk)) ?? false),
                onDefendersDeclared: (event, context) => event.conflict.defendingPlayer === context.player && event.defenders.some((card) => card.hasTrait(Trait.Monk))
            })
            .deckSearch({
                mode: TargetMode.UpTo,
                cardsToLookAt: 8,
                numCards: 2,
                uniqueNames: true,
                cardCondition: (card) => card.hasTrait(Trait.Kiho),
                gameAction: moveCard({
                    destination: Location.Hand
                })
            })
            .chatText((context) => msg`look at the ${topCards(8, context.player.conflictDeck.length, true)} of their deck for up to two kihos`);
    }
}


export default KiAlignment;
