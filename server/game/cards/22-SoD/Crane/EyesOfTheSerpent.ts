import { CardTypes } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';
import type { TriggeredAbilityContext } from '../../../TriggeredAbilityContext';

const resourcesAvailable = (context) => {
    let honorAvailable = false;
    let fateAvailable = false;
    if(context.game.actions.loseHonor().canAffect(context.player, context)) {
        honorAvailable = true;
    }

    if(context.game.actions.loseFate().canAffect(context.player, context)) {
        fateAvailable = true;
    }

    return { honorAvailable, fateAvailable };
};

const eyesOfTheSerpentCost = function () {
    return {
        getCostMessage(context: TriggeredAbilityContext) {
            return ['paying 1 {1}', context.costs.serpentCostPaid];
        },
        getActionName(_context: TriggeredAbilityContext) {
            return 'eyesOfTheSerpentCost';
        },
        canPay: function (context: TriggeredAbilityContext) {
            const { honorAvailable, fateAvailable } = resourcesAvailable(context);
            return honorAvailable || fateAvailable;
        },
        resolve: function (context, _result) {
            const { honorAvailable, fateAvailable } = resourcesAvailable(context);
            context.costs.merchantOfCuriositiesCostPaid = false;
            if(honorAvailable && fateAvailable) {
                context.game.promptWithHandlerMenu(context.player, {
                    activePromptTitle: 'Spend 1 honor or 1 fate?',
                    source: context.source,
                    choices: ['Spend 1 honor', 'Spend 1 fate'],
                    handlers: [
                        () => context.costs.serpentCostPaid = 'honor',
                        () => context.costs.serpentCostPaid = 'fate'
                    ]
                });
            } else {
                if(honorAvailable) {
                    context.costs.serpentCostPaid = 'honor';
                } else if(fateAvailable) {
                    context.costs.serpentCostPaid = 'fate';
                }
            }
        },
        payEvent: function (context) {
            let events = [];
            if(context.costs.serpentCostPaid === 'honor') {
                const action = context.game.actions.loseHonor({ amount: 1 });
                events.push(action.getEvent(context.player, context));
            } else {
                const action = context.game.actions.loseFate({ amount: 1 });
                events.push(action.getEvent(context.player, context));
            }
            return events;
        },
        promptsPlayer: true
    };
};

export default class EyesOfTheSerpent extends DrawCard {
    static id = 'eyes-of-the-serpent';

    setupCardAbilities() {
        this.action({
            title: 'Taint a character',
            condition: (context) => context.game.isDuringConflict(),
            cost: eyesOfTheSerpentCost(),
            target: {
                cardType: CardTypes.Character,
                cardCondition: (card) => card.isParticipating() && card.isDishonored,
                gameAction: AbilityDsl.actions.multiple([
                    AbilityDsl.actions.taint(),
                    AbilityDsl.actions.onAffinity((_context) => ({
                        trait: 'air',
                        gameAction: AbilityDsl.actions.gainHonor(context => ({
                            target: context.player,
                            amount: 1
                        })),
                        effect: 'gain 1 honor'
                    }))
                ])
            },
            effect: 'taint {1}',
            effectArgs: (context) => [context.target]
        });
    }

    canPlay(context: TriggeredAbilityContext, playType: string) {
        return (
            context.player.cardsInPlay.any(
                (card) => card.getType() === CardTypes.Character && card.hasTrait('shugenja')
            ) && super.canPlay(context, playType)
        );
    }
}
