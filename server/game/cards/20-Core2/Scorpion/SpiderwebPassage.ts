import { msg } from '../../../GameChat.js';
import type { AbilityContext } from '../../../AbilityContext.js';
import { CardType, Players, Trait } from '../../../Constants.js';
import * as costs from '../../../costs/index.js';
import { chatMessage, discardAtRandom, discardFromPlay, joint } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

function controlsParticipatingShinobi(context: AbilityContext): boolean {
    return context.player.charactersInPlay.some((card) => card.isParticipating() && card.hasTrait(Trait.Shinobi));
}

function shinobiCount(context: AbilityContext): number {
    return context.game.currentConflict?.getCharacters(context.player).filter((card) => card.hasTrait(Trait.Shinobi)).length ?? 0;
}

export default class SpiderwebPassage extends DrawCard {
    static id = 'spiderweb-passage';

    override setupCardAbilities() {
        this.conflictAction('Discard a participating character with 0 skill')
            .ifCondition((context) => controlsParticipatingShinobi(context))
            .cost(costs.sacrificeSelf())
            .target({
                cardType: CardType.Character,
                cardCondition: (card, context) =>
                    !!context.player.opponent &&
                    card.isParticipatingFor(context.player.opponent) &&
                    (card.politicalSkill === 0 || card.militarySkill === 0)
            })
            // "Its controller selects one" is before the dash: made with the target (RRG Select)
            .selectFrom({
                name: 'select',
                dependsOn: 'target',
                player: (context) => context.target.controller === context.player ? Players.Self : Players.Opponent
            }, (context) => {
                const targetController = context.target?.controller ?? context.player.opponent;
                return {
                    // a smaller hand can still be discarded: the option changes the game state (RRG Select)
                    [`Discard ${shinobiCount(context)} random card${shinobiCount(context) === 1 ? '' : 's'} from hand`]: joint([
                        discardAtRandom({
                            amount: shinobiCount(context),
                            target: targetController
                        }),
                        chatMessage(() => msg`${targetController} distracts the Shinobi`)
                    ]),
                    [`Discard ${context.target?.name}`]: joint([
                        discardFromPlay({ target: context.target }),
                        // with an empty hand there was nothing to refuse
                        chatMessage(() => (targetController?.hand.length ?? 0) > 0
                            ? msg`${targetController} refuses to discard ${shinobiCount(context)} card${shinobiCount(context) === 1 ? '' : 's'}. ${context.target} is discarded`
                            : undefined)
                    ])
                };
            })
            .chatText((context) => msg`ambush ${context.target}`);
    }
}
