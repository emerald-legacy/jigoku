import { modifyBothSkills } from '../../../effects.js';
import DrawCard from '../../../DrawCard.js';

export default class IkomaYumiko extends DrawCard {
    static id = 'ikoma-yumiko';

    setupCardAbilities() {
        this.persistentEffect({
            effect: [
                modifyBothSkills(
                    (_card, context) =>
                        context.player.opponent?.cardsInPlay.reduce(
                            (total, char) => (char.isDishonored ? total + 1 : total),
                            0
                        ) ?? 0
                )
            ]
        });

        this.reaction('Claim Imperial favor')
            .when({
                onCharacterEntersPlay: (event, context) => event.card === context.source
            })
            .claimImperialFavor()
            .chatText('claim the Emperor\'s favor');
    }
}
