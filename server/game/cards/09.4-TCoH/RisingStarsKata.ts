import { CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';
import { modifyMilitarySkill } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';
import { DuelsThisConflict } from '../DuelsThisConflict.js';

export default class RisingStarsKata extends DrawCard {
    static id = 'rising-stars-kata';

    public setupCardAbilities() {
        const duelWinners = DuelsThisConflict.winners(this.game);
        this.action('Give a participating unique character +3 military skill')
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => card.isUnique() && card.isParticipating()
            }, cardLastingEffect((context) => ({
                effect: context.target && duelWinners.has(context.target)
                    ? modifyMilitarySkill(5)
                    : modifyMilitarySkill(3)
            })))
            .effect('give {0} +{1} {2} skill until the end of the conflict', (context) => [duelWinners.has(context.target) ? 5 : 3, 'military'])
            .max(AbilityDsl.limit.perConflict(1));
    }
}
