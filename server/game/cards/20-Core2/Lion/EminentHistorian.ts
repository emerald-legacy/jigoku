import { CardTypes, Players } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class EminentHistorian extends DrawCard {
    static id = 'eminent-historian';

    setupCardAbilities() {
        this.persistentEffect({
            effect: AbilityDsl.effects.cardCannot('receiveDishonorToken')
        });

        this.action({
            title: 'Honor a character',
            condition: (context) => !context.player.opponent?.isMoreHonorable(),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Self,
                cardCondition: (card) => card.isParticipating(),
                gameAction: AbilityDsl.actions.honor()
            }
        });
    }
}
