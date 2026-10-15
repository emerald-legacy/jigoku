import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { Location, CardType, ConflictType } from '../../Constants.js';
import { changeContributionFunction, contributeToConflict } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';

class HirumaYoshino extends DrawCard {
    static id = 'hiruma-yoshino';

    setupCardAbilities() {
        this.action('Contribute printed military skill')
            .condition((context) => context.game.isDuringConflict(ConflictType.Military) && context.source.isParticipating())
            .target({
                cardType: CardType.Character,
                location: Location.Provinces,
                cardCondition: (card) => card.isInConflictProvince() &&
                    card.printedMilitarySkill > 0
            }, cardLastingEffect({
                targetLocation: Location.Provinces,
                effect: [
                    contributeToConflict((_card, context) => context.player),
                    changeContributionFunction((card) => card.printedMilitarySkill)
                ]
            }))
            .chatText((context) => msg`contribute ${context.chatTarget()}'s printed ${'military'} skill of ${context.target.printedMilitarySkill} to their side of the conflict`);
    }
}


export default HirumaYoshino;
