import { CardType } from '../../../Constants.js';
import { cannotReceiveDishonorToken } from '../../../effects.js';
import { honor } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class EminentHistorian extends DrawCard {
    static id = 'eminent-historian';

    override setupCardAbilities() {
        this.persistentEffect({
            effect: cannotReceiveDishonorToken()
        });

        this.conflictAction('Honor a character', { evenFromHome: true })
            .ifCondition((context) => !context.player.opponent?.isMoreHonorable())
            .target({
                cardType: CardType.Character,
                cardCondition: (card, context) => card.isParticipatingFor(context.player)
            }, honor());
    }
}
