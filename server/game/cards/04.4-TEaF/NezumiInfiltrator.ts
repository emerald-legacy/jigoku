import { CardType, Location } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';
import { immunity, modifyProvinceStrength } from '../../effects.js';
import { cardLastingEffect, chooseAction } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';

export default class NezumiInfiltrator extends DrawCard {
    static id = 'nezumi-infiltrator';

    setupCardAbilities() {
        this.persistentEffect({
            effect: [
                immunity({
                    restricts: 'maho'
                }),
                immunity({
                    restricts: 'shadowlands'
                })
            ]
        });

        this.reaction('Change attacked province\'s strength')
            .when({
                onCharacterEntersPlay: (event, context) => event.card === context.source && this.game.isDuringConflict()
            })
            .selectCard((context) => ({
                activePromptTitle: 'Choose an attacked province',
                hidePromptIfSingleCard: true,
                cardType: CardType.Province,
                location: Location.Provinces,
                cardCondition: (card) => card.isConflictProvince(),
                subActionProperties: (card) => {
                    context.target = card;
                    return { target: card };
                },
                gameAction: chooseAction(() => ({
                    options: {
                        'Raise attacked province\'s strength by 1': {
                            action: cardLastingEffect({
                                targetLocation: Location.Provinces,
                                effect: modifyProvinceStrength(1)
                            }),
                            message: '{0} chooses to increase {1}\'s strength by 1'
                        },
                        'Lower attacked province\'s strength by 1': {
                            action: cardLastingEffect((context) => ({
                                targetLocation: Location.Provinces,
                                effect:
                                    (context.target?.isProvinceCard() ? context.target.getStrength() : 0) > 1
                                        ? modifyProvinceStrength(-1)
                                        : []
                            })),
                            message: '{0} chooses to reduce {1}\'s strength by 1'
                        }
                    }
                }))
            }))
            .effect('change the province strength of an attacked province')
            .max(AbilityDsl.limit.perConflict(1));
    }
}
