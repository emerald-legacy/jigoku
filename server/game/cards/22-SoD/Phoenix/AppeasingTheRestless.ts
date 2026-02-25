import { TargetModes, Players, CardTypes } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';
import BaseCard from '../../../basecard';

export default class AppeasingTheRestless extends DrawCard {
    static id = 'appeasing-the-restless';

    setupCardAbilities() {
        this.action({
            title: 'Place fates on spirits',
            cost: AbilityDsl.costs.bow({
                cardType: CardTypes.Character,
                cardCondition: (card: BaseCard) => card.hasTrait('shugenja')
            }),
            cannotTargetFirst: true,
            effect: 'choose up to 3 spirits to place fate on{1}{2}',
            effectArgs: context => context.player.hasAffinity('void') ? ['', ''] : [' and injure ', context.costs.bow],
            condition: context => context.player.fate > 0 && context.player.checkRestrictions('spendFate', context) || !context.player.hasAffinity('void'),
            gameAction: AbilityDsl.actions.multipleContext(context => {
                const gameActions = [];

                if(context.player.fate > 0 && context.player.checkRestrictions('spendFate', context)) {
                    gameActions.push(AbilityDsl.actions.selectCard(context => ({
                        activePromptTitle: 'Select spirits',
                        targets: false,
                        mode: TargetModes.UpToVariable,
                        numCardsFunc: (context) => context.player.fate,
                        optional: true,
                        cardType: CardTypes.Character,
                        controller: Players.Self,
                        cardCondition: card => card.hasTrait('spirit') && card.allowGameAction('placeFate', context),
                        message: '{0} moves fate from their pool onto {1}',
                        messageArgs: cards => [context.player, cards],
                        gameAction: AbilityDsl.actions.placeFate({
                            origin: context.player
                        })
                    })));
                }

                if(!context.player.hasAffinity('void')) {
                    gameActions.push(AbilityDsl.actions.conditional({
                        condition: () => (context.costs.bow?.getFate() ?? 0) === 0,
                        trueGameAction: AbilityDsl.actions.discardFromPlay({ target: context.costs.bow }),
                        falseGameAction: AbilityDsl.actions.removeFate({ target: context.costs.bow })
                    }));
                }

                return { gameActions };
            })
        });
    }
}
