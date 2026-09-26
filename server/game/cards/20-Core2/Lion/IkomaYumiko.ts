import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class IkomaYumiko extends DrawCard {
    static id = 'ikoma-yumiko';

    setupCardAbilities() {
        this.persistentEffect({
            effect: [
                AbilityDsl.effects.modifyBothSkills(
                    (card, context) =>
                        (context.player.opponent)?.cardsInPlay.reduce(
                            (total: number, char: DrawCard) => (char.isDishonored ? total + 1 : total),
                            0
                        ) ?? 0
                )
            ]
        });

        this.reaction('Claim Imperial favor')
            .when({
                onCharacterEntersPlay: (event, context) => event.card === context.source
            })
            .gameAction(AbilityDsl.actions.claimImperialFavor((context) => ({
                target: context.player
            })))
            .effect('claim the Emperor\'s favor');
    }
}
