import { msg } from '../../../GameChat.js';
import { CardType, Element, elementTrait } from '../../../Constants.js';
import { modifyMilitarySkill, modifyPoliticalSkill } from '../../../effects.js';
import { cardLastingEffect } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';
import type { AbilityContext } from '../../../AbilityContext.js';

function bonusBase(context: AbilityContext) {
    return Object.values(Element).filter((element) =>
        context.player.cardsInPlay.some((character) => character.hasTrait(elementTrait(element)))).length;
}

export default class AgashaJianyu extends DrawCard {
    static id = 'agasha-jianyu';

    public override setupCardAbilities() {
        this.conflictAction('Empower a character with the combined strength of the elements', { evenFromHome: true })
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => card.isParticipating()
            }, cardLastingEffect((context) => {
                const bonus = bonusBase(context);
                return {
                    effect: [
                        modifyMilitarySkill(2 * bonus),
                        modifyPoliticalSkill(1 * bonus)
                    ]
                };
            }))
            .chatText((context) => {
                const bonus = bonusBase(context);
                return msg`give ${context.chatTarget()} +${2 * bonus}${'military'}/+${bonus}${'political'}`;
            });
    }
}
