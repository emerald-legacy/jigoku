import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';
import { modifyPoliticalSkill } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';

class AsahinaArtisan extends DrawCard {
    static id = 'asahina-artisan';

    setupCardAbilities() {
        this.action('Give a character +0/+3')
            .cost(AbilityDsl.costs.bowSelf())
            .condition(() => this.game.isDuringConflict())
            .target({
                cardType: CardType.Character,
                cardCondition: (card, context) => card !== context.source && card.isFaction('crane')
            }, cardLastingEffect({
                effect: modifyPoliticalSkill(3)
            }))
            .effect('give {0} +3{1} skill', () => 'political');
    }
}


export default AsahinaArtisan;
