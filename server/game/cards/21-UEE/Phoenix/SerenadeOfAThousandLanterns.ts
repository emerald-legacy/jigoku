import AbilityDsl from '../../../abilitydsl.js';
import { gainHonor, onAffinity, sendHome } from '../../../GameActions/GameActions.js';
import { CardType, TargetMode } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import { controlsShugenja } from '../../controlsShugenja.js';

export default class SerenadeOfAThousandLanterns extends DrawCard {
    static id = 'serenade-of-a-thousand-lanterns';

    setupCardAbilities() {
        this.action('Send characters home')
            .condition((context) => controlsShugenja(context.player))
            .targetCards({
                activePromptTitle: 'Choose characters adding up to 4 printed cost',
                numCards: Infinity,
                mode: TargetMode.MaxStat,
                cardStat: (card) => card.getCost() ?? 0,
                maxStat: () => 4,
                cardType: CardType.Character,
                cardCondition: (card, _context) => card.isParticipating() && !card.isUnique()
            }, sendHome())
            .then((context) => ({
                gameAction: onAffinity({
                    trait: 'fire',
                    gameAction: gainHonor({
                        target: context.player
                    }),
                    effect: 'gain 1 honor'
                })
            }))
            .max(AbilityDsl.limit.perConflict(1));
    }
}
