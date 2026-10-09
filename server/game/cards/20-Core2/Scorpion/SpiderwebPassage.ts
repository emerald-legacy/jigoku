import { msg } from '../../../GameChat.js';
import type { AbilityContext } from '../../../AbilityContext.js';
import { CardType, Players } from '../../../Constants.js';
import * as costs from '../../../costs/index.js';
import { chooseAction, conditional, discardAtRandom, discardFromPlay } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

function shinobiCount(context: AbilityContext): number {
    return (
        context.game.currentConflict?.getParticipants(
            (card) => card.controller === context.player && card.hasTrait('shinobi')
        ).length ?? 0
    );
}

export default class SpiderwebPassage extends DrawCard {
    static id = 'spiderweb-passage';

    setupCardAbilities() {
        this.action('Discard a participating character with 0 skill')
            .cost(costs.sacrificeSelf())
            .condition((context) => shinobiCount(context) > 0)
            .target({
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card) =>
                    card.isParticipating() &&
                    ((!card.hasDash('political') && card.politicalSkill === 0) ||
                        (!card.hasDash('military') && card.militarySkill === 0))
            })
            .gameAction(conditional((context) => {
                const discardCount = shinobiCount(context);
                const discardFromHandAction = discardAtRandom({
                    amount: discardCount,
                    target: context.player.opponent
                });
                const killAction = discardFromPlay({ target: context.target });

                return {
                    condition: () =>
                        (context.player.opponent?.hand.length ?? 0) >= discardCount &&
                        !!context.player.opponent && discardFromHandAction.canAffect(context.player.opponent, context),
                    falseGameAction: killAction,
                    trueGameAction: chooseAction((context) => ({
                        player: Players.Opponent,
                        activePromptTitle: 'Select one',
                        choices: {
                            [`Discard ${discardCount} random cards from hand`]: {
                                action: discardFromHandAction,
                                message: (_context, _target, player) => msg`${player} distracts the Shinobi`
                            },
                            [`Discard ${context.target?.name}`]: {
                                action: killAction,
                                message: (context, _target, player) => msg`${player} refuses to discard ${discardCount} cards. ${context.target} is discarded`
                            }
                        }
                    }))
                };
            }))
            .chatText((context) => msg`ambush ${context.target}`);
    }
}
