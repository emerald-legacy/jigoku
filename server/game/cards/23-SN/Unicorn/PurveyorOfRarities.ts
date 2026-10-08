import DrawCard from '../../../DrawCard.js';
import * as costs from '../../../costs/index.js';
import { perConflict } from '../../../AbilityLimit.js';
import { modifyBothSkills } from '../../../effects.js';
import { Location } from '../../../Constants.js';
import type BaseCard from '../../../BaseCard.js';

export default class PurveyorOfRarities extends DrawCard {
    static id = 'purveyor-of-rarities';

    setupCardAbilities() {
        this.conflictAction('Discard a card for bonuses')
            .cost(costs.discardCard({ location: Location.Hand }))
            .if((context) => this.cardCondition(context.costs.discardCard))
                .cardLastingEffect((context) => ({ target: context.source, effect: modifyBothSkills(1) }))
                .gainFate(1)
            .otherwise()
                .cardLastingEffect((context) => ({ target: context.source, effect: modifyBothSkills(3) }))
            .chatText('give +{1}{2}/+{1}{3} to {4}{5}', context => this.cardCondition(context.costs.discardCard) ?
                [1, 'military', 'political', context.source, ' and gain 1 fate'] :
                [3, 'military', 'political', context.source, ''])
            .max(perConflict(1));
    }

    private cardCondition(discarded: BaseCard | BaseCard[] | undefined) {
        if(!discarded) {
            return false;
        }
        const card = Array.isArray(discarded) ? discarded[0] : discarded;
        return card.hasSomeTrait('gaijin', 'foreign') || this.isOutOfClan(card);
    }

    private isOutOfClan(card: BaseCard): boolean {
        return !card.isFaction('neutral') && !card.isFaction('unicorn');
    }
}
