import AbilityDsl from '../../../abilitydsl.js';
import type { AbilityContext } from '../../../AbilityContext.js';
import { CardType, Location } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class ChildOfSaltlessWater extends DrawCard {
    static id = 'child-of-saltless-water';

    setupCardAbilities() {
        this.persistentEffect({
            effect: AbilityDsl.effects.delayedEffect({
                condition: (context: AbilityContext<this>) => !context.source.isParticipating(),
                message: '{0} is discarded from play as it is at home',
                messageArgs: (context: AbilityContext) => [context.source],
                gameAction: AbilityDsl.actions.discardFromPlay((context) => ({
                    target: context.source
                }))
            })
        });

        this.reaction('Evoke the strength of water!')
            .when({
                onCardPlayed: (event, context) => event.card === context.source
            })
            .target('target', {
                location: Location.Provinces,
                cardType: CardType.Province,
                cardCondition: (card) => card.isConflictProvince()
            })
            .gameAction(AbilityDsl.actions.cardLastingEffect((context) => ({
                target: context.source,
                effect: AbilityDsl.effects.setMilitarySkill(context.target?.printedStrength ?? 0)
            })))
            .effect('set it\'s {1} to {2}', (context) => ['military', context.target?.printedStrength ?? 0]);
    }
}
