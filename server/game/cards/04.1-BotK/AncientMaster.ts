import { CardType, Location } from '../../Constants.js';
import { PlayCharacterAsAttachment } from '../../PlayCharacterAsAttachment.js';
import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';

export default class AncientMaster extends DrawCard {
    static id = 'ancient-master';

    setupCardAbilities() {
        this.abilities.playActions.push(new PlayCharacterAsAttachment(this));
        this.reaction('Search top 5 card for kiho or tattoo')
            .when({
                onConflictDeclared: (event, context) =>
                    context.source.type === CardType.Attachment && (event.attackers ?? []).some((card) => card === context.source.parentCharacter),
                onDefendersDeclared: (event, context) =>
                    context.source.type === CardType.Attachment && (event.defenders ?? []).some((card) => card === context.source.parentCharacter)
            })
            .gameAction(AbilityDsl.actions.deckSearch({
                amount: 5,
                cardCondition: (card) => card.hasTrait('kiho') || card.hasTrait('tattoo'),
                gameAction: AbilityDsl.actions.moveCard({
                    destination: Location.Hand
                })
            }))
            .effect('look at the top five cards of their deck')
            .notPrinted();
    }

    leavesPlay() {
        this.printedType = CardType.Character;
        super.leavesPlay();
    }
}
