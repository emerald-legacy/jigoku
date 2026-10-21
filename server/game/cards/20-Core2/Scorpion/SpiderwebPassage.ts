import { msg } from '../../../GameChat.js';
import type { AbilityContext } from '../../../AbilityContext.js';
import { CardType, Players, SkillType, Trait } from '../../../Constants.js';
import * as costs from '../../../costs/index.js';
import { chatMessage, discardAtRandom, discardFromPlay, joint } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

function shinobiCount(context: AbilityContext): number {
    return (
        context.game.currentConflict?.getParticipants(
            (card) => card.controller === context.player && card.hasTrait(Trait.Shinobi)
        ).length ?? 0
    );
}

export default class SpiderwebPassage extends DrawCard {
    static id = 'spiderweb-passage';

    override setupCardAbilities() {
        this.conflictAction('Discard a participating character with 0 skill')
            .ifCondition((context) => shinobiCount(context) > 0)
            .cost(costs.sacrificeSelf())
            .target({
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card) =>
                    card.isParticipating() &&
                    ((!card.hasDash(SkillType.Political) && card.politicalSkill === 0) ||
                        (!card.hasDash(SkillType.Military) && card.militarySkill === 0))
            })
            // "Its controller selects one" is before the dash: made with the target (RRG Select)
            .selectFrom({
                name: 'select',
                dependsOn: 'target',
                player: Players.Opponent
            }, (context) => ({
                // a smaller hand can still be discarded: the option changes the game state (RRG Select)
                [`Discard ${shinobiCount(context)} random cards from hand`]: joint([
                    discardAtRandom({
                        amount: shinobiCount(context),
                        target: context.player.opponent
                    }),
                    chatMessage(() => msg`${context.player.opponent} distracts the Shinobi`)
                ]),
                [`Discard ${context.target?.name}`]: joint([
                    discardFromPlay({ target: context.target }),
                    // with an empty hand there was nothing to refuse
                    chatMessage(() => (context.player.opponent?.hand.length ?? 0) > 0
                        ? msg`${context.player.opponent} refuses to discard ${shinobiCount(context)} cards. ${context.target} is discarded`
                        : undefined)
                ])
            }))
            .chatText((context) => msg`ambush ${context.target}`);
    }
}
