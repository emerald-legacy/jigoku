import { msg } from '../../GameChat.js';
import { Element } from '../../Constants.js';
import { modifyPoliticalSkill, modifyProvinceStrength } from '../../effects.js';
import { cardLastingEffect, chooseAction } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';

const ELEMENT = 'courteous-greeting-earth';

export default class StewardOfCrypticLore extends DrawCard {
    static id = 'steward-of-cryptic-lore';

    setupCardAbilities() {
        this.dire({
            effect: modifyPoliticalSkill(3)
        });

        this.action('Changes the strength of the attacked province')
            .condition((context) => context.game.isDuringConflict(this.getCurrentElementSymbol(ELEMENT)))
            .selectAttackedProvince((context) => ({
                subActionProperties: (card) => {
                    context.target = card;
                    return { target: card };
                },
                gameAction: chooseAction(() => ({
                    choices: {
                        'Raise attacked province\'s strength by 3': {
                            action: cardLastingEffect(() => ({
                                effect: modifyProvinceStrength(3)
                            })),
                            message: (_context, target, player) => msg`${player} chooses to increase ${target}'s strength by 3`
                        },
                        'Lower attacked province\'s strength by 3': {
                            action: cardLastingEffect(() => ({
                                effect: modifyProvinceStrength(-3)
                            })),
                            message: (_context, target, player) => msg`${player} chooses to reduce ${target}'s strength by 3`
                        }
                    }
                }))
            }))
            .chatText('change the province strength of an attacked province');
    }

    getPrintedElementSymbols() {
        const symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: ELEMENT,
            prettyName: 'Conflict Type',
            element: Element.Earth
        });
        return symbols;
    }
}
