import { CardType } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class MotoNergui extends DrawCard {
    static id = 'moto-nergui';

    setupCardAbilities() {
        this.action('Move highest glory character home')
            .condition(context => this.game.isDuringConflict('military') && context.source.isParticipating())
            .target('target', {
                cardType: CardType.Character,
                cardCondition: (card, context) => {
                    let participants = (context.game.currentConflict?.getParticipants() ?? []);
                    return participants.includes(card) && card.getGlory() === Math.max(...participants.map((c: DrawCard) => c.getGlory()));
                }
            }, AbilityDsl.actions.sendHome());
    }
}


export default MotoNergui;
