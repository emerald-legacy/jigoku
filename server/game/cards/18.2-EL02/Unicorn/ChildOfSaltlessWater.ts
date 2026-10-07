import { delayedEffect, setMilitarySkill } from '../../../effects.js';
import { discardFromPlay } from '../../../GameActions/GameActions.js';
import { CardType, Location } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import { msg } from '../../../GameChat.js';

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
            .cardLastingEffect((context) => ({
                effect: setMilitarySkill(context.target.printedStrength)
            }))
            .effect((context) => msg`set its ${'military'} to ${context.target.printedStrength}`);
    }
}
