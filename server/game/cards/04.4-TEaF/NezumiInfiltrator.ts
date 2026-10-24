import { Trait } from '../../Constants.js';
import { msg } from '../../GameChat.js';
import { perConflict } from '../../AbilityLimit.js';
import { immunity, modifyProvinceStrength } from '../../effects.js';
import { cardLastingEffect, chooseAction } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';

export default class NezumiInfiltrator extends DrawCard {
    static id = 'nezumi-infiltrator';

    override setupCardAbilities() {
        this.persistentEffect({
            effect: [
                immunity({
                    appliesTo: { trait: Trait.Maho }
                }),
                immunity({
                    appliesTo: { trait: Trait.Shadowlands }
                })
            ]
        });

        this.reaction('Change attacked province\'s strength')
            .when({
                onCharacterEntersPlay: (event, context) => event.card === context.source && this.game.isDuringConflict()
            })
            .selectAttackedProvince(() => ({
                gameAction: (province) => chooseAction(() => ({
                    choices: {
                        'Raise attacked province\'s strength by 1': {
                            action: cardLastingEffect({
                                effect: modifyProvinceStrength(1)
                            }),
                            message: (_context, target, player) => msg`${player} chooses to increase ${target}'s strength by 1`
                        },
                        'Lower attacked province\'s strength by 1': {
                            action: cardLastingEffect(() => ({
                                effect: province.getStrength() > 1 ? modifyProvinceStrength(-1) : []
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
