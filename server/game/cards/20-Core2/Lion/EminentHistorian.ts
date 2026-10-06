import { CardType, Players } from '../../../Constants.js';
import { cannotReceiveDishonorToken } from '../../../effects.js';
import { honor } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class EminentHistorian extends DrawCard {
    static id = 'eminent-historian';

    setupCardAbilities() {
        this.persistentEffect({
            effect: cannotReceiveDishonorToken()
        });

        this.conflictAction('Honor a character', { evenFromHome: true })
            .condition((context) => !context.player.opponent?.isMoreHonorable())
            .target({
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card) => card.isParticipating()
            }, honor());
    }
}
