import { CardType, Location, Trait } from '../../Constants.js';
import { PlayCharacterAsAttachment } from '../../PlayCharacterAsAttachment.js';
import { moveCard } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';
import { msg } from '../../GameChat.js';
import { topCards } from '../topCards.js';

export default class AncientMaster extends DrawCard {
    static id = 'ancient-master';

    override setupCardAbilities() {
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
                cardCondition: (card) => card.hasTrait(Trait.Kiho) || card.hasTrait(Trait.Tattoo),
                gameAction: moveCard({
                    destination: Location.Hand
                })
            })
            .chatText((context) => msg`look at the ${topCards(5, context.player.conflictDeck.length, true)} of their deck`)
            .attachmentText();
    }
}
