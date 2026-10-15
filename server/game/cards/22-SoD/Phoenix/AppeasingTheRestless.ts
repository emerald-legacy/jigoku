import { msg } from '../../../GameChat.js';
import { Players, CardType, RestrictionType, Trait } from '../../../Constants.js';
import type { AbilityContext } from '../../../AbilityContext.js';
import * as costs from '../../../costs/index.js';
import { handler, placeFate } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

const MAX_FATE = 3;

export default class AppeasingTheRestless extends DrawCard {
    static id = 'appeasing-the-restless';

    override setupCardAbilities() {
        this.action('Place fates on spirits')
            .condition((context) => this.canMoveFate(context) && context.player.cardsInPlay.some((card) => this.canReceiveFate(card, context)))
            .cost(costs.bow({
                cardType: CardType.Character,
                cardCondition: (card) => card.hasTrait(Trait.Shugenja)
            }))
            .gameAction(handler({ handler: (context) => this.moveFate(context, MAX_FATE) }))
            .chatText((context) => context.player.hasAffinity(Trait.Void, context)
                ? msg`move up to 3 fate onto Spirit characters`
                : msg`move up to 3 fate onto Spirit characters and injure ${context.costs.bow}`)
            .cannotTargetFirst()
            .afterwards()
            .if((context) => !context.player.hasAffinity(Trait.Void, context))
            .injure((context) => ({ target: context.costs.bow }));
    }

    private canMoveFate(context: AbilityContext) {
        return context.player.fate > 0 && context.player.checkRestrictions(RestrictionType.SpendFate, context);
    }

    private canReceiveFate(card: DrawCard, context: AbilityContext) {
        return card.hasTrait(Trait.Spirit) && placeFate({ origin: context.player }).canAffect(card, context);
    }

    // One fate per pick, so a spirit may be picked more than once
    private moveFate(context: AbilityContext, remaining: number) {
        if(remaining === 0 || !this.canMoveFate(context)) {
            return;
        }
        context.game.promptForSelect(context.player, {
            activePromptTitle: 'Choose a spirit to receive 1 fate',
            context: context,
            cardType: CardType.Character,
            controller: Players.Self,
            hideIfNoLegalTargets: true,
            cardCondition: (card) => this.canReceiveFate(card, context),
            buttons: [{ text: 'Done', arg: 'done' }],
            onSelect: (player, card) => {
                context.game.addMessage(msg`${player} moves 1 fate from their pool onto ${card}`);
                placeFate({ origin: player }).resolve(card, context);
                context.game.queueSimpleStep(() => this.moveFate(context, remaining - 1));
                return true;
            }
        });
    }
}
