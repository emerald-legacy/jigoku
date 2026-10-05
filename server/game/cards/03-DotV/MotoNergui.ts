import { CardType, ConflictType } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class MotoNergui extends DrawCard {
    static id = 'moto-nergui';

    setupCardAbilities() {
        this.action('Move highest glory character home')
            .condition(context => this.game.isDuringConflict(ConflictType.Military) && context.source.isParticipating())
            .target({
                cardType: CardType.Character,
                cardCondition: (card, context) => {
                    const participants = (context.game.currentConflict?.getParticipants() ?? []);
                    return participants.includes(card) && card.getGlory() === Math.max(...participants.map((c) => c.getGlory()));
                }
            }, AbilityDsl.actions.sendHome());
    }
}


export default MotoNergui;
