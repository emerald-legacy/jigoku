import { msg } from '../../../GameChat.js';
import { CardType, Players } from '../../../Constants.js';
import type { AbilityContext } from '../../../AbilityContext.js';
import type { Duel } from '../../../Duel.js';
import { placeFateOnRing, sequential, switchConflictElement } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class RightsOfTheChallenged extends DrawCard {
    static id = 'rights-of-the-challenged';

    public setupCardAbilities() {
        const hasReplacement = (duel: Duel, target: DrawCard, context: AbilityContext) =>
            target.controller === context.player &&
            context.player.cardsInPlay.some((card) => duel.canReplaceTarget(target, card, context));

        this.duelChallenge('Replace a challenged character', (duel, context) =>
            duel.targets.some((target) => hasReplacement(duel, target, context))
        )
            .target({
                name: 'challenged',
                activePromptTitle: 'Choose a challenged character',
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card, context) =>
                    context.event.duel.targets.includes(card) && hasReplacement(context.event.duel, card, context)
            })
            .target({
                name: 'replacement',
                dependsOn: 'challenged',
                activePromptTitle: 'Choose a character to replace it',
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card, context) =>
                    !!context.targets.challenged && context.event.duel.canReplaceTarget(context.targets.challenged, card, context)
            })
            .handler((context) => context.event.duel.replaceTarget(context.targets.challenged, context.targets.replacement))
            .chatText((context) => msg`replace ${context.targets.challenged} with ${context.targets.replacement} in the duel`);

        this.reaction('Force attacker to attack with another ring')
            .when({
                onConflictStarted: (_, context) => context.player.isDefendingPlayer()
            })
            .ringTarget({
                activePromptTitle: 'Choose a ring to use instead',
                player: Players.Opponent,
                ringCondition: (ring) => ring.isUnclaimed() && !ring.isRemovedFromGame()
            }, sequential([
                placeFateOnRing((context) => ({
                    origin: context.ring,
                    target: context.game.currentConflict?.ring,
                    amount: context.ring?.fate
                })),
                switchConflictElement()
            ]))
            .chatText('move all fate from the {0} and switch it with the contested ring');
    }
}
