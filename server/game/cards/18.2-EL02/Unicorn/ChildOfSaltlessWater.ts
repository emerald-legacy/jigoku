import { delayedEffect, setMilitarySkill } from '../../../effects.js';
import { cardLastingEffect, discardFromPlay } from '../../../GameActions/GameActions.js';
import { CardType, Location } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class ChildOfSaltlessWater extends DrawCard {
    static id = 'child-of-saltless-water';

    setupCardAbilities() {
        this.persistentEffect({
            effect: delayedEffect({
                condition: (context) => context.source.isDrawCard() && !context.source.isParticipating(),
                message: '{0} is discarded from play as it is at home',
                messageArgs: (context) => [context.source],
                gameAction: discardFromPlay((context) => ({
                    target: context.source
                }))
            })
        });

        this.reaction('Evoke the strength of water')
            .when({
                onCardPlayed: (event, context) => event.card === context.source
            })
            .target({
                location: Location.Provinces,
                cardType: CardType.Province,
                cardCondition: (card) => card.isConflictProvince()
            })
            .gameAction(cardLastingEffect((context) => ({
                effect: setMilitarySkill(context.target.printedStrength)
            })))
            .effect('set its {1} to {2}', (context) => ['military', context.target.printedStrength]);
    }
}
