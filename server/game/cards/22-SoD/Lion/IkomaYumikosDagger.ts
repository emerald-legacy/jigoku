import { CardType } from '../../../Constants.js';
import { discardFromPlay, injure, multiple } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class IkomaYumikosDagger extends DrawCard {
    static id = 'ikoma-yumiko-s-dagger';

    override setupCardAbilities() {
        this.wouldInterrupt('Prevent discarding the Imperial Favor')
            .when({
                onDiscardFavor: (event, context) => event.player === context.player &&
                    discardFromPlay().canAffect(context.source, context)
            })
            .cancel((context) => ({
                target: context.source,
                replacementGameAction: discardFromPlay()
            }))
            .chatText('discard itself instead of the Imperial Favor');

        this.conflictAction('Injure a character')
            .target({
                cardType: CardType.Character,
                cardCondition: (card, context) =>
                    !!context.player.opponent &&
                    card.isParticipatingFor(context.player.opponent) &&
                    card.costAtMost(context.source.getCost())
            }, multiple([
                injure(),
                injure((context) => ({ target: context.source }))
            ]))
            .chatText('injure itself and {0}');
    }
}
