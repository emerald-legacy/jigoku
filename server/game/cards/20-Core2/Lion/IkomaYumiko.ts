import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../drawcard.js';
import Player from '../../../player.js';

export default class IkomaYumiko extends DrawCard {
    static id = 'ikoma-yumiko';

    setupCardAbilities() {
        this.persistentEffect({
            effect: [
                AbilityDsl.effects.modifyBothSkills(
                    (card: any, context: any) =>
                        (context.player.opponent as undefined | Player)?.cardsInPlay.reduce(
                            (total: number, char: DrawCard) => (char.isDishonored ? total + 1 : total),
                            0
                        ) ?? 0
                )
            ]
        });

        this.reaction({
            title: 'Claim Imperial favor',
            when: {
                onCharacterEntersPlay: (event, context) => event.card === context.source
            },
            effect: 'claim the Emperor\'s favor',
            gameAction: AbilityDsl.actions.claimImperialFavor((context) => ({
                target: context.player
            }))
        });
    }
}
