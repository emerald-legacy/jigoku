import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';

class MotoNergui extends DrawCard {
    static id = 'moto-nergui';

    setupCardAbilities() {
        this.action({
            title: 'Move highest glory character home',
            condition: context => this.game.isDuringConflict('military') && context.source.isParticipating(),
            target: {
                cardCondition: (card: any, context: any) => {
                    let participants = context.game.currentConflict.getParticipants();
                    return participants.includes(card) && card.getGlory() === Math.max(...participants.map((c: any) => c.getGlory()));
                },
                gameAction: AbilityDsl.actions.sendHome()
            }
        });
    }
}


export default MotoNergui;
