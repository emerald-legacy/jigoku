import DrawCard from '../../DrawCard.js';
import { CardType, Location, Players } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';
import type { AbilityContext } from '../../AbilityContext.js';

class ShosuroMiyako2 extends DrawCard {
    static id = 'shosuro-miyako-2';

    setupCardAbilities() {
        this.persistentEffect({
            location: Location.Any,
            effect: AbilityDsl.effects.playerCannot({
                cannot: 'playCharacter',
                restricts: 'source'
            })
        });

        this.reaction({
            title: 'Dishonor a character',
            when: {
                onCardPlayed: (event, context) => event.card === context.source
            },
            target: {
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: card => !card.isUnique(),
                gameAction: AbilityDsl.actions.dishonor()
            }
        });
    }

    canDisguise(card: DrawCard, context: AbilityContext, intoConflictOnly: boolean) {
        return !card.isFaction('scorpion') &&
            card.allowGameAction('discardFromPlay', context) &&
            !card.isUnique() &&
            (!intoConflictOnly || card.isParticipating());
    }
}


export default ShosuroMiyako2;
