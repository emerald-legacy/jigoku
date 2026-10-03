import { Players, CardType } from '../../../Constants.js';
import type { AbilityContext } from '../../../AbilityContext.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

const MAX_FATE = 3;

export default class AppeasingTheRestless extends DrawCard {
    static id = 'appeasing-the-restless';

    setupCardAbilities() {
        this.action('Place fates on spirits')
            .cost(AbilityDsl.costs.bow({
                cardType: CardType.Character,
                cardCondition: (card) => card.hasTrait('shugenja')
            }))
            .condition((context) => this.canMoveFate(context) && context.player.cardsInPlay.some((card) => this.canReceiveFate(card, context)))
            .handler((context) => {
                this.moveFate(context, MAX_FATE);
                context.game.queueSimpleStep(() => this.injure(context, context.costs.bow));
            })
            .effect('move up to 3 fate onto Spirit characters{1}{2}', (context) => context.player.hasAffinity('void', context) ? ['', ''] : [' and injure ', context.costs.bow])
            .cannotTargetFirst();
    }

    private canMoveFate(context: AbilityContext) {
        return context.player.fate > 0 && context.player.checkRestrictions('spendFate', context);
    }

    private canReceiveFate(card: DrawCard, context: AbilityContext) {
        return card.hasTrait('spirit') && AbilityDsl.actions.placeFate({ origin: context.player }).canAffect(card, context);
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
                context.game.addMessage('{0} moves 1 fate from their pool onto {1}', player, card);
                AbilityDsl.actions.placeFate({ origin: player }).resolve(card, context);
                context.game.queueSimpleStep(() => this.moveFate(context, remaining - 1));
                return true;
            }
        });
    }

    private injure(context: AbilityContext, bowed: DrawCard | undefined) {
        if(!bowed || context.player.hasAffinity('void', context)) {
            return;
        }
        (bowed.getFate() === 0 ? AbilityDsl.actions.discardFromPlay() : AbilityDsl.actions.removeFate()).resolve(bowed, context);
    }
}
