import type { AbilityContext } from '../../../AbilityContext.js';
import type { Cost } from '../../../costs/Cost.js';
import { CardType } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';
import { controlsShugenja } from '../../controlsShugenja.js';

function resourcesAvailable(context: AbilityContext) {
    return {
        honorAvailable: context.game.actions.loseHonor().canAffect(context.player, context),
        fateAvailable: context.game.actions.loseFate().canAffect(context.player, context)
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
                ? context.game.actions.loseHonor({ amount: 1 })
                : context.game.actions.loseFate({ amount: 1 });
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
            }, AbilityDsl.actions.multiple([
                AbilityDsl.actions.taint(),
                AbilityDsl.actions.onAffinity({
                    trait: 'air',
                    gameAction: AbilityDsl.actions.gainHonor(context => ({
                        target: context.player,
                        amount: 1
                    })),
                    effect: 'gain 1 honor'
                })
            ]))
            .effect('taint {1}', (context) => [context.target]);
    }

    canPlay(context: AbilityContext, playType: string) {
        return controlsShugenja(context.player) && super.canPlay(context, playType);
    }
}
