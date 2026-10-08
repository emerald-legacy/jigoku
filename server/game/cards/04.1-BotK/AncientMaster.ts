import { CardType, Location } from '../../Constants.js';
import { PlayCharacterAsAttachment } from '../../PlayCharacterAsAttachment.js';
import { moveCard } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';

export default class AncientMaster extends DrawCard {
    static id = 'ancient-master';

    setupCardAbilities() {
        this.abilities.playActions.push(new PlayCharacterAsAttachment(this));
        this.reaction('Search top 5 cards for kiho or tattoo')
            .when({
                onConflictDeclared: (event, context) =>
                    context.source.type === CardType.Attachment && (event.attackers ?? []).some((card) => card === context.source.parentCharacter),
                onDefendersDeclared: (event, context) =>
                    context.source.type === CardType.Attachment && event.defenders.some((card) => card === context.source.parentCharacter)
            })
            .deckSearch({
                cardsToLookAt: 5,
                cardCondition: (card) => card.hasTrait('kiho') || card.hasTrait('tattoo'),
                gameAction: moveCard({
                    destination: Location.Hand
                })
            })
            .effect('look at the top five cards of their deck')
            .notPrinted();
    }
}
