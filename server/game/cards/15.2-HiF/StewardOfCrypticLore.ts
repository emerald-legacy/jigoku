import { msg } from '../../GameChat.js';
import { Element } from '../../Constants.js';
import { modifyPoliticalSkill, modifyProvinceStrength } from '../../effects.js';
import { cardLastingEffect, selectAttackedProvince } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';

const ELEMENT = 'steward-of-cryptic-lore-earth';

export default class StewardOfCrypticLore extends DrawCard {
    static id = 'steward-of-cryptic-lore';

    override setupCardAbilities() {
        this.dire({
            effect: modifyPoliticalSkill(3)
        });

        this.action('Changes the strength of the attacked province')
            .condition((context) => context.game.isDuringConflict(this.getCurrentElementSymbol(ELEMENT)))
            .select({
                'Raise attacked province\'s strength by 3': selectAttackedProvince({
                    message: (context, province) => msg`${context.player} chooses to increase ${province}'s strength by 3`,
                    gameAction: cardLastingEffect({ effect: modifyProvinceStrength(3) })
                }),
                'Lower attacked province\'s strength by 3': selectAttackedProvince({
                    message: (context, province) => msg`${context.player} chooses to reduce ${province}'s strength by 3`,
                    gameAction: cardLastingEffect({ effect: modifyProvinceStrength(-3) })
                })
            })
            .chatText('change the province strength of an attacked province');
    }

    protected override printedElementSymbols = [
        {
            key: ELEMENT,
            prettyName: 'Conflict Type',
            element: Element.Earth
        }
    ];
}
