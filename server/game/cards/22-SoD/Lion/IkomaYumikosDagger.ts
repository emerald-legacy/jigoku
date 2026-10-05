import { CardType, Players } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class IkomaYumikosDagger extends DrawCard {
    static id = 'ikoma-yumiko-s-dagger';

    setupCardAbilities() {
        this.wouldInterrupt('Prevent discarding the Imperial Favor')
            .when({
                onDiscardFavor: (event, context) => event.player === context.player &&
                    context.source.allowGameAction('discardFromPlay', context)
            })
            .gameAction(AbilityDsl.actions.cancel(context => ({
                target: context.source,
                replacementGameAction: AbilityDsl.actions.discardFromPlay()
            })))
            .effect('discard itself instead of the Imperial Favor', context => context.event.player ?? '');

        this.action('Injure a character')
            .condition((context) => context.source.isParticipating())
            .target({
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card, context) => card.isParticipating() && (card.printedCost ?? 0) <= (context.source.printedCost ?? 0)
            }, AbilityDsl.actions.multiple([
                AbilityDsl.actions.injure(),
                AbilityDsl.actions.injure((context) => ({ target: context.source }))
            ]))
            .effect('injure itself and {0}');
    }
}
