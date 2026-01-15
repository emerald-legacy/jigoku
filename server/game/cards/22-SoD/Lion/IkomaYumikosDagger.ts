import { CardTypes, Players, TargetModes } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class IkomaYumikosDagger extends DrawCard {
    static id = 'ikoma-yumiko-s-dagger';

    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Prevent discarding the Imperial Favor',
            when: {
                onDiscardFavor: (event, context) => event.player === context.player &&
                    context.source.allowGameAction('discardFromPlay', context)
            },
            effect: 'discard itself instead of the Imperial Favor',
            effectArgs: context => context.event.player,
            gameAction: AbilityDsl.actions.cancel(context => ({
                target: context.source,
                replacementGameAction: AbilityDsl.actions.discardFromPlay()
            }))
        });

        this.action({
            title: 'Injure a character',
            target: {
                cardType: CardTypes.Character,
                controller: Players.Opponent,
                cardCondition: (card, context) => card.isParticipating() && card.printedCost <= context.source.printedCost,
                gameAction: AbilityDsl.actions.multiple([
                    AbilityDsl.actions.conditional(context => ({
                        condition: () => context.target.getFate() === 0,
                        trueGameAction: AbilityDsl.actions.discardFromPlay({ target: context.target }),
                        falseGameAction: AbilityDsl.actions.removeFate({ target: context.target })
                    })),
                    AbilityDsl.actions.conditional(context => ({
                        condition: () => context.source.getFate() === 0,
                        trueGameAction: AbilityDsl.actions.discardFromPlay({ target: context.source }),
                        falseGameAction: AbilityDsl.actions.removeFate({ target: context.source })
                    }))
                ])
            },
            effect: 'injure itself and {0}'
        });
    }
}
