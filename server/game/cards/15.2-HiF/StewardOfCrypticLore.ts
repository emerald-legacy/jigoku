import { CardType, Element, Location } from '../../Constants.js';
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
                        'Raise attacked province\'s strength by 3': {
                            action: cardLastingEffect(() => ({
                                targetLocation: Location.Provinces,
                                effect: modifyProvinceStrength(3)
                            })),
                            message: '{0} chooses to increase {1}\'s strength by 3'
                        },
                        'Lower attacked province\'s strength by 3': {
                            action: cardLastingEffect(() => ({
                                targetLocation: Location.Provinces,
                                effect: modifyProvinceStrength(-3)
                            })),
                            message: '{0} chooses to reduce {1}\'s strength by 3'
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
