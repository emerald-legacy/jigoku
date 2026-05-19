import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';

class MotoNergui extends DrawCard {
    static id = 'moto-nergui';

    setupCardAbilities() {
        this.action({
            title: 'Move highest glory character home',
            condition: context => this.game.isDuringConflict('military') && context.source.isParticipating(),
            target: {
                cardCondition: (card, context) => {
                    let participants = context.game.currentConflict.getParticipants();
                    return participants.includes(card) && card.getGlory() === Math.max(...participants.map(c => c.getGlory()));
                },
                gameAction: AbilityDsl.actions.sendHome()
            }
        });
    }
}


export default MotoNergui;
