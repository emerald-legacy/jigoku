import DrawCard from '../../../DrawCard.js';
import AbilityDsl from '../../../abilitydsl.js';
import { Location } from '../../../Constants.js';
import type BaseCard from '../../../BaseCard.js';

export default class PurveyorOfRarities extends DrawCard {
    static id = 'purveyor-of-rarities';

    setupCardAbilities() {
        this.conflictAction('Discard a card for bonuses')
            .cost(AbilityDsl.costs.discardCard({ location: Location.Hand }))
            .gameAction(AbilityDsl.actions.conditional((context) => ({
                condition: () => this.cardCondition(context.costs.discardCard),
                trueGameAction: AbilityDsl.actions.multiple([
                    AbilityDsl.actions.cardLastingEffect({
                        target: context.source,
                        effect: AbilityDsl.effects.modifyBothSkills(1)
                    }),
                    AbilityDsl.actions.gainFate({
                        target: context.player
                    })
                ]),
                falseGameAction: AbilityDsl.actions.cardLastingEffect({
                    target: context.source,
                    effect: AbilityDsl.effects.modifyBothSkills(3)
                })
            })))
            .effect('give +{1}{2}/+{1}{3} to {4}{5}', context => this.cardCondition(context.costs.discardCard) ?
                [1, 'military', 'political', context.source, ' and gain 1 fate'] :
                [3, 'military', 'political', context.source, ''])
            .max(AbilityDsl.limit.perConflict(1));
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
