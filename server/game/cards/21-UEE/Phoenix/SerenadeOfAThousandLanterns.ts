import AbilityDsl from '../../../abilitydsl.js';
import { CardTypes, TargetModes } from '../../../Constants.js';
import DrawCard from '../../../drawcard.js';

export default class SerenadeOfAThousandLanterns extends DrawCard {
    static id = 'serenade-of-a-thousand-lanterns';

    setupCardAbilities() {
        this.action({
            title: 'Send characters home',
            condition: (context) => context.player.isTraitInPlay('shugenja'),
            target: {
                activePromptTitle: 'Choose characters adding up to 4 printed cost',
                numCards: Infinity,
                mode: TargetModes.MaxStat,
                cardStat: (card) => card.getCost(),
                maxStat: () => 4,
                cardType: CardTypes.Character,
                cardCondition: (card, _context) => card.isParticipating() && !card.isUnique(),
                gameAction: AbilityDsl.actions.sendHome()
            },
            max: AbilityDsl.limit.perConflict(1),
            then: (context: any) => ({
                gameAction: AbilityDsl.actions.onAffinity({
                    trait: 'fire',
                    gameAction: AbilityDsl.actions.gainHonor(() => ({
                        target: context.player,
                        amount: 1
                    })),
                    effect: 'gain 1 honor'
                })
            })
        });
    }
}
