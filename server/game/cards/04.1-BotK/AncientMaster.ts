import { CardType, Location } from '../../Constants.js';
import { PlayCharacterAsAttachment } from '../../PlayCharacterAsAttachment.js';
import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';

export default class AncientMaster extends DrawCard {
    static id = 'ancient-master';

    setupCardAbilities() {
        this.abilities.playActions.push(new PlayCharacterAsAttachment(this));
        this.reaction({
            title: 'Search top 5 card for kiho or tattoo',
            when: {
                onConflictDeclared: (event, context) =>
                    context.source.type === CardType.Attachment && (event.attackers ?? []).includes(context.source.parent as DrawCard),
                onDefendersDeclared: (event, context) =>
                    context.source.type === CardType.Attachment && (event.defenders ?? []).includes(context.source.parent as DrawCard)
            },
            printedAbility: false,
            effect: 'look at the top five cards of their deck',
            gameAction: AbilityDsl.actions.deckSearch({
                amount: 5,
                cardCondition: (card) => card.hasTrait('kiho') || card.hasTrait('tattoo'),
                gameAction: AbilityDsl.actions.moveCard({
                    destination: Location.Hand
                })
            })
        });
    }

    leavesPlay() {
        this.printedType = CardType.Character;
        super.leavesPlay();
    }
}
