import { AbilityContext } from '../../../AbilityContext.js';
import { CardType, Players } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';
import type { Conflict } from '../../../Conflict.js';

function shinobiCount(context: AbilityContext): number {
    return (
        (context.game.currentConflict as Conflict | null)?.getParticipants(
            (card: DrawCard) => card.controller === context.player && card.hasTrait('shinobi')
        )?.length ?? 0
    );
}

export default class SpiderwebPassage extends DrawCard {
    static id = 'spiderweb-passage';

    setupCardAbilities() {
        this.action<DrawCard>({
            title: 'Discard a participating character with 0 skill',
            condition: (context) => shinobiCount(context) > 0,
            cost: AbilityDsl.costs.sacrificeSelf(),
            target: {
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card: DrawCard) =>
                    card.isParticipating() &&
                    ((!card.hasDash('political') && card.getPoliticalSkill() === 0) ||
                        (!card.hasDash('military') && card.getMilitarySkill() === 0))
            },
            gameAction: AbilityDsl.actions.conditional((context) => {
                const discardCount = shinobiCount(context);
                const discardFromHandAction = AbilityDsl.actions.discardAtRandom({
                    amount: discardCount,
                    target: context.player.opponent
                });
                const killAction = AbilityDsl.actions.discardFromPlay({ target: context.target });

                return {
                    condition: () =>
                        context.player.opponent.hand.length >= discardCount &&
                        discardFromHandAction.canAffect(context.player.opponent, context),
                    falseGameAction: killAction,
                    trueGameAction: AbilityDsl.actions.chooseAction((context) => ({
                        player: Players.Opponent,
                        activePromptTitle: 'Select one',
                        options: {
                            [`Discard ${discardCount} random cards from hand`]: {
                                action: discardFromHandAction,
                                message: '{0} distracts the Shinobi'
                            },
                            [`Discard ${context.target.name}`]: {
                                action: killAction,
                                message: `{0} refuses to discard ${discardCount} cards. {2} is discarded`
                            }
                        },
                        messageArgs: [context.target]
                    }))
                };
            }),
            effect: 'ambush {1}',
            effectArgs: (context) => context.target ?? ''
        });
    }
}
