import { msg } from '../../GameChat.js';
import { CardType, Location } from '../../Constants.js';
import { perConflict } from '../../AbilityLimit.js';
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
                    choices: {
                        'Raise attacked province\'s strength by 1': {
                            action: cardLastingEffect({
                                targetLocation: Location.Provinces,
                                effect: modifyProvinceStrength(1)
                            }),
                            message: (_context, target, player) => msg`${player} chooses to increase ${target}'s strength by 1`
                        },
                        'Lower attacked province\'s strength by 1': {
                            action: cardLastingEffect((context) => ({
                                targetLocation: Location.Provinces,
                                effect:
                                    (context.target?.isProvinceCard() ? context.target.getStrength() : 0) > 1
                                        ? modifyProvinceStrength(-1)
                                        : []
                            })),
                            message: (_context, target, player) => msg`${player} chooses to reduce ${target}'s strength by 1`
                        }
                    }
                }))
            }))
            .chatText('change the province strength of an attacked province')
            .max(perConflict(1));
    }
}
