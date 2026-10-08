import { CardType, Players } from '../../../Constants.js';
import { discardFromPlay, injure, multiple } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class IkomaYumikosDagger extends DrawCard {
    static id = 'ikoma-yumiko-s-dagger';

    setupCardAbilities() {
        this.wouldInterrupt('Prevent discarding the Imperial Favor')
            .when({
                onDiscardFavor: (event, context) => event.player === context.player &&
                    context.source.allowGameAction('discardFromPlay', context)
            })
            .cancel(context => ({
                target: context.source,
                replacementGameAction: discardFromPlay()
            }))
            .chatText('discard itself instead of the Imperial Favor', context => context.event.player ?? '');

        this.conflictAction('Injure a character')
            .target({
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card, context) => card.isParticipating() && (card.printedCost ?? 0) <= (context.source.printedCost ?? 0)
            }, multiple([
                injure(),
                injure((context) => ({ target: context.source }))
            ]))
            .chatText('injure itself and {0}');
    }
}
