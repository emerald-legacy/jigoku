import AbilityDsl from '../../../abilitydsl.js';
import { CardType, TargetMode } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class SerenadeOfAThousandLanterns extends DrawCard {
    static id = 'serenade-of-a-thousand-lanterns';

    setupCardAbilities() {
        this.action('Send characters home')
            .condition((context) => context.player.isTraitInPlay('shugenja'))
            .targetCards('target', {
                activePromptTitle: 'Choose characters adding up to 4 printed cost',
                numCards: Infinity,
                mode: TargetMode.MaxStat,
                cardStat: (card) => card.getCost() ?? 0,
                maxStat: () => 4,
                cardType: CardType.Character,
                cardCondition: (card, _context) => card.isParticipating() && !card.isUnique()
            }, AbilityDsl.actions.sendHome())
            .then((context) => ({
                gameAction: AbilityDsl.actions.onAffinity({
                    trait: 'fire',
                    gameAction: AbilityDsl.actions.gainHonor(() => ({
                        target: context.player,
                        amount: 1
                    })),
                    effect: 'gain 1 honor'
                })
            }))
            .max(AbilityDsl.limit.perConflict(1));
    }
}
