import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Location, PlayType, CardType } from '../../Constants.js';

class InServiceToMyLord extends DrawCard {
    static id = 'in-service-to-my-lord';

    setupCardAbilities() {
        this.persistentEffect({
            location: Location.ConflictDiscardPile,
            effect: AbilityDsl.effects.canPlayFromOwn(Location.ConflictDiscardPile, [this], this, PlayType.Other)
        });
        this.action({
            title: 'Ready a character',
            cost: AbilityDsl.costs.bow({
                cardType: CardType.Character,
                cardCondition: (card) => !card.isUnique()
            }),
            target: {
                activePromptTitle: 'Choose a unique character',
                cardType: CardType.Character,
                cardCondition: (card) => card.isUnique(),
                gameAction: AbilityDsl.actions.multiple([
                    AbilityDsl.actions.ready(),
                    AbilityDsl.actions.moveCard((context) => ({
                        target: context.source,
                        destination: Location.ConflictDeck,
                        bottom: true
                    }))
                ])
            },
            effect: 'ready {0}.  {1} is placed on the bottom of {2}\'s conflict deck',
            effectArgs: (context) => [context.source, context.source.owner]
        });
    }
}


export default InServiceToMyLord;
