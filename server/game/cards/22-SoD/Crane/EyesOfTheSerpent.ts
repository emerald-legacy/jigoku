import type { AbilityContext } from '../../../AbilityContext.js';
import type { Cost } from '../../../costs/Cost.js';
import { CardType } from '../../../Constants.js';
import { gainHonor, loseFate, loseHonor, multiple, onAffinity, taint } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';
import { controlsShugenja } from '../../controlsShugenja.js';
import { msg } from '../../../GameChat.js';

function resourcesAvailable(context: AbilityContext) {
    return {
        honorAvailable: loseHonor().canAffect(context.player, context),
        fateAvailable: loseFate().canAffect(context.player, context)
    };
}

function eyesOfTheSerpentCost(): Cost<{ serpentCostPaid: 'honor' | 'fate' }> {
    return {
        getCostMessage(context) {
            return ['paying 1 {1}', context.costs.serpentCostPaid];
        },
        getActionName(_context) {
            return 'eyesOfTheSerpentCost';
        },
        canPay(context) {
            const { honorAvailable, fateAvailable } = resourcesAvailable(context);
            return honorAvailable || fateAvailable;
        },
        resolve(context) {
            const { honorAvailable, fateAvailable } = resourcesAvailable(context);
            if(honorAvailable && fateAvailable) {
                context.game.promptWithHandlerMenu(context.player, {
                    activePromptTitle: 'Spend 1 honor or 1 fate?',
                    source: context.source,
                    options: [
                        { text: 'Spend 1 honor', handler: () => context.costs.serpentCostPaid = 'honor' },
                        { text: 'Spend 1 fate', handler: () => context.costs.serpentCostPaid = 'fate' }
                    ]
                });
            } else if(honorAvailable) {
                context.costs.serpentCostPaid = 'honor';
            } else if(fateAvailable) {
                context.costs.serpentCostPaid = 'fate';
            }
        },
        payEvent(context) {
            const action = context.costs.serpentCostPaid === 'honor'
                ? loseHonor()
                : loseFate();
            return [action.getEvent(context.player, context)];
        },
        promptsPlayer: true
    };
}

export default class EyesOfTheSerpent extends DrawCard {
    static id = 'eyes-of-the-serpent';

    setupCardAbilities() {
        this.action('Taint a character')
            .cost(eyesOfTheSerpentCost())
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => card.isParticipating() && card.isDishonored
            }, multiple([
                taint(),
                onAffinity({
                    trait: 'air',
                    gameAction: gainHonor(context => ({
                        target: context.player
                    })),
                    effect: 'gain 1 honor'
                })
            ]))
            .effect((context) => msg`taint ${context.target}`);
    }

    canPlay(context: AbilityContext, playType: string) {
        return controlsShugenja(context.player) && super.canPlay(context, playType);
    }
}
