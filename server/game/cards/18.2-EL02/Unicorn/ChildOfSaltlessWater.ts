import AbilityDsl from '../../../abilitydsl.js';
import { CardTypes, Locations } from '../../../Constants.js';
import DrawCard from '../../../drawcard.js';
import type { ProvinceCard } from '../../../ProvinceCard.js';

export default class ChildOfSaltlessWater extends DrawCard {
    static id = 'child-of-saltless-water';

    setupCardAbilities() {
        this.persistentEffect({
            effect: AbilityDsl.effects.delayedEffect({
                condition: (context: any) => !context.source.isParticipating(),
                message: '{0} is discarded from play as it is at home',
                messageArgs: (context: any) => [context.source],
                gameAction: AbilityDsl.actions.discardFromPlay((context) => ({
                    target: context.source
                }))
            })
        });

        this.reaction({
            title: 'Evoke the strength of water!',
            when: {
                onCardPlayed: (event, context) => event.card === context.source
            },
            target: {
                location: Locations.Provinces,
                cardType: CardTypes.Province,
                cardCondition: (card) => card.isConflictProvince()
            },
            gameAction: AbilityDsl.actions.cardLastingEffect((context) => ({
                target: context.source,
                effect: AbilityDsl.effects.setMilitarySkill((context.target as ProvinceCard).printedStrength)
            })),
            effect: 'set it\'s {1} to {2}',
            effectArgs: (context) => ['military', (context.target as ProvinceCard).printedStrength]
        });
    }
}
